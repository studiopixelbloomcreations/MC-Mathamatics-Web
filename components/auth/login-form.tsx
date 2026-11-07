"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput, forgotPinSchema, ForgotPinInput } from "@/lib/auth/schema";
import { loginStudentAction, forgotPinAction } from "@/app/actions/auth";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/ui/pin-input";
import {
  Lock,
  UserCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  // Main login form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      studentId: "",
      pin: "",
    },
  });

  // Forgot PIN form
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPinInput>({
    resolver: zodResolver(forgotPinSchema),
    defaultValues: {
      studentIdOrPhone: "",
    },
  });

  const onLoginSubmit = async (values: LoginInput) => {
    setErrorMessage(null);
    setErrorType(null);

    try {
      const response = await loginStudentAction({
        studentId: values.studentId.trim().toUpperCase(),
        pin: values.pin.trim(),
      });

      if (response.success && response.data?.redirectUrl) {
        router.push(response.data.redirectUrl);
      } else {
        setErrorType(response.error || "generic");
        setErrorMessage(
          response.message || "Failed to sign in. Please verify your ID and PIN."
        );
      }
    } catch {
      setErrorType("generic");
      setErrorMessage("A network error occurred. Please try again.");
    }
  };

  const onForgotSubmit = async (values: ForgotPinInput) => {
    setIsForgotSubmitting(true);
    setForgotSuccessMessage(null);
    try {
      const response = await forgotPinAction(values);
      setForgotSuccessMessage(
        response.message || "Your PIN reset request has been sent to Sir."
      );
    } catch {
      setForgotSuccessMessage("Failed to send reset request. Please contact Sir.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {t("loginTitle")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("loginSubtitle")}
        </p>
      </div>

      <GlassCard className="p-6 md:p-8 border-white/10 backdrop-blur-xl">
        {/* Error banner */}
        {errorMessage && (
          <div
            className={`p-4 rounded-xl border text-sm mb-6 animate-in fade-in ${
              errorType === "locked"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                : "border-red-500/40 bg-red-500/10 text-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p>{errorMessage}</p>
                {/* Friendly button to /signup if ID is unknown */}
                {errorType === "unknown_id" && (
                  <Link href="/signup" className="inline-block mt-2">
                    <Button size="sm" variant="outline" className="gap-2 border-amber-500/50 text-amber-300">
                      <UserPlus className="w-4 h-4" />
                      <span>{t("signUpHere")}</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
          {/* Student ID */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              {t("studentId")}
            </label>
            <Input
              {...register("studentId")}
              placeholder={t("studentIdPlaceholder")}
              autoComplete="username"
              autoCapitalize="characters"
              error={errors.studentId?.message}
              className="font-mono uppercase tracking-wider"
              onChange={(e) => {
                setValue("studentId", e.target.value.toUpperCase());
              }}
            />
          </div>

          {/* 6-Digit PIN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                {t("pin")}
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPin(!showForgotPin)}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                {t("forgotPin")}
              </button>
            </div>
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
                <span>{t("loggingIn")}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>{t("loginButton")}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              {t("noAccount")}{" "}
              <Link
                href="/signup"
                className="text-amber-400 hover:underline font-semibold"
              >
                {t("signUpHere")}
              </Link>
            </p>
          </div>
        </form>

        {/* Forgot PIN Section (Collapsible) */}
        {showForgotPin && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{t("forgotPinTitle")}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("forgotPinSubtitle")}
            </p>

            {forgotSuccessMessage ? (
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{forgotSuccessMessage}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitForgot(onForgotSubmit)}
                className="space-y-3"
              >
                <Input
                  {...registerForgot("studentIdOrPhone")}
                  placeholder="Enter Student ID or WhatsApp number"
                  error={forgotErrors.studentIdOrPhone?.message}
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  disabled={isForgotSubmitting}
                  className="w-full text-xs"
                >
                  {isForgotSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{t("sendResetRequest")}</span>
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
