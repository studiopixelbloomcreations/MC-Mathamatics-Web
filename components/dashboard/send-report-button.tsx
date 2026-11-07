"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsappLogo, Sparkle, CheckCircle, Info } from "@phosphor-icons/react";
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

  let buttonLabel = "Send me the report";
  let buttonIcon = <WhatsappLogo size={16} weight="fill" />;

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

      {/* Explainer modal for unverified parents */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect Parent WhatsApp (Free)"
        description="Verify your WhatsApp number to receive free progress cards and diagnostic analysis"
      >
        <div className="space-y-4 py-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs leading-relaxed">
            <Info size={20} weight="regular" className="text-emerald-400 shrink-0 mt-0.5" />
            <p>
              To ensure zero message cost, WhatsApp requires parents to initiate the conversation once.
              Tap below to send <span className="font-mono font-bold text-white [font-feature-settings:'tnum'_1]">START {studentId}</span>.
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
                className="bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold gap-2"
              >
                <WhatsappLogo size={16} weight="fill" />
                <span>Open WhatsApp Now</span>
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
