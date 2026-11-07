"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PinInput } from "@/components/ui/pin-input";
import { Button } from "@/components/ui/button";
import { Lock, ShieldAlert, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { unlockParentalLockAction } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";

interface LockedScreenProps {
  studentName: string;
  uniqueId: string;
  grade: number;
  lockUntil?: string | null;
  lockReason?: "manual" | "schedule" | "temporary";
}

export function LockedScreen({
  studentName,
  uniqueId,
  grade,
  lockUntil,
  lockReason = "manual",
}: LockedScreenProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  const handleUnlock = async (pinValue: string) => {
    if (pinValue.length !== 6) {
      setErrorMsg("Please enter your complete 6-digit parent PIN.");
      return;
    }

    setIsUnlocking(true);
    setErrorMsg(null);

    try {
      const res = await unlockParentalLockAction(pinValue);
      if (res.success) {
        setUnlockedSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-600/20 rounded-3xl blur-xl opacity-75" />
          <GlassCard className="relative p-8 border-red-500/30 bg-zinc-950/90 text-center space-y-6">
            {/* Glowing Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Portal Access Locked</span>
              </div>
              <h2 className="text-2xl font-black text-foreground">
                Parental Control Active
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lockReason === "schedule"
                  ? "Access is currently restricted during scheduled study or bedtime hours."
                  : lockUntil
                  ? `Access is locked until ${new Date(lockUntil).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}.`
                  : "This student portal has been locked by parental controls."}
              </p>
            </div>

            {/* Student ID Chip */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between font-mono">
              <span className="text-muted-foreground">{studentName}</span>
              <span className="text-amber-400 font-bold">
                {uniqueId} (G{grade})
              </span>
            </div>

            {/* Unlocking Form */}
            {unlockedSuccess ? (
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Unlocked! Loading student portal...</span>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-300 font-medium block">
                    Enter Parent Security PIN to Unlock:
                  </label>
                  <div className="flex justify-center">
                    <PinInput
                      value={pin}
                      onChange={(v) => {
                        setPin(v);
                        if (v.length === 6) handleUnlock(v);
                      }}
                      onComplete={handleUnlock}
                      error={!!errorMsg}
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-red-400 animate-in fade-in">
                      {errorMsg}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    (Default PIN is 123456 unless changed in Parental Controls)
                  </p>
                </div>

                <Button
                  onClick={() => handleUnlock(pin)}
                  disabled={isUnlocking || pin.length !== 6}
                  size="lg"
                  className="w-full font-bold gap-2 cursor-pointer"
                >
                  {isUnlocking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying PIN...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Unlock Dashboard</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
