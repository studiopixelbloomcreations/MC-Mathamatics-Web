import React from "react";
import { getAdminOverviewData } from "@/app/actions/admin";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileArrowUp,
  GraduationCap,
  Robot,
  ShieldCheck,
  ArrowRight,
  PaperPlaneTilt,
  CalendarCheck,
  Bell,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();
  const { stats, systemSettings, aiStatus, recentLogins } = data;

  // Blue-shade status badge helper without color-only meaning
  const getStatusBadge = () => {
    switch (aiStatus.status) {
      case "ok":
        return {
          label: "AI: Active & Healthy",
          badgeClass: "bg-blue-600/20 text-blue-400 border-blue-500/40",
          desc: "Online",
        };
      case "ai_mode_off":
        return {
          label: "AI: Writes Paused (Mode Off)",
          badgeClass: "bg-blue-500/10 text-blue-300 border-blue-500/20",
          desc: aiStatus.reason || "AI Mode Off",
        };
      case "parent_chat_disabled":
        return {
          label: "AI: Parent Chat Paused",
          badgeClass: "bg-blue-500/10 text-blue-300 border-blue-500/20",
          desc: "Parent chat off",
        };
      case "rate_limited":
        return {
          label: "AI: Busy (Rate Limit)",
          badgeClass: "bg-blue-500/20 text-blue-200 border-blue-400/30",
          desc: "HTTP 429",
        };
      case "not_configured":
        return {
          label: "AI: Not Configured",
          badgeClass: "bg-white/5 text-[var(--muted)] border-white/10",
          desc: "Keys missing",
        };
      default:
        return {
          label: "AI: Offline / Unavailable",
          badgeClass: "bg-blue-950 text-blue-200 border-blue-800/60",
          desc: aiStatus.reason || "Offline",
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header */}
      <Glass
        tint="subtle"
        className="p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--brand)] font-semibold">
              Master Admin Cockpit
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            Overview &amp; pulse
          </h1>
          <p className="text-xs text-[var(--muted)] font-mono">
            Sir: Malinga C Dissanayake • Kurunegala, Sri Lanka
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Status Badge */}
          <Link
            href="/admin/diagnostics"
            title={aiStatus.reason || "AI Health Status"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${statusBadge.badgeClass}`}
          >
            <Robot size={15} weight="regular" />
            <span>{statusBadge.label}</span>
          </Link>

          <Link
            href="/admin/ai-mode"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              systemSettings.aiMode
                ? "bg-[var(--brand)]/15 border-[var(--brand)]/40 text-[var(--brand)]"
                : "bg-white/5 border-white/10 text-[var(--muted)] hover:bg-white/10"
            }`}
          >
            <ShieldCheck size={16} weight="regular" />
            <span>Mode: {systemSettings.aiMode ? "ON" : "OFF"}</span>
          </Link>
        </div>
      </Glass>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Enrolled students
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--brand)]">
              <Users size={16} weight="regular" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-[var(--text)] [font-feature-settings:'tnum'_1]">
              {stats.totalStudents}
            </span>
            <p className="text-xs text-[var(--muted)] mt-1">
              Grades 6–13 (Theory + Paper)
            </p>
          </div>
        </Glass>

        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Ongoing papers
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
              <FileArrowUp size={16} weight="regular" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-[var(--text)] [font-feature-settings:'tnum'_1]">
              {stats.ongoingPapers}
            </span>
            <p className="text-xs text-[var(--muted)] mt-1 [font-feature-settings:'tnum'_1]">
              {stats.finishedPapers} archived papers
            </p>
          </div>
        </Glass>

        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Marks evaluated
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-emerald-400">
              <GraduationCap size={16} weight="regular" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400 [font-feature-settings:'tnum'_1]">
              {stats.totalMarksEntered}
            </span>
            <p className="text-xs text-[var(--muted)] mt-1">
              Deterministic diagnostics
            </p>
          </div>
        </Glass>

        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              WhatsApp engine
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--brand)]">
              <PaperPlaneTilt size={16} weight="regular" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-base font-bold font-mono text-[var(--brand)]">
              Free-First (24h)
            </span>
            <p className="text-xs text-[var(--muted)] mt-1">
              Paid templates:{" "}
              <span className={systemSettings.paidTemplatesEnabled ? "text-[var(--brand)] font-semibold" : "text-emerald-400 font-semibold"}>
                {systemSettings.paidTemplatesEnabled ? "ENABLED" : "OFF (0 Cost)"}
              </span>
            </p>
          </div>
        </Glass>
      </div>

      {/* 3. Quick Action Controls */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted)]">
          Academic command controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/papers" className="group">
            <Glass tint="subtle" className="p-4 rounded-2xl hover:border-[var(--brand)]/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--brand)]">
                  <FileArrowUp size={18} weight="regular" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">Upload paper</h4>
                  <p className="text-[11px] text-[var(--muted)]">PDFs &amp; topic weights</p>
                </div>
              </div>
              <ArrowRight size={14} weight="bold" className="text-[var(--muted)] group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all" />
            </Glass>
          </Link>

          <Link href="/admin/marks" className="group">
            <Glass tint="subtle" className="p-4 rounded-2xl hover:border-emerald-500/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-emerald-400">
                  <GraduationCap size={18} weight="regular" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">Record marks</h4>
                  <p className="text-[11px] text-[var(--muted)]">Single &amp; bulk entry</p>
                </div>
              </div>
              <ArrowRight size={14} weight="bold" className="text-[var(--muted)] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Glass>
          </Link>

          <Link href="/admin/attendance" className="group">
            <Glass tint="subtle" className="p-4 rounded-2xl hover:border-[var(--brand)]/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
                  <CalendarCheck size={18} weight="regular" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">Attendance</h4>
                  <p className="text-[11px] text-[var(--muted)]">Class roll call</p>
                </div>
              </div>
              <ArrowRight size={14} weight="bold" className="text-[var(--muted)] group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all" />
            </Glass>
          </Link>

          <Link href="/admin/announcements" className="group">
            <Glass tint="subtle" className="p-4 rounded-2xl hover:border-[var(--brand)]/40 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
                  <Bell size={18} weight="regular" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">Announce</h4>
                  <p className="text-[11px] text-[var(--muted)]">Targeted bulletins</p>
                </div>
              </div>
              <ArrowRight size={14} weight="bold" className="text-[var(--muted)] group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all" />
            </Glass>
          </Link>
        </div>
      </div>

      {/* 4. Recent Security Audit Log (Calm, dense table) */}
      <Glass tint="subtle" className="p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} weight="regular" className="text-emerald-400" />
            <h3 className="text-sm font-bold text-[var(--text)]">
              Recent login activity
            </h3>
          </div>
          <Link href="/admin/logs" className="text-xs text-[var(--brand)] hover:underline">
            View full audit →
          </Link>
        </div>

        <div className="divide-y divide-[var(--border)] text-xs">
          {recentLogins.length === 0 ? (
            <p className="py-4 text-center text-[var(--muted)]">No recent logins logged.</p>
          ) : (
            recentLogins.map((log) => (
              <div key={log.id} className="py-3 px-2 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.success ? "bg-emerald-400" : "bg-rose-500"
                    }`}
                  />
                  <div>
                    <span className="font-mono text-[var(--text)] font-semibold [font-feature-settings:'tnum'_1]">
                      Student #{log.student_id ? log.student_id.slice(0, 8) : "Unknown"}
                    </span>
                    <span className="text-[var(--muted)] ml-2">
                      {log.action} • {log.success ? "Success" : `Failed (${log.failure_reason})`}
                    </span>
                  </div>
                </div>

                <div className="text-[var(--muted)] font-mono text-[11px] [font-feature-settings:'tnum'_1]">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))
          )}
        </div>
      </Glass>
    </div>
  );
}
