import { z } from "zod";
import { isValidSriLankanPhone } from "@/lib/whatsapp/phone";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be under 100 characters"),
    grade: z.coerce
      .number()
      .int()
      .min(6, "Grade must be between 6 and 13")
      .max(13, "Grade must be between 6 and 13"),
    age: z.coerce
      .number()
      .int()
      .min(5, "Age must be between 5 and 25")
      .max(25, "Age must be between 5 and 25")
      .optional()
      .or(z.literal("")),
    whereabouts: z
      .string()
      .trim()
      .max(100, "Location must be under 100 characters")
      .optional()
      .or(z.literal("")),
    studentPhone: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || isValidSriLankanPhone(val),
        "Invalid Sri Lankan phone number (e.g. 077 123 4567)"
      ),
    parentWhatsapp: z
      .string()
      .trim()
      .min(1, "Parent WhatsApp number is required for progress reports")
      .refine(
        (val) => isValidSriLankanPhone(val),
        "Must be a valid Sri Lankan WhatsApp number (e.g. 077 123 4567)"
      ),
    parentPhone: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || isValidSriLankanPhone(val),
        "Invalid phone number"
      ),
    classType: z.enum(["T", "TP"], {
      required_error: "Please select a class type",
    }),
    pin: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
    pinConfirm: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Confirm PIN must be exactly 6 digits"),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Parent consent is required to register",
      }),
    }),
  })
  .refine((data) => data.pin === data.pinConfirm, {
    message: "6-digit PIN and confirmation PIN do not match",
    path: ["pinConfirm"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  studentId: z
    .string()
    .trim()
    .min(1, "Student ID is required"),
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "PIN must be a 6-digit number"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPinSchema = z.object({
  studentIdOrPhone: z
    .string()
    .trim()
    .min(3, "Please enter your Student ID or registered WhatsApp number"),
});

export type ForgotPinInput = z.infer<typeof forgotPinSchema>;
