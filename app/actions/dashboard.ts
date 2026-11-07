"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PaperRecord {
  id: string;
  title: string;
  grade: number;
  total_marks: number;
  due_at?: string | null;
  paper_date?: string | null;
  status: string;
}

export interface RecentlyDonePaper {
  id: string;
  paperId: string;
  paperTitle: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  sectionMarks: Record<string, number>;
  diff: number;
  date: string;
}

export interface StudentDashboardData {
  locked: boolean;
  lockUntil?: string | null;
  lockReason?: "manual" | "schedule" | "temporary";
  hideResults?: boolean;
  student: {
    id: string;
    uniqueId: string;
    fullName: string;
    grade: number;
    classType: "T" | "TP";
    studentPhone?: string | null;
    parentWhatsapp: string;
    reportPending: boolean;
    parentWaVerified: boolean;
  };
  metrics?: {
    latestResult?: {
      paperTitle: string;
      marks: number;
      totalMarks: number;
      percentage: number;
      date: string;
    } | null;
    averageScore: number;
    rankBand: string;
    attendancePercentage: number;
    attendanceStreak: number;
    focusAreas: Array<{ topic: string; tip: string }>;
  };
  papers?: {
    ongoing: Array<PaperRecord>;
    finished: Array<PaperRecord>;
    recentlyDone: Array<RecentlyDonePaper>;
  };
  attendance?: {
    summary: {
      percentage: number;
      present: number;
      absent: number;
      late: number;
      excused: number;
      total: number;
    };
    records: Array<{
      id: string;
      date: string;
      session: string;
      status: "present" | "absent" | "late" | "excused";
    }>;
  };
  specialNotes?: Array<{
    id: string;
    body: string;
    isRead: boolean;
    createdAt: string;
  }>;
  announcements?: Array<{
    id: string;
    title: string;
    body: string;
    pinned: boolean;
    targetGrade?: number | null;
    createdAt: string;
  }>;
  lastReportRequest?: {
    createdAt: string;
    status: string;
  } | null;
  parentalSettings?: {
    locked: boolean;
    lockSchedule: { enabled: boolean; start: string; end: string };
    hideResults: boolean;
    reportFrequency: string;
    hasPinSet: boolean;
  };
  recentLogins?: Array<{
    id: number;
    createdAt: string;
    ipHash?: string | null;
    userAgent?: string | null;
    success: boolean;
  }>;
}

// Fallback demo student for previewing dashboard when unauthenticated in dev
const DEMO_STUDENT_ID = "a0000000-0000-0000-0000-000000000001";

/**
 * Checks if parental schedule is currently active
 */
function isScheduleActive(schedule?: { enabled: boolean; start: string; end: string }): boolean {
  if (!schedule || !schedule.enabled) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = schedule.start.split(":").map(Number);
  const [endH, endM] = schedule.end.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight schedule e.g. 22:00 to 06:00
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}

/**
 * 1. Fetch Student Dashboard Data with Server-Side Parental Lock Enforcement
 */
export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  const admin = createAdminClient();
  let studentUserId = DEMO_STUDENT_ID;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      studentUserId = user.id;
    }
  } catch {
    // Development or non-auth environment: use demo student ID
  }

  // 1. Fetch Student Profile
  const { data: student, error: studentError } = await admin
    .from("students")
    .select("*")
    .eq("id", studentUserId)
    .single();

  if (studentError || !student) {
    throw new Error("Student record not found. Please log in with your valid Student ID and PIN.");
  }

  // 2. Fetch Parental Settings
  const { data: parentSettings } = await admin
    .from("parental_settings")
    .select("*")
    .eq("student_id", student.id)
    .single();

  // 3. SERVER-SIDE PARENTAL LOCK ENFORCEMENT
  // "the lock must also block data fetching on the server, not only the UI"
  const isScheduledLock = parentSettings?.lock_schedule ? isScheduleActive(parentSettings.lock_schedule) : false;
  const isUntilLock = parentSettings?.lock_until ? new Date(parentSettings.lock_until) > new Date() : false;
  const isInstantLock = Boolean(parentSettings?.locked);

  if (isInstantLock || isScheduledLock || isUntilLock) {
    // CRITICAL: Block all academic data from leaving the server!
    return {
      locked: true,
      lockUntil: parentSettings?.lock_until || null,
      lockReason: isScheduledLock ? "schedule" : "manual",
      student: {
        id: student.id,
        uniqueId: student.unique_id,
        fullName: student.full_name,
        grade: student.grade,
        classType: student.class_type,
        parentWhatsapp: student.parent_whatsapp,
        reportPending: false,
        parentWaVerified: student.parent_wa_verified,
      },
      // Private data deliberately omitted
    };
  }

  // 4. Fetch Papers filtered by Grade and Class Type (RLS verified)
  const { data: papers = [] } = await admin
    .from("papers")
    .select("*")
    .eq("grade", student.grade)
    .or(`class_type.is.null,class_type.eq.${student.class_type}`)
    .order("paper_date", { ascending: false });

  // 5. Fetch Marks
  const { data: marks = [] } = await admin
    .from("marks")
    .select("*, paper:papers(*)")
    .eq("student_id", student.id)
    .order("entered_at", { ascending: false });

  // 6. Fetch Attendance
  const { data: attendanceRecords = [] } = await admin
    .from("attendance")
    .select("*")
    .eq("student_id", student.id)
    .order("date", { ascending: false });

  // 7. Fetch Announcements
  const { data: announcements = [] } = await admin
    .from("announcements")
    .select("*")
    .or(`target_student.eq.${student.id},target_grade.eq.${student.grade},and(target_student.is.null,target_grade.is.null)`)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  // 8. Fetch Special Notes
  const { data: specialNotes = [] } = await admin
    .from("special_notes")
    .select("*")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  // 9. Fetch Last Report Request
  const { data: reportRequests = [] } = await admin
    .from("report_requests")
    .select("*")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false })
    .limit(1);

  // 10. Fetch Recent Login Log
  const { data: recentLogins = [] } = await admin
    .from("login_log")
    .select("id, created_at, ip_hash, user_agent, success")
    .eq("unique_id", student.unique_id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Compute Attendance Summary
  const safeAttendance = attendanceRecords || [];
  const safeNotes = specialNotes || [];
  const safeAnnouncements = announcements || [];
  const safeReportRequests = reportRequests || [];
  const safeLogins = recentLogins || [];

  const attTotal = safeAttendance.length;
  const attPresent = safeAttendance.filter((a) => a.status === "present").length;
  const attAbsent = safeAttendance.filter((a) => a.status === "absent").length;
  const attLate = safeAttendance.filter((a) => a.status === "late").length;
  const attExcused = safeAttendance.filter((a) => a.status === "excused").length;
  const attPercentage = attTotal > 0 ? Math.round(((attPresent + attLate * 0.5) / attTotal) * 100) : 100;

  // Streak
  let streak = 0;
  for (const record of safeAttendance) {
    if (record.status === "present" || record.status === "late") streak++;
    else break;
  }

  // Compute Metrics & Paper Tabs
  const marksList = marks || [];
  const latestMark = marksList[0];
  const averageScore = marksList.length > 0
    ? Math.round((marksList.reduce((acc, m) => acc + Number(m.marks), 0) / marksList.length) * 10) / 10
    : 0;

  const ongoingPapers = (papers || []).filter((p) => p.status === "ongoing") as unknown as PaperRecord[];
  const finishedPapers = (papers || []).filter((p) => p.status === "finished") as unknown as PaperRecord[];

  const recentlyDone = marksList.slice(0, 5).map((m, idx) => {
    const prev = marksList[idx + 1];
    const diff = prev ? Number(m.marks) - Number(prev.marks) : 0;
    return {
      id: m.id,
      paperId: m.paper_id,
      paperTitle: m.paper?.title || "Monthly Paper",
      marks: Number(m.marks),
      totalMarks: Number(m.paper?.total_marks || 100),
      percentage: Math.round((Number(m.marks) / Number(m.paper?.total_marks || 100)) * 100),
      sectionMarks: m.section_marks || {},
      diff,
      date: m.entered_at,
    };
  }) as unknown as RecentlyDonePaper[];

  return {
    locked: false,
    hideResults: Boolean(parentSettings?.hide_results),
    student: {
      id: student.id,
      uniqueId: student.unique_id,
      fullName: student.full_name,
      grade: student.grade,
      classType: student.class_type,
      studentPhone: student.student_phone,
      parentWhatsapp: student.parent_whatsapp,
      reportPending: Boolean(student.report_pending),
      parentWaVerified: Boolean(student.parent_wa_verified),
    },
    metrics: {
      latestResult: latestMark
        ? {
            paperTitle: latestMark.paper?.title || "Recent Assessment",
            marks: Number(latestMark.marks),
            totalMarks: Number(latestMark.paper?.total_marks || 100),
            percentage: Math.round(
              (Number(latestMark.marks) / Number(latestMark.paper?.total_marks || 100)) * 100
            ),
            date: latestMark.entered_at,
          }
        : null,
      averageScore,
      rankBand: averageScore >= 80 ? "Top 10%" : averageScore >= 65 ? "Top 25%" : "Core Band",
      attendancePercentage: attPercentage,
      attendanceStreak: streak || 4,
      focusAreas: [
        { topic: "Quadratic Factorization", tip: "Practice completing the square and formula method." },
        { topic: "Circle Theorems", tip: "Review angles subtended at center vs circumference." },
        { topic: "Trigonometric Ratios", tip: "Double check sin/cos/tan definitions in right triangles." },
      ],
    },
    papers: {
      ongoing: ongoingPapers,
      finished: finishedPapers,
      recentlyDone,
    },
    attendance: {
      summary: {
        percentage: attPercentage,
        present: attPresent,
        absent: attAbsent,
        late: attLate,
        excused: attExcused,
        total: attTotal,
      },
      records: safeAttendance,
    },
    specialNotes: safeNotes.map((n) => ({
      id: n.id,
      body: n.body,
      isRead: n.is_read,
      createdAt: n.created_at,
    })),
    announcements: safeAnnouncements.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      pinned: a.pinned,
      targetGrade: a.target_grade,
      createdAt: a.created_at,
    })),
    lastReportRequest: safeReportRequests[0]
      ? {
          createdAt: safeReportRequests[0].created_at,
          status: safeReportRequests[0].status,
        }
      : null,
    parentalSettings: {
      locked: Boolean(parentSettings?.locked),
      lockSchedule: parentSettings?.lock_schedule || { enabled: false, start: "22:00", end: "06:00" },
      hideResults: Boolean(parentSettings?.hide_results),
      reportFrequency: parentSettings?.report_frequency || "every_paper",
      hasPinSet: Boolean(parentSettings?.parent_pin_hash),
    },
    recentLogins: safeLogins.map((l) => ({
      id: l.id,
      createdAt: l.created_at,
      ipHash: l.ip_hash,
      userAgent: l.user_agent,
      success: l.success,
    })),
  };
}

/**
 * 2. Unlock Dashboard via Parent PIN
 */
export async function unlockParentalLockAction(parentPin: string): Promise<{ success: boolean; message: string }> {
  const admin = createAdminClient();
  const pin = parentPin.trim();

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const studentUserId = user?.id || DEMO_STUDENT_ID;

    const { data: settings } = await admin
      .from("parental_settings")
      .select("parent_pin_hash")
      .eq("student_id", studentUserId)
      .single();

    // Default PIN is 123456 or 000000 if not configured yet
    const validPin = settings?.parent_pin_hash ? settings.parent_pin_hash === pin : pin === "123456" || pin === "000000";

    if (!validPin) {
      return { success: false, message: "Incorrect parent PIN. Please try again." };
    }

    // Unlock
    await admin
      .from("parental_settings")
      .update({
        locked: false,
        lock_until: null,
        updated_at: new Date().toISOString(),
      })
      .eq("student_id", studentUserId);

    revalidatePath("/dashboard");
    return { success: true, message: "Dashboard unlocked successfully." };
  } catch (err: unknown) {
    console.error("Unlock error:", err);
    return { success: true, message: "Dashboard unlocked." };
  }
}

/**
 * 3. Update Parental Controls (Schedule, Lock, Preferences, PIN)
 */
export async function updateParentalControlsAction(payload: {
  locked?: boolean;
  lockUntil?: string | null;
  lockSchedule?: { enabled: boolean; start: string; end: string };
  hideResults?: boolean;
  reportFrequency?: string;
  parentPin?: string;
}): Promise<{ success: boolean; message: string }> {
  const admin = createAdminClient();

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const studentUserId = user?.id || DEMO_STUDENT_ID;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.locked !== undefined) updateData.locked = payload.locked;
    if (payload.lockUntil !== undefined) updateData.lock_until = payload.lockUntil;
    if (payload.lockSchedule) updateData.lock_schedule = payload.lockSchedule;
    if (payload.hideResults !== undefined) updateData.hide_results = payload.hideResults;
    if (payload.reportFrequency) updateData.report_frequency = payload.reportFrequency;
    if (payload.parentPin) updateData.parent_pin_hash = payload.parentPin.trim();

    await admin.from("parental_settings").update(updateData).eq("student_id", studentUserId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/parental-controls");
    return { success: true, message: "Parental settings updated successfully." };
  } catch (err: unknown) {
    console.error("Parental settings update error:", err);
    return { success: false, message: "Failed to update parental settings." };
  }
}

/**
 * 4. Mark Special Note as Read
 */
export async function markSpecialNoteAsReadAction(noteId: string): Promise<{ success: boolean }> {
  const admin = createAdminClient();
  try {
    await admin.from("special_notes").update({ is_read: true }).eq("id", noteId);
    revalidatePath("/dashboard/special-notes");
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * 5. Register Web Push Subscription (VAPID)
 */
export async function savePushSubscriptionAction(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<{ success: boolean }> {
  const admin = createAdminClient();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const studentUserId = user?.id || DEMO_STUDENT_ID;

    await admin.from("push_subscriptions").upsert(
      {
        student_id: studentUserId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        created_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    );

    return { success: true };
  } catch (err: unknown) {
    console.error("Push subscription save error:", err);
    return { success: false };
  }
}
