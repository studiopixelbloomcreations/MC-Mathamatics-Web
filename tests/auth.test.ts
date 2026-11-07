import { describe, it, expect } from "vitest";
import { signUpSchema, loginSchema, forgotPinSchema } from "@/lib/auth/schema";

describe("Phase 3 Auth & Sign-up Validation Schemas", () => {
  describe("Sign-up Schema Validation", () => {
    const validStudentInput = {
      fullName: "Kavindu Perera",
      grade: 10,
      age: 15,
      whereabouts: "Kurunegala",
      studentPhone: "0771234567",
      parentWhatsapp: "0779998877",
      parentPhone: "0779998877",
      classType: "TP" as const,
      pin: "123456",
      pinConfirm: "123456",
      consent: true as const,
    };

    it("accepts valid registration data", () => {
      const result = signUpSchema.safeParse(validStudentInput);
      expect(result.success).toBe(true);
    });

    it("rejects registration if parent consent is false", () => {
      const result = signUpSchema.safeParse({
        ...validStudentInput,
        consent: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain("consent");
      }
    });

    it("rejects non-matching PIN confirmation", () => {
      const result = signUpSchema.safeParse({
        ...validStudentInput,
        pin: "123456",
        pinConfirm: "654321",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain("pinConfirm");
      }
    });

    it("rejects PINs that are not exactly 6 digits", () => {
      expect(
        signUpSchema.safeParse({
          ...validStudentInput,
          pin: "12345",
          pinConfirm: "12345",
        }).success
      ).toBe(false);

      expect(
        signUpSchema.safeParse({
          ...validStudentInput,
          pin: "1234567",
          pinConfirm: "1234567",
        }).success
      ).toBe(false);

      expect(
        signUpSchema.safeParse({
          ...validStudentInput,
          pin: "abcdef",
          pinConfirm: "abcdef",
        }).success
      ).toBe(false);
    });

    it("requires a valid Sri Lankan parent WhatsApp number", () => {
      const result = signUpSchema.safeParse({
        ...validStudentInput,
        parentWhatsapp: "invalid-phone",
      });
      expect(result.success).toBe(false);
    });

    it("rejects grades outside 6 to 13 range", () => {
      expect(
        signUpSchema.safeParse({
          ...validStudentInput,
          grade: 5,
        }).success
      ).toBe(false);

      expect(
        signUpSchema.safeParse({
          ...validStudentInput,
          grade: 14,
        }).success
      ).toBe(false);
    });
  });

  describe("Login Schema Validation", () => {
    it("accepts valid student ID and 6-digit PIN", () => {
      const result = loginSchema.safeParse({
        studentId: "MCG10TP1001",
        pin: "123456",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid PIN length or characters", () => {
      expect(
        loginSchema.safeParse({
          studentId: "MCG10TP1001",
          pin: "1234",
        }).success
      ).toBe(false);

      expect(
        loginSchema.safeParse({
          studentId: "MCG10TP1001",
          pin: "abc123",
        }).success
      ).toBe(false);
    });
  });

  describe("Forgot PIN Schema Validation", () => {
    it("accepts valid student ID or WhatsApp query", () => {
      expect(
        forgotPinSchema.safeParse({
          studentIdOrPhone: "MCG10TP1001",
        }).success
      ).toBe(true);

      expect(
        forgotPinSchema.safeParse({
          studentIdOrPhone: "0771234567",
        }).success
      ).toBe(true);
    });

    it("rejects empty or too short input", () => {
      expect(
        forgotPinSchema.safeParse({
          studentIdOrPhone: "",
        }).success
      ).toBe(false);
    });
  });
});
