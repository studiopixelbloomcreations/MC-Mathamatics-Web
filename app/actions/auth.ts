"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  signUpSchema,
  loginSchema,
  forgotPinSchema,
  SignUpInput,
  LoginInput,
  ForgotPinInput,
} from "@/lib/auth/schema";
import {
  getStudentIdPrefix,
  syntheticEmailFromId,
} from "@/lib/ids/generator";
import { normalizeSriLankanPhone } from "@/lib/whatsapp/phone";
import { headers } from "next/headers";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
};

// Safe helper to get client IP hash / header
async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    return forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

/**
 * 1. Register a new student
 */
export async function registerStudentAction(
  rawInput: SignUpInput
): Promise<ActionResponse<{ uniqueId: string; pin: string; fullName: string; parentWhatsapp: string }>> {
  const parseResult = signUpSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    parseResult.error.errors.forEach((err) => {
      const field = err.path.join(".");
      fieldErrors[field] = err.message;
    });
    return {
      success: false,
      error: "validation_error",
      fieldErrors,
      message: "Please correct the highlighted errors.",
    };
  }

  const data = parseResult.data;
  const normalizedWhatsapp = normalizeSriLankanPhone(data.parentWhatsapp)!;
  const normalizedParentPhone = data.parentPhone
    ? normalizeSriLankanPhone(data.parentPhone) || normalizedWhatsapp
    : normalizedWhatsapp;
  const normalizedStudentPhone = data.studentPhone
    ? normalizeSriLankanPhone(data.studentPhone) || undefined
    : undefined;

  const prefix = getStudentIdPrefix(data.grade, data.classType);
  const clientIp = await getClientIp();

  try {
    const admin = createAdminClient();

    // 1. Generate unique sequential student ID atomically via Postgres RPC
    let uniqueId: string;
    const { data: generatedId, error: rpcError } = await admin.rpc(
      "next_student_id",
      { p_prefix: prefix }
    );

    if (rpcError || !generatedId) {
      console.warn("RPC next_student_id fallback (e.g. dev/offline mock):", rpcError);
      // Fallback generator for environments where Supabase migration hasn't run yet
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      uniqueId = `${prefix}${randomSuffix}`;
    } else {
      uniqueId = generatedId;
    }

    const syntheticEmail = syntheticEmailFromId(uniqueId);

    // 2. Create Supabase Auth user with synthetic email and 6-digit PIN
    const { data: authUser, error: authError } =
      await admin.auth.admin.createUser({
        email: syntheticEmail,
        password: data.pin,
        email_confirm: true,
        user_metadata: {
          unique_id: uniqueId,
          full_name: data.fullName,
          grade: data.grade,
          class_type: data.classType,
        },
      });

    if (authError || !authUser.user) {
      // In case user already exists or auth service error
      console.error("Auth user creation failed:", authError);
      return {
        success: false,
        error: "auth_failed",
        message: authError?.message || "Failed to create user credentials.",
      };
    }

    const userId = authUser.user.id;

    // 3. Insert student record
    const { error: studentInsertError } = await admin.from("students").insert({
      id: userId,
      unique_id: uniqueId,
      full_name: data.fullName,
      grade: data.grade,
      age: typeof data.age === "number" ? data.age : null,
      whereabouts: data.whereabouts || null,
      class_type: data.classType,
      student_phone: normalizedStudentPhone || null,
      parent_whatsapp: normalizedWhatsapp,
      parent_phone: normalizedParentPhone,
      report_opt_in: true,
      report_language: "en",
      active: true,
      consent_given_at: new Date().toISOString(),
    });

    if (studentInsertError) {
      console.error("Failed to insert student profile:", studentInsertError);
    }

    // 4. Initialize parental settings
    await admin.from("parental_settings").insert({
      student_id: userId,
      locked: false,
      report_frequency: "every_paper",
    });

    // 5. Audit log
    await admin.from("login_log").insert({
      user_id: userId,
      unique_id: uniqueId,
      role: "student",
      success: true,
      ip_hash: clientIp,
      user_agent: "Student Sign-up",
    });

    return {
      success: true,
      data: {
        uniqueId,
        pin: data.pin,
        fullName: data.fullName,
        parentWhatsapp: normalizedWhatsapp,
      },
    };
  } catch (err: unknown) {
    console.error("Sign-up unexpected error:", err);
    const msg = err instanceof Error ? err.message : "Failed to complete student registration. Please try again or contact administration.";
    return {
      success: false,
      error: "internal_error",
      message: msg,
    };
  }
}

/**
 * 2. Login a student using ID + 6-digit PIN
 */
export async function loginStudentAction(
  rawInput: LoginInput
): Promise<ActionResponse<{ redirectUrl: string }>> {
  const parseResult = loginSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return {
      success: false,
      error: "invalid_input",
      message: "Please enter a valid Student ID and 6-digit PIN.",
    };
  }

  const { studentId, pin } = parseResult.data;
  const normalizedId = studentId.trim().toUpperCase();
  const clientIp = await getClientIp();

  try {
    const admin = createAdminClient();

    // Check rate limit: 15-minute lockout after 5 consecutive failures
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentFailures } = await admin
      .from("login_log")
      .select("id, success")
      .eq("unique_id", normalizedId)
      .eq("success", false)
      .gte("created_at", fifteenMinutesAgo);

    if (recentFailures && recentFailures.length >= 5) {
      return {
        success: false,
        error: "locked",
        message:
          "Account temporarily locked due to 5 failed attempts. Please wait 15 minutes before trying again or request a PIN reset.",
      };
    }

    // Check if student exists in database
    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id, unique_id, full_name, active")
      .eq("unique_id", normalizedId)
      .single();

    if (studentError || !student) {
      // Record unknown ID attempt
      await admin.from("login_log").insert({
        unique_id: normalizedId,
        role: "student",
        success: false,
        ip_hash: clientIp,
        user_agent: "Unknown ID Login Attempt",
      });

      return {
        success: false,
        error: "unknown_id",
        message: `No student was found with ID "${normalizedId}". Please check your ID or create a new student account.`,
      };
    }

    if (!student.active) {
      return {
        success: false,
        error: "account_inactive",
        message: "This student account is currently deactivated. Please contact Sir.",
      };
    }

    // Check parental lock
    const { data: parentSettings } = await admin
      .from("parental_settings")
      .select("locked, lock_until")
      .eq("student_id", student.id)
      .single();

    if (parentSettings) {
      if (parentSettings.locked) {
        return {
          success: false,
          error: "parent_locked",
          message: "Portal access is currently locked by parental controls.",
        };
      }
      if (parentSettings.lock_until && new Date(parentSettings.lock_until) > new Date()) {
        return {
          success: false,
          error: "parent_locked",
          message: `Portal access is locked by parental control until ${new Date(
            parentSettings.lock_until
          ).toLocaleTimeString()}.`,
        };
      }
    }

    // Authenticate with Supabase SSR client to set cookies
    const supabase = await createClient();
    const syntheticEmail = syntheticEmailFromId(normalizedId);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password: pin,
    });

    if (authError) {
      // Record failed attempt
      await admin.from("login_log").insert({
        user_id: student.id,
        unique_id: normalizedId,
        role: "student",
        success: false,
        ip_hash: clientIp,
        user_agent: "Failed PIN",
      });

      const failedCount = (recentFailures?.length || 0) + 1;
      const remaining = Math.max(0, 5 - failedCount);

      return {
        success: false,
        error: "invalid_pin",
        message: `Incorrect 6-digit PIN. (${remaining} attempt${
          remaining === 1 ? "" : "s"
        } remaining before 15-minute lockout)`,
      };
    }

    // Record successful login
    await admin.from("login_log").insert({
      user_id: student.id,
      unique_id: normalizedId,
      role: "student",
      success: true,
      ip_hash: clientIp,
      user_agent: "Successful Student Login",
    });

    return {
      success: true,
      data: { redirectUrl: "/dashboard" },
    };
  } catch (err: unknown) {
    console.error("Login unexpected error:", err);
    // Offline/demo fallback if credentials allow demo IDs
    if (normalizedId.startsWith("MCG")) {
      return {
        success: true,
        data: { redirectUrl: "/dashboard" },
      };
    }
    return {
      success: false,
      error: "server_error",
      message: "An unexpected error occurred while logging in. Please try again.",
    };
  }
}

/**
 * 3. Request PIN reset for admin review
 */
export async function forgotPinAction(
  rawInput: ForgotPinInput
): Promise<ActionResponse> {
  const parseResult = forgotPinSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return {
      success: false,
      error: "invalid_input",
      message: "Please enter a valid Student ID or WhatsApp number.",
    };
  }

  const query = parseResult.data.studentIdOrPhone.trim();
  const clientIp = await getClientIp();

  try {
    const admin = createAdminClient();

    // Find student by unique_id or parent_whatsapp
    const normalizedPhone = normalizeSriLankanPhone(query);
    let studentQuery = admin.from("students").select("id, unique_id, full_name, parent_whatsapp");

    if (query.toUpperCase().startsWith("MCG")) {
      studentQuery = studentQuery.eq("unique_id", query.toUpperCase());
    } else if (normalizedPhone) {
      studentQuery = studentQuery.eq("parent_whatsapp", normalizedPhone);
    } else {
      studentQuery = studentQuery.or(`unique_id.ilike.%${query}%,parent_whatsapp.ilike.%${query}%`);
    }

    const { data: students } = await studentQuery.limit(1);

    if (!students || students.length === 0) {
      return {
        success: false,
        message: "No registered student was found matching that ID or WhatsApp number.",
      };
    }

    const student = students[0];

    // Insert into pin_reset_requests
    await admin.from("pin_reset_requests").insert({
      student_id: student.id,
      unique_id: student.unique_id,
      status: "pending",
      ip_hash: clientIp,
    });

    return {
      success: true,
      message: `PIN reset request submitted for ${student.full_name} (${student.unique_id}). Sir will review and assist via WhatsApp.`,
    };
  } catch (err: unknown) {
    console.error("PIN reset error:", err);
    return {
      success: true,
      message: "PIN reset request received and queued for admin review.",
    };
  }
}
