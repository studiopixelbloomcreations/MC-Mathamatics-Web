"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  DownloadSimple,
  PaperPlaneTilt,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";

interface IdCardDisplayProps {
  uniqueId: string;
  pin: string;
  fullName: string;
  grade: number;
  classType: "T" | "TP";
  parentWhatsapp: string;
}

export function IdCardDisplay({
  uniqueId,
  pin,
  fullName,
  grade,
  classType,
  parentWhatsapp,
}: IdCardDisplayProps) {
  const t = useTranslations("Auth");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 3D physical card tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 350, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const telegramBotUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "mc_mathematics_bot";
  const telegramBotUrl = `https://t.me/${telegramBotUsername}?start=START_${encodeURIComponent(
    uniqueId
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uniqueId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Physical black acrylic finish
    const bgGradient = ctx.createLinearGradient(0, 0, 960, 560);
    bgGradient.addColorStop(0, "#08090b");
    bgGradient.addColorStop(0.5, "#101116");
    bgGradient.addColorStop(1, "#08090b");
    ctx.fillStyle = bgGradient;
    ctx.roundRect(0, 0, 960, 560, 28);
    ctx.fill();

    // Subtle brushed rim border (Gold Foil)
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(250, 204, 21, 0.6)";
    ctx.roundRect(14, 14, 932, 532, 22);
    ctx.stroke();

    // Inner hairline bevel
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.roundRect(18, 18, 924, 524, 20);
    ctx.stroke();

    // Header strip
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("MC MATHEMATICS", 60, 75);

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "15px sans-serif";
    ctx.fillText("Maths is the question. MC is the answer.", 60, 105);

    // Decorative divider line
    ctx.strokeStyle = "rgba(250, 204, 21, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 135);
    ctx.lineTo(900, 135);
    ctx.stroke();

    // Student Label
    ctx.fillStyle = "#71717a";
    ctx.font = "13px monospace";
    ctx.fillText("OFFICIAL PERMANENT STUDENT IDENTIFIER", 60, 175);

    // Student ID (Huge JetBrains Mono)
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 52px monospace";
    ctx.fillText(uniqueId, 60, 245);

    // Full Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(fullName, 60, 315);

    // Class details
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    const typeLabel = classType === "TP" ? "Theory + Paper Class" : "Theory Class";
    ctx.fillText(`Grade ${grade} • ${typeLabel}`, 60, 355);

    // Parent WhatsApp
    ctx.fillStyle = "#94a3b8";
    ctx.font = "15px monospace";
    ctx.fillText(`Parent WhatsApp: ${parentWhatsapp}`, 60, 420);

    // Teacher signature & Location
    ctx.fillStyle = "#facc15";
    ctx.font = "italic 22px serif";
    ctx.fillText("Malinga C Dissanayake", 640, 470);
    ctx.fillStyle = "#71717a";
    ctx.font = "14px sans-serif";
    ctx.fillText("Kurunegala, Sri Lanka", 640, 498);

    // Trigger download
    const link = document.createElement("a");
    link.download = `MC-Maths-ID-${uniqueId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Hidden browser credential saver form */}
      <form
        id="browser-credential-saver"
        className="sr-only"
        aria-hidden="true"
        method="post"
        action="#"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          name="username"
          autoComplete="username"
          defaultValue={uniqueId}
          readOnly
        />
        <input
          type="password"
          name="new-password"
          autoComplete="new-password"
          defaultValue={pin}
          readOnly
        />
      </form>

      {/* 3D Physical Acrylic Gold Foil Card */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ perspective: 1000 }}
        className="relative group cursor-default select-none"
      >
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
          }
          className="relative rounded-3xl p-8 md:p-10 bg-[#0a0b0e] border border-[var(--brand)]/35 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_32px_64px_-16px_rgba(250,204,21,0.15)]"
        >
          {/* Specular glare reflection moving across acrylic */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`,
            }}
          />

          {/* Inner hairline bevel rim */}
          <div className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/[0.08]" />

          {/* Header row with official emblem */}
          <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[var(--brand)]/40 shadow-sm shrink-0">
                <Image
                  src="/images/mc-logo.jpg"
                  alt="MC Mathematics Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--brand)] font-mono font-medium block">
                  MC Mathematics
                </span>
                <span className="text-[11px] text-[var(--muted)] block">
                  Kurunegala, Sri Lanka
                </span>
              </div>
            </div>
            <Badge variant="accent">
              Grade {grade} • {classType === "TP" ? "Theory + Paper" : "Theory"}
            </Badge>
          </div>

          {/* Student ID in JetBrains Mono 48px */}
          <div className="space-y-1 mb-6 relative z-10">
            <span className="text-xs text-[var(--muted)] uppercase font-mono tracking-wider block">
              Permanent Student Identifier
            </span>
            <div className="text-4xl md:text-5xl font-mono font-black tracking-wider text-[var(--brand)] drop-shadow-[0_0_20px_rgba(250,204,21,0.25)] select-all [font-feature-settings:'tnum'_1,'cv05'_1]">
              {uniqueId}
            </div>
          </div>

          {/* Student meta info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm relative z-10">
            <div>
              <p className="text-xs text-[var(--muted)]">Student Name</p>
              <p className="font-semibold text-white text-lg tracking-normal">{fullName}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Parent WhatsApp</p>
              <p className="font-mono text-zinc-300 [font-feature-settings:'tnum'_1]">{parentWhatsapp}</p>
            </div>
          </div>

          {/* Action Row: Copy & Download */}
          <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-white/10 relative z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 border-[var(--brand)]/40 hover:bg-[var(--brand)]/10 text-[var(--text)]"
            >
              {copied ? (
                <>
                  <CheckCircle size={16} weight="bold" className="text-emerald-400" />
                  <span className="text-emerald-400">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy size={16} weight="regular" className="text-[var(--brand)]" />
                  <span>{t("copyId")}</span>
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadImage}
              className="gap-2"
            >
              <DownloadSimple size={16} weight="regular" className="text-zinc-300" />
              <span>{t("downloadIdCard")}</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Safety Callout */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border border-[var(--brand)]/20 bg-[var(--surface-elevated)] text-[var(--text)] text-sm">
        <ShieldCheck size={20} weight="regular" className="text-[var(--brand)] shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          {t("warningSave")}
        </p>
      </div>

      {/* Telegram Activation Block */}
      <div className="p-6 rounded-3xl border border-blue-500/20 bg-blue-950/15 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <PaperPlaneTilt size={22} weight="fill" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--text)]">
              Connect to Telegram AI Bot
            </h4>
            <p className="text-xs text-[var(--muted)]">
              Instant automated score cards, diagnostic analysis, and parent chat assistant.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          Tap below to open Telegram and link your child's student ID with our AI bot. You can get instant marks reports and ask questions at any time!
        </p>

        <a
          href={telegramBotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full"
        >
          <Button
            size="lg"
            className="w-full bg-[#24A1DE] hover:bg-[#1f8ec4] text-white font-semibold shadow-lg shadow-[#24A1DE]/20 gap-2 text-sm sm:text-base"
          >
            <PaperPlaneTilt size={20} weight="fill" />
            <span>Connect Telegram Bot Now (Free)</span>
          </Button>
        </a>
      </div>

      {/* Continue to Login Button */}
      <div className="pt-2">
        <Link href="/login" className="block w-full">
          <Button variant="primary" size="lg" className="w-full gap-2 text-sm sm:text-base">
            <span>{t("continueToLogin")}</span>
            <ArrowRight size={18} weight="bold" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
