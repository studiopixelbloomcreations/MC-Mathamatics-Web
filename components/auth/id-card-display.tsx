"use client";

import React, { useRef, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Download, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

  const aiNumber =
    process.env.NEXT_PUBLIC_AI_NUMBER?.replace(/[^0-9]/g, "") || "94771234567";
  const whatsappUrl = `https://wa.me/${aiNumber}?text=START%20${encodeURIComponent(
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
    // Generate an ID card via canvas
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark sleek background
    const bgGradient = ctx.createLinearGradient(0, 0, 900, 540);
    bgGradient.addColorStop(0, "#09090b");
    bgGradient.addColorStop(1, "#18181b");
    ctx.fillStyle = bgGradient;
    ctx.roundRect(0, 0, 900, 540, 24);
    ctx.fill();

    // Gold outer border
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#e5a93c";
    ctx.roundRect(10, 10, 880, 520, 20);
    ctx.stroke();

    // Header strip
    ctx.fillStyle = "#e5a93c";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("MC MATHEMATICS", 50, 65);

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "16px sans-serif";
    ctx.fillText("Maths is the question. MC is the answer.", 50, 95);

    // Subtle watermark monogram
    ctx.fillStyle = "rgba(229, 169, 60, 0.05)";
    ctx.font = "bold 220px serif";
    ctx.fillText("MC", 580, 360);

    // Decorative divider line
    ctx.strokeStyle = "rgba(229, 169, 60, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 125);
    ctx.lineTo(850, 125);
    ctx.stroke();

    // Student Label
    ctx.fillStyle = "#71717a";
    ctx.font = "14px monospace";
    ctx.fillText("OFFICIAL STUDENT IDENTIFICATION", 50, 165);

    // Student ID (Huge JetBrains Mono)
    ctx.fillStyle = "#facc15";
    ctx.font = "bold 56px monospace";
    ctx.fillText(uniqueId, 50, 240);

    // Full Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(fullName, 50, 310);

    // Class details
    ctx.fillStyle = "#d4d4d8";
    ctx.font = "20px sans-serif";
    const typeLabel = classType === "TP" ? "Theory + Paper" : "Theory Only";
    ctx.fillText(`Grade ${grade} • ${typeLabel}`, 50, 350);

    // Parent WhatsApp
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "16px monospace";
    ctx.fillText(`Parent WhatsApp: ${parentWhatsapp}`, 50, 420);

    // Teacher signature & Location
    ctx.fillStyle = "#e5a93c";
    ctx.font = "italic 22px serif";
    ctx.fillText("Malinga C Dissanayake", 600, 470);
    ctx.fillStyle = "#71717a";
    ctx.font = "14px sans-serif";
    ctx.fillText("Kurunegala, Sri Lanka", 600, 495);

    // Trigger download
    const link = document.createElement("a");
    link.download = `MC-Maths-ID-${uniqueId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
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

      {/* Main Glowing Digital ID Card */}
      <div ref={cardRef} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
        <GlassCard className="relative p-8 md:p-10 border-amber-500/30 bg-zinc-950/85 overflow-hidden">
          {/* Watermark Monogram */}
          <div
            className="absolute -right-8 -bottom-10 text-[180px] font-serif font-black select-none pointer-events-none opacity-[0.04] text-amber-400"
            aria-hidden="true"
          >
            MC
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium">
                Official Student ID
              </span>
            </div>
            <Badge variant="accent">Grade {grade} • {classType === "TP" ? "Theory + Paper" : "Theory"}</Badge>
          </div>

          {/* Student ID in JetBrains Mono 48px+ */}
          <div className="space-y-1 mb-6">
            <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
              Permanent Student Identifier
            </span>
            <div className="text-4xl md:text-5xl font-mono font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_0_25px_rgba(234,179,8,0.35)] select-all">
              {uniqueId}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Student Name</p>
              <p className="font-semibold text-foreground text-lg">{fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Parent WhatsApp</p>
              <p className="font-mono text-zinc-300">{parentWhatsapp}</p>
            </div>
          </div>

          {/* Action Row inside Card: Copy & Download */}
          <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 border-amber-500/40 hover:bg-amber-500/10"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
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
              <Download className="w-4 h-4 text-zinc-300" />
              <span>{t("downloadIdCard")}</span>
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Warning Alert */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200/90 text-sm">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p>{t("warningSave")}</p>
      </div>

      {/* WhatsApp Activation Block */}
      <GlassCard className="p-6 border-emerald-500/30 bg-emerald-950/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">
              {t("startWhatsAppReports")}
            </h4>
            <p className="text-xs text-muted-foreground">
              Direct connection to Sir&apos;s automated progress service
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          {t("whatsAppExplanation")}
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full"
        >
          <Button
            size="lg"
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold shadow-lg shadow-[#25D366]/20 gap-2 text-base"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Connect WhatsApp Now (Free)</span>
          </Button>
        </a>
      </GlassCard>

      {/* Continue to Login Button */}
      <div className="pt-2">
        <Link href="/login" className="block w-full">
          <Button variant="primary" size="lg" className="w-full gap-2 text-base">
            <span>{t("continueToLogin")}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
