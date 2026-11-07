import React from "react";
import { getAdminOverviewData } from "@/app/actions/admin";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Users,
  FileUp,
  GraduationCap,
  Bot,
  ShieldCheck,
  ArrowRight,
  Send,
  CalendarCheck,
  Bell,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();
  const { stats, systemSettings, recentLogins } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Master Admin Cockpit
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Overview & Academy Pulse
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Sir: Malinga C Dissanayake • Kurunegala, Sri Lanka
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/ai-mode"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              systemSettings.aiMode
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Mode: {systemSettings.aiMode ? "ACTIVE" : "OFF"}</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard variant="bento" spotlight glowColor="rgba(250, 204, 21, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Enrolled Students
            </span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-foreground">
              {stats.totalStudents}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Grades 6–13 (Theory + Paper)
            </p>
          </div>
        </GlassCard>

        <GlassCard variant="bento" spotlight glowColor="rgba(56, 189, 248, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ongoing Papers
            </span>
            <FileUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-sky-400">
              {stats.ongoingPapers}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.finishedPapers} archived papers
            </p>
          </div>
        </GlassCard>

        <GlassCard variant="bento" spotlight glowColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Marks Evaluated
            </span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {stats.totalMarksEntered}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-recomputed analyses
            </p>
          </div>
        </GlassCard>

        <GlassCard variant="bento" spotlight glowColor="rgba(168, 85, 247, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              WhatsApp Engine
            </span>
            <Send className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <span className="text-base font-bold font-mono text-purple-400">
              Free-First (24h)
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Paid templates:{" "}
              <span className={systemSettings.paidTemplatesEnabled ? "text-amber-400" : "text-emerald-400"}>
                {systemSettings.paidTemplatesEnabled ? "ENABLED" : "OFF (0 Cost)"}
              </span>
            </p>
          </div>
        </GlassCard>
      </div>

      {/* 3. Quick Action Operations Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Academic Command Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/papers" className="group">
            <GlassCard className="p-4 hover:border-amber-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Upload Paper</h4>
                  <p className="text-[11px] text-muted-foreground">PDFs & topic weights</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </GlassCard>
          </Link>

          <Link href="/admin/marks" className="group">
            <GlassCard className="p-4 hover:border-emerald-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Record Marks</h4>
                  <p className="text-[11px] text-muted-foreground">Single & bulk entry</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </GlassCard>
          </Link>

          <Link href="/admin/attendance" className="group">
            <GlassCard className="p-4 hover:border-sky-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Attendance</h4>
                  <p className="text-[11px] text-muted-foreground">Class session roll call</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </GlassCard>
          </Link>

          <Link href="/admin/announcements" className="group">
            <GlassCard className="p-4 hover:border-purple-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Announce</h4>
                  <p className="text-[11px] text-muted-foreground">Targeted bulletins</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </GlassCard>
          </Link>
        </div>
      </div>

      {/* 4. Recent Security Audit Log */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-foreground">
              Recent Login Security Activity
            </h3>
          </div>
          <Link href="/admin/logs" className="text-xs text-amber-400 hover:underline">
            View full audit →
          </Link>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          {recentLogins.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">No recent logins logged.</p>
          ) : (
            recentLogins.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.success ? "bg-emerald-400" : "bg-rose-500"
                    }`}
                  />
                  <div>
                    <span className="font-mono text-foreground font-semibold">
                      Student #{log.student_id ? log.student_id.slice(0, 8) : "Unknown"}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {log.action} • {log.success ? "Success" : `Failed (${log.failure_reason})`}
                    </span>
                  </div>
                </div>

                <div className="text-muted-foreground font-mono text-[11px]">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
