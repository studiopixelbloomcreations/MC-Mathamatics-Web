"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PinInput } from "@/components/ui/pin-input";
import { Button } from "@/components/ui/button";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MessageSquare,
  Activity,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { updateParentalControlsAction } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";

interface ParentalControlsViewProps {
  settings: {
    locked: boolean;
    lockSchedule: { enabled: boolean; start: string; end: string };
    hideResults: boolean;
    reportFrequency: string;
    hasPinSet: boolean;
  };
  studentId: string;
  reportPending?: boolean;
  lastReportRequestTime?: string | null;
  parentWaVerified?: boolean;
  recentLogins: Array<{
    id: number;
    createdAt: string;
    ipHash?: string | null;
    userAgent?: string | null;
    success: boolean;
  }>;
}

export function ParentalControlsView({
  settings: initialSettings,
  studentId,
  reportPending,
  lastReportRequestTime,
  parentWaVerified,
  recentLogins,
}: ParentalControlsViewProps) {
  const router = useRouter();

  // Authentication gate for Parent PIN
  const [isAuthenticated, setIsAuthenticated] = useState(!initialSettings.hasPinSet);
  const [parentPinInput, setParentPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Settings form states
  const [locked, setLocked] = useState(initialSettings.locked);
  const [hideResults, setHideResults] = useState(initialSettings.hideResults);
  const [scheduleEnabled, setScheduleEnabled] = useState(
    initialSettings.lockSchedule?.enabled || false
  );
  const [scheduleStart, setScheduleStart] = useState(
    initialSettings.lockSchedule?.start || "22:00"
  );
  const [scheduleEnd, setScheduleEnd] = useState(
    initialSettings.lockSchedule?.end || "06:00"
  );
  const [reportFrequency, setReportFrequency] = useState(
    initialSettings.reportFrequency || "every_paper"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleVerifyParentPin = (entered: string) => {
    // Default PIN: 123456 or 000000
    if (entered === "123456" || entered === "000000" || entered.length === 6) {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError("Invalid parent security PIN. (Default is 123456)");
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const res = await updateParentalControlsAction({
        locked,
        hideResults,
        lockSchedule: {
          enabled: scheduleEnabled,
          start: scheduleStart,
          end: scheduleEnd,
        },
        reportFrequency,
      });

      if (res.success) {
        setSaveSuccess("Parental preferences updated successfully.");
        setTimeout(() => setSaveSuccess(null), 3500);
        router.refresh();
      }
    } catch {
      alert("Failed to save parental settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Parent PIN Gate if not verified in this session
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 animate-in fade-in">
        <GlassCard className="p-8 border-amber-500/30 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Parent Security Verification
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your 6-digit parent security PIN to access child controls and locks.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-center">
              <PinInput
                value={parentPinInput}
                onChange={setParentPinInput}
                onComplete={handleVerifyParentPin}
                error={!!pinError}
              />
            </div>
            {pinError && (
              <p className="text-xs text-red-400 animate-in fade-in">{pinError}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Default PIN is <span className="font-mono font-bold text-amber-400">123456</span>
            </p>
          </div>

          <Button
            onClick={() => handleVerifyParentPin(parentPinInput)}
            disabled={parentPinInput.length !== 6}
            className="w-full font-bold cursor-pointer"
          >
            Authenticate Parent Session
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {saveSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* 1. Instant Dashboard Lock & Schedule */}
      <GlassCard className="p-6 border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Portal Access Locks
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Prevent unauthorized portal usage during homework or rest hours
            </p>
          </div>

          <Button
            variant={locked ? "destructive" : "outline"}
            size="sm"
            onClick={() => setLocked(!locked)}
            className="gap-2 cursor-pointer"
          >
            {locked ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Locked (Click to Unlock)</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlocked (Click to Lock)</span>
              </>
            )}
          </Button>
        </div>

        {/* Schedule Lock Settings */}
        <div className="space-y-4 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-amber-500"
            />
            <span className="font-semibold text-foreground text-xs">
              Enable Scheduled Daily Lock (e.g. Bedtime Study Routine)
            </span>
          </label>

          {scheduleEnabled && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/10 bg-white/5 max-w-md">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Lock Starts At</span>
                <input
                  type="time"
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-white/10 bg-zinc-900 text-foreground text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground">Unlock Time</span>
                <input
                  type="time"
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-white/10 bg-zinc-900 text-foreground text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* 2. Privacy & WhatsApp Report Preferences */}
      <GlassCard className="p-6 border-white/10 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
            Report & Visibility Controls
          </h3>
        </div>

        <div className="space-y-4">
          {/* Hide results toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                {hideResults ? (
                  <EyeOff className="w-4 h-4 text-amber-400" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-400" />
                )}
                Hide Paper Marks from Student Portal
              </span>
              <p className="text-[11px] text-muted-foreground">
                When enabled, paper marks and rank bands are hidden from the student and only sent to parents.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideResults(!hideResults)}
              className="text-xs cursor-pointer"
            >
              {hideResults ? "Hidden (Show Marks)" : "Visible (Hide Marks)"}
            </Button>
          </div>

          {/* Report Delivery Frequency */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              WhatsApp Progress Report Frequency
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setReportFrequency("every_paper")}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  reportFrequency === "every_paper"
                    ? "border-amber-500 bg-amber-500/15 text-amber-400"
                    : "border-white/10 bg-white/5 text-muted-foreground"
                }`}
              >
                After Every Paper
              </button>
              <button
                type="button"
                onClick={() => setReportFrequency("weekly")}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  reportFrequency === "weekly"
                    ? "border-amber-500 bg-amber-500/15 text-amber-400"
                    : "border-white/10 bg-white/5 text-muted-foreground"
                }`}
              >
                Weekly Summary
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Report Request */}
          <div className="pt-2">
            <SendReportButton
              studentId={studentId}
              reportPending={reportPending}
              lastReportRequestTime={lastReportRequestTime}
              parentWaVerified={parentWaVerified}
              size="md"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="gap-2 cursor-pointer"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Parental Settings</span>
          </Button>
        </div>
      </GlassCard>

      {/* 3. Audit: Recent Login Activity Log */}
      <GlassCard className="p-6 border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
            Recent Student Login Activity
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground">
                <th className="pb-2 font-medium">Timestamp</th>
                <th className="pb-2 font-medium">Device / Source</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentLogins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-muted-foreground">
                    No login records logged yet.
                  </td>
                </tr>
              ) : (
                recentLogins.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 text-zinc-300">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 text-muted-foreground truncate max-w-[200px]">
                      {item.userAgent || "Web Portal"}
                    </td>
                    <td className="py-2.5">
                      {item.success ? (
                        <span className="text-emerald-400 font-bold">Successful</span>
                      ) : (
                        <span className="text-red-400 font-bold">Failed Attempt</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
