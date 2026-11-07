"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedRing } from "@/components/ui/animated-ring";
import { StatCounter } from "@/components/ui/stat-counter";
import {
  CalendarCheck,
  Flame,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  session: string;
  status: "present" | "absent" | "late" | "excused";
}

interface AttendanceViewProps {
  summary: {
    percentage: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
  records: AttendanceRecord[];
  streak: number;
}

export function AttendanceView({
  summary,
  records,
  streak,
}: AttendanceViewProps) {
  const isBelowThreshold = summary.percentage < 75;

  // Build current month heatmap grid (e.g. 28-31 days)
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // Map dates to status for the month
  const dateStatusMap = new Map<number, string>();
  records.forEach((r) => {
    const d = new Date(r.date);
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      dateStatusMap.set(d.getDate(), r.status);
    }
  });

  return (
    <div className="space-y-6">
      {/* 1. Low Attendance Alert Banner if < 75% */}
      {isBelowThreshold && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 text-sm flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-100">
              Attendance Below Minimum Criteria (75%)
            </h4>
            <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
              Your attendance is currently {summary.percentage}%. Consistent class participation is mandatory to be eligible for term exams and model paper discussions.
            </p>
          </div>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
              Overall Rate
            </span>
            <div className="text-3xl font-extrabold font-mono text-foreground">
              <StatCounter value={summary.percentage} suffix="%" />
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.present} present of {summary.total} sessions
            </p>
          </div>
          <div className="shrink-0">
            <AnimatedRing
              value={summary.percentage}
              size={80}
              strokeWidth={8}
              color={summary.percentage >= 75 ? "var(--good)" : "var(--bad)"}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
              Current Streak
            </span>
            <div className="text-3xl font-extrabold font-mono text-amber-400">
              <StatCounter value={streak} suffix=" classes" />
            </div>
            <p className="text-xs text-muted-foreground">Consecutive attendance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
              Session Breakdown
            </span>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">{summary.present} P</span>
              <span className="text-amber-400 font-bold">{summary.late} L</span>
              <span className="text-red-400 font-bold">{summary.absent} A</span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Late attendance grants half credit
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* 3. Month Calendar Heatmap */}
      <GlassCard className="p-6 space-y-4 border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              {currentMonth} Attendance Heatmap
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Present
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Late
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Absent
            </span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i} className="text-center text-[10px] text-muted-foreground font-mono font-bold">
              {day}
            </div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const status = dateStatusMap.get(dayNum);

            let bgClass = "bg-white/5 border-white/10 text-muted-foreground";
            if (status === "present") bgClass = "bg-emerald-500/30 border-emerald-500/50 text-emerald-300 font-bold";
            if (status === "late") bgClass = "bg-amber-500/30 border-amber-500/50 text-amber-300 font-bold";
            if (status === "absent") bgClass = "bg-red-500/30 border-red-500/50 text-red-300 font-bold";

            return (
              <div
                key={dayNum}
                className={`h-10 sm:h-12 rounded-xl border flex flex-col items-center justify-center text-xs transition-all ${bgClass}`}
                title={`Day ${dayNum}: ${status || "No class"}`}
              >
                <span>{dayNum}</span>
                {status && (
                  <span className="text-[9px] uppercase font-mono">
                    {status[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 4. Attendance History Table */}
      <GlassCard className="p-6 space-y-4 border-white/10">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
          Class Session History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Session</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-foreground font-semibold">
                      {new Date(r.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 text-zinc-300 uppercase">
                      {r.session} class
                    </td>
                    <td className="py-3">
                      {r.status === "present" && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </span>
                      )}
                      {r.status === "late" && (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Clock className="w-3.5 h-3.5" /> Late
                        </span>
                      )}
                      {r.status === "absent" && (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </span>
                      )}
                      {r.status === "excused" && (
                        <span className="inline-flex items-center gap-1 text-indigo-400 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Excused
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-muted-foreground text-[11px]">
                      Verified by Sir
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
