"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Check, Info } from "lucide-react";
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

  const aiNumber =
    process.env.NEXT_PUBLIC_AI_NUMBER?.replace(/[^0-9]/g, "") || "94771234567";

  const reportUrl = `https://wa.me/${aiNumber}?text=REPORT%20${encodeURIComponent(
    studentId
  )}`;
  const startUrl = `https://wa.me/${aiNumber}?text=START%20${encodeURIComponent(
    studentId
  )}`;

  // Format sent time (e.g., "Sent ✓ (14:30)")
  const sentTimeFormatted = lastReportRequestTime
    ? new Date(lastReportRequestTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Determine button state according to blueprint A4-8:
  // 1. Sent ✓ (time) if a request was submitted recently
  // 2. Report ready, tap to send if students.report_pending is true
  // 3. Default: Send me the report
  let buttonLabel = "Send me the report";
  let buttonIcon = <MessageSquare className="w-4 h-4 fill-current" />;

  if (sentTimeFormatted) {
    buttonLabel = `Report Sent ✓ (${sentTimeFormatted})`;
    buttonIcon = <Check className="w-4 h-4 text-emerald-400" />;
  } else if (reportPending) {
    buttonLabel = "Report ready, tap to send";
    buttonIcon = <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />;
  }

  const handleClick = (e: React.MouseEvent) => {
    // If parent has not verified WhatsApp yet, show friendly explainer first
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
            reportPending ? "ring-2 ring-amber-400/50 shadow-amber-500/20" : ""
          } ${fullWidth ? "w-full" : ""} ${className}`}
        >
          {buttonIcon}
          <span>{buttonLabel}</span>
        </Button>
      </a>

      {/* One-time explainer modal for unverified parents */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect Parent WhatsApp (Free)"
        description="Verify your WhatsApp number to receive free progress cards and AI analysis"
      >
        <div className="space-y-4 py-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs leading-relaxed">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              To ensure zero message cost, WhatsApp requires parents to initiate the conversation once.
              Tap below to send <span className="font-mono font-bold text-white">START {studentId}</span>.
              Your student dashboard link and full analysis will arrive immediately for free!
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
                className="bg-[#25D366] hover:bg-[#20ba59] text-black font-bold gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Now</span>
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
