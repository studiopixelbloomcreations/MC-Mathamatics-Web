"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaperPlaneTilt, Sparkle, CheckCircle, Info } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/modal";

interface SendReportButtonProps {
  studentId: string;
  reportPending?: boolean;
  lastReportRequestTime?: string | null;
  parentWaVerified?: boolean;
  variant?: "primary" | "secondary" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}

export function SendReportButton({
  studentId,
  reportPending = false,
  lastReportRequestTime = null,
  parentWaVerified = true,
  variant = "accent",
  size = "md",
  className = "",
  fullWidth = false,
}: SendReportButtonProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);

  const rawUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "MCMathamaticsBot";
  const cleanUsername = rawUsername.replace(/^@/, "");

  const startUrl = `https://t.me/${cleanUsername}?start=START_${studentId}`;
  const reportUrl = `https://t.me/${cleanUsername}?start=REPORT_${studentId}`;

  // Format sent time (e.g., "Sent ✓ (14:30)")
  const sentTimeFormatted = lastReportRequestTime
    ? new Date(lastReportRequestTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  let buttonLabel = "Send me the report";
  let buttonIcon = <PaperPlaneTilt size={16} weight="fill" className="text-blue-400" />;

  if (sentTimeFormatted) {
    buttonLabel = `Report sent (${sentTimeFormatted})`;
    buttonIcon = <CheckCircle size={16} weight="bold" className="text-emerald-400" />;
  } else if (reportPending) {
    buttonLabel = "Report ready, tap to send";
    buttonIcon = <Sparkle size={16} weight="fill" className="text-[var(--brand)] animate-pulse" />;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!parentWaVerified) {
      e.preventDefault();
      setShowConnectModal(true);
    }
  };

  return (
    <>
      <a
        href={parentWaVerified ? reportUrl : "#"}
        target={parentWaVerified ? "_blank" : undefined}
        rel={parentWaVerified ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        className={`${fullWidth ? "w-full" : "inline-block"}`}
      >
        <Button
          variant={variant}
          size={size}
          className={`gap-2 font-semibold shadow-md transition-all ${
            reportPending ? "ring-2 ring-[var(--brand)]/50" : ""
          } ${fullWidth ? "w-full" : ""} ${className}`}
        >
          {buttonIcon}
          <span>{buttonLabel}</span>
        </Button>
      </a>

      {/* Explainer modal for connecting to Telegram bot */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect to Telegram AI Bot (Free)"
        description="Connect with Sir's Telegram Bot to receive automated instant progress cards and chat about marks"
      >
        <div className="space-y-4 py-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-200 text-xs leading-relaxed">
            <Info size={20} weight="regular" className="text-blue-400 shrink-0 mt-0.5" />
            <p>
              Tap below to open Telegram and send <span className="font-mono font-bold text-white [font-feature-settings:'tnum'_1]">START {studentId}</span>.
              Your student dashboard link and full marks analysis will arrive immediately, and you can chat with the AI assistant about your child's progress!
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConnectModal(false)}
            >
              Cancel
            </Button>
            <a
              href={startUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowConnectModal(false)}
            >
              <Button
                size="sm"
                className="bg-[#24A1DE] hover:bg-[#1f8ec4] text-white font-semibold gap-2"
              >
                <PaperPlaneTilt size={16} weight="fill" />
                <span>Open Telegram Bot Now</span>
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
