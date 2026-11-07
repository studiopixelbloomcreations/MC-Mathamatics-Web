"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { setAiMode } from "@/app/actions/admin";

interface AiModeGuardModalProps {
  aiMode: boolean;
  onDisableAiMode?: () => void;
}

export function AiModeGuardModal({ aiMode, onDisableAiMode }: AiModeGuardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Expose trigger to open modal when manual edit is attempted
  React.useEffect(() => {
    const handleIntercept = (e: MouseEvent) => {
      if (!aiMode) return;
      const target = e.target as HTMLElement;
      // Intercept clicks on form inputs, buttons, and edit controls
      if (
        target.closest("button:not(.ai-modal-btn)") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
    };

    if (aiMode) {
      document.addEventListener("click", handleIntercept, true);
    }
    return () => {
      document.removeEventListener("click", handleIntercept, true);
    };
  }, [aiMode]);

  const handleConfirmEnableManual = async () => {
    setLoading(true);
    try {
      await setAiMode(false);
      setIsOpen(false);
      if (onDisableAiMode) onDisableAiMode();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!aiMode && !isOpen) return null;

  return (
    <>
      {/* 1. Global AI Mode Active Floating Banner */}
      {aiMode && (
        <div className="sticky top-0 z-40 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-amber-300">
              AI Mode is currently active
            </span>
            <span className="hidden sm:inline text-muted-foreground">
              — Manual controls are locked. Incoming WhatsApp commands from Sir execute autonomously.
            </span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(true)}
            className="ai-modal-btn h-7 text-xs text-amber-400 hover:bg-amber-500/20"
          >
            Switch to Manual Control
          </Button>
        </div>
      )}

      {/* 2. Blueprint A5 Exact Modal Flow */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-amber-500/40 p-6 shadow-2xl shadow-amber-500/10 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Bot className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground flex items-center justify-center gap-2">
                <span>🤖 AI Mode is currently active</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Manual control cannot be continued.
              </p>
              <p className="text-sm font-semibold text-foreground pt-1">
                Enable manual control?
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="outline"
                className="ai-modal-btn w-28 border-white/20 hover:bg-white/5"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                No
              </Button>
              <Button
                variant="primary"
                className="ai-modal-btn w-28 bg-amber-500 hover:bg-amber-400 text-black font-bold"
                onClick={handleConfirmEnableManual}
                disabled={loading}
              >
                {loading ? "Switching..." : "Yes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
