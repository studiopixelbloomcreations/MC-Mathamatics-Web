"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/auth/schema";
import { registerStudentAction } from "@/app/actions/auth";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/ui/pin-input";
import { IdCardDisplay } from "@/components/auth/id-card-display";
import {
  GraduationCap,
  Phone,
  MessageSquare,
  Lock,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function SignUpForm() {
  const t = useTranslations("Auth");
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdStudent, setCreatedStudent] = useState<{
    uniqueId: string;
    pin: string;
    fullName: string;
    grade: number;
    classType: "T" | "TP";
    parentWhatsapp: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      grade: 10,
      age: 15,
      whereabouts: "",
      studentPhone: "",
      parentWhatsapp: "",
      parentPhone: "",
      classType: "TP",
      pin: "",
      pinConfirm: "",
      consent: true,
    },
  });

  const selectedClassType = watch("classType");

  const onSubmit = async (values: SignUpInput) => {
    setServerError(null);
    try {
      const response = await registerStudentAction(values);
      if (response.success && response.data) {
        setCreatedStudent({
          uniqueId: response.data.uniqueId,
          pin: response.data.pin,
          fullName: response.data.fullName,
          grade: Number(values.grade),
          classType: values.classType,
          parentWhatsapp: response.data.parentWhatsapp,
        });
      } else {
        setServerError(
          response.message || "Failed to register. Please check the entered details."
        );
      }
    } catch {
      setServerError("An unexpected network error occurred. Please try again.");
    }
  };

  // If successfully registered, show the ID card display!
  if (createdStudent) {
    return (
      <IdCardDisplay
        uniqueId={createdStudent.uniqueId}
        pin={createdStudent.pin}
        fullName={createdStudent.fullName}
        grade={createdStudent.grade}
        classType={createdStudent.classType}
        parentWhatsapp={createdStudent.parentWhatsapp}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {t("signUpTitle")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("signUpSubtitle")}
        </p>
      </div>

      <GlassCard className="p-6 md:p-8 border-white/10 backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              {t("fullName")} <span className="text-amber-400">*</span>
            </label>
            <Input
              {...register("fullName")}
              placeholder={t("fullNamePlaceholder")}
              error={errors.fullName?.message}
            />
          </div>

          {/* Grade & Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                {t("grade")} <span className="text-amber-400">*</span>
              </label>
              <select
                {...register("grade", { valueAsNumber: true })}
                className="w-full h-11 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40 transition-all"
              >
                {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                  <option key={g} value={g} className="bg-zinc-900 text-white">
                    Grade {g}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="text-xs text-red-400">{errors.grade.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                {t("age")}
              </label>
              <Input
                type="number"
                {...register("age")}
                placeholder={t("agePlaceholder")}
                error={errors.age?.message}
              />
            </div>
          </div>

          {/* Class Type Toggle (Theory + Paper vs Theory Only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("classType")} <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("classType", "TP")}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedClassType === "TP"
                    ? "border-amber-500 bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                <span>{t("theoryAndPaper")}</span>
                {selectedClassType === "TP" && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setValue("classType", "T")}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedClassType === "T"
                    ? "border-amber-500 bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                <span>{t("theoryOnly")}</span>
                {selectedClassType === "T" && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                )}
              </button>
            </div>
          </div>

          {/* Town / Whereabouts */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              {t("whereabouts")}
            </label>
            <Input
              {...register("whereabouts")}
              placeholder={t("whereaboutsPlaceholder")}
              error={errors.whereabouts?.message}
            />
          </div>

          {/* Contact Numbers Row */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                {t("parentWhatsapp")} <span className="text-amber-400">*</span>
              </label>
              <Input
                {...register("parentWhatsapp")}
                placeholder={t("parentWhatsappPlaceholder")}
                error={errors.parentWhatsapp?.message}
              />
              <p className="text-[11px] text-muted-foreground">
                Progress alerts, marks and AI reports are delivered to this number via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  {t("parentPhone")}
                </label>
                <Input
                  {...register("parentPhone")}
                  placeholder={t("parentPhonePlaceholder")}
                  error={errors.parentPhone?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  {t("studentPhone")}
                </label>
                <Input
                  {...register("studentPhone")}
                  placeholder={t("studentPhonePlaceholder")}
                  error={errors.studentPhone?.message}
                />
              </div>
            </div>
          </div>

          {/* 6-Digit PIN & Confirmation */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                {t("choosePin")} <span className="text-amber-400">*</span>
              </label>
              <Controller
                name="pin"
                control={control}
                render={({ field }) => (
                  <PinInput
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.pin}
                  />
                )}
              />
              {errors.pin && (
                <p className="text-xs text-red-400">{errors.pin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                {t("confirmPin")} <span className="text-amber-400">*</span>
              </label>
              <Controller
                name="pinConfirm"
                control={control}
                render={({ field }) => (
                  <PinInput
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.pinConfirm}
                  />
                )}
              />
              {errors.pinConfirm && (
                <p className="text-xs text-red-400">
                  {errors.pinConfirm.message}
                </p>
              )}
            </div>
          </div>

          {/* Parent Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register("consent")}
                className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/30"
              />
              <span className="text-xs text-muted-foreground group-hover:text-zinc-300 leading-relaxed">
                {t("consentText")}
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs text-red-400 mt-1">
                {errors.consent.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full text-base font-bold shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t("registering")}</span>
              </div>
            ) : (
              <span>{t("registerButton")}</span>
            )}
          </Button>

          {/* Existing Student Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              {t("alreadyRegistered")}{" "}
              <Link
                href="/login"
                className="text-amber-400 hover:underline font-semibold"
              >
                {t("loginHere")}
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
