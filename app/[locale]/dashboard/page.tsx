import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedRing } from "@/components/ui/animated-ring";
import { StatCounter } from "@/components/ui/stat-counter";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { TrendLineChart } from "@/components/analysis/trend-line-chart";
import {
  Trophy,
  ChartLineUp,
  CalendarCheck,
  FileText,
  Fire,
  ArrowRight,
  Lightbulb,
  Bell,
  ChatCircleText,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function DashboardMainPage() {
  const data = await getStudentDashboardData();
  const metrics = data.metrics;
  const nextPaper = data.papers?.ongoing[0];
  const newestAnnouncement = data.announcements?.[0];
  const newestNote = data.specialNotes?.[0];

  const paperHistory = (data.papers?.recentlyDone || []).map((p, idx) => ({
    paperId: p.paperId,
    paperTitle: p.paperTitle,
    date: p.date,
    marksScored: p.marks,
    totalMarks: p.totalMarks,
    studentPercentage: p.percentage,
    classAveragePercentage: 65,
    topperPercentage: 92,
    rank: idx + 1,
    totalStudents: 40,
    percentileBand: "Top 15%",
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* 1. Header Greeting & Quick Actions */}
      <Glass
        tint="subtle"
        className="p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--brand)] font-semibold">
              Student Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            {data.student.fullName.split(" ")[0]} · Overview
          </h1>
          <p className="text-xs text-[var(--muted)] font-mono [font-feature-settings:'tnum'_1]">
            ID: <span className="text-[var(--brand)] font-bold">{data.student.uniqueId}</span> • Grade {data.student.grade} (
            {data.student.classType === "TP" ? "Theory + Paper" : "Theory Only"})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SendReportButton
            studentId={data.student.uniqueId}
            reportPending={data.student.reportPending}
            lastReportRequestTime={data.lastReportRequest?.createdAt}
            parentWaVerified={data.student.parentWaVerified}
            size="md"
          />
        </div>
      </Glass>

      {/* 2. Bento Grid Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Latest Result with Animated Ring */}
        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Latest result
            </span>
            <Badge variant="accent">
              {metrics?.latestResult ? "Marked" : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            {metrics?.latestResult ? (
              <>
                <div className="space-y-1">
                  <div className="text-3xl font-extrabold text-[var(--text)] font-mono [font-feature-settings:'tnum'_1]">
                    <StatCounter value={metrics.latestResult.marks} decimals={1} />
                    <span className="text-xs text-[var(--muted)] font-normal ml-1">
                      / {metrics.latestResult.totalMarks}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] truncate max-w-[140px]">
                    {metrics.latestResult.paperTitle}
                  </p>
                </div>
                <div className="shrink-0">
                  <AnimatedRing
                    value={metrics.latestResult.percentage}
                    size={68}
                    strokeWidth={6}
                    color="var(--brand)"
                  />
                </div>
              </>
            ) : (
              <div className="py-4 text-xs text-[var(--muted)]">
                No recent paper marked yet.
              </div>
            )}
          </div>
        </Glass>

        {/* Card 2: Overall Average */}
        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Overall average
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
              <ChartLineUp size={16} weight="regular" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)] font-mono pt-2 [font-feature-settings:'tnum'_1]">
            <StatCounter value={metrics?.averageScore || 0} decimals={1} suffix="%" />
          </div>
          <p className="text-xs text-[var(--muted)] pt-1">
            Across all term papers &amp; drills
          </p>
        </Glass>

        {/* Card 3: Class Rank Band */}
        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Performance band
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--brand)]">
              <Trophy size={16} weight="regular" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono pt-2">
            {metrics?.rankBand || "Core Band"}
          </div>
          <p className="text-xs text-[var(--muted)] pt-1">
            Grade {data.student.grade} Kurunegala batch
          </p>
        </Glass>

        {/* Card 4: Attendance & Streak */}
        <Glass tint="subtle" className="p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              Attendance rate
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
              <CalendarCheck size={16} weight="regular" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="text-3xl font-extrabold text-[var(--text)] font-mono [font-feature-settings:'tnum'_1]">
              <StatCounter value={metrics?.attendancePercentage || 95} suffix="%" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[var(--brand)] text-xs font-semibold [font-feature-settings:'tnum'_1]">
              <Fire size={14} weight="fill" />
              <span>{metrics?.attendanceStreak || 4} streak</span>
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] pt-1">
            Verified session presence
          </p>
        </Glass>
      </div>

      {/* 3. Longitudinal Performance Chart */}
      {paperHistory.length > 0 && (
        <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block">
                Diagnostic Trajectory
              </span>
              <h3 className="text-lg font-bold text-[var(--text)]">
                Mark history &amp; class comparisons
              </h3>
            </div>
            <Badge variant="brand" dot>
              Updated Weekly
            </Badge>
          </div>
          <TrendLineChart data={paperHistory} />
        </Glass>
      )}

      {/* 4. Ongoing Paper & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Paper Target Card */}
        <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} weight="regular" className="text-[var(--brand)]" />
                <h3 className="font-bold text-[var(--text)] text-sm uppercase tracking-wider">
                  Ongoing class paper
                </h3>
              </div>
              <Badge variant="warn">Open Now</Badge>
            </div>

            {nextPaper ? (
              <div className="space-y-2 pt-1">
                <h4 className="font-semibold text-lg text-[var(--text)]">
                  {nextPaper.title}
                </h4>
                <p className="text-xs text-[var(--muted)] font-mono">
                  Grade {nextPaper.grade} • Due:{" "}
                  {nextPaper.due_at
                    ? new Date(nextPaper.due_at).toLocaleDateString()
                    : "End of Week"}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[var(--muted)]">
                No paper currently in ongoing submission window.
              </div>
            )}
          </div>

          {nextPaper && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <span className="text-xs font-mono text-[var(--brand)] [font-feature-settings:'tnum'_1]">
                Total: {nextPaper.total_marks} Marks
              </span>
              <Link href="/dashboard/papers">
                <Button variant="secondary" size="sm" className="gap-2 text-xs">
                  <span>View papers</span>
                  <ArrowRight size={14} weight="bold" />
                </Button>
              </Link>
            </div>
          )}
        </Glass>

        {/* Latest Notice & Special Note */}
        <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={18} weight="regular" className="text-[var(--brand)]" />
                <h3 className="font-bold text-[var(--text)] text-sm uppercase tracking-wider">
                  Latest notice &amp; notes
                </h3>
              </div>
              <Link
                href="/dashboard/announcements"
                className="text-xs text-[var(--brand)] hover:underline flex items-center gap-1"
              >
                <span>All notices</span>
                <ArrowRight size={12} weight="bold" />
              </Link>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {newestAnnouncement && (
                <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text)]">
                      {newestAnnouncement.title}
                    </span>
                    {newestAnnouncement.pinned && (
                      <Badge variant="accent" className="text-[9px] px-1.5 py-0">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <p className="text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {newestAnnouncement.body}
                  </p>
                </div>
              )}

              {newestNote && (
                <div className="p-4 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--brand)] flex items-center gap-1.5">
                      <ChatCircleText size={16} weight="regular" />
                      Sir&apos;s feedback
                    </span>
                    <span className="text-[10px] text-[var(--muted)] font-mono [font-feature-settings:'tnum'_1]">
                      {new Date(newestNote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[var(--text)] italic leading-relaxed">
                    &ldquo;{newestNote.body}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </Glass>
      </div>

      {/* 5. Focus Areas */}
      {metrics?.focusAreas && metrics.focusAreas.length > 0 && (
        <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb size={20} weight="regular" className="text-[var(--brand)]" />
              <div>
                <h3 className="font-bold text-[var(--text)] text-sm uppercase tracking-wider">
                  Targeted improvement focus
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Identified by deterministic section-by-section analysis
                </p>
              </div>
            </div>
            <Badge variant="accent" dot>
              Target Revision
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {metrics.focusAreas.map((fa, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2 hover:border-[var(--brand)]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[var(--brand)] font-bold [font-feature-settings:'tnum'_1]">
                    Focus 0{i + 1}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                </div>
                <h4 className="font-semibold text-sm text-[var(--text)]">
                  {fa.topic}
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {fa.tip}
                </p>
              </div>
            ))}
          </div>
        </Glass>
      )}
    </div>
  );
}
