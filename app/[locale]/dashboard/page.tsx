import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedRing } from "@/components/ui/animated-ring";
import { StatCounter } from "@/components/ui/stat-counter";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import {
  Trophy,
  BarChart3,
  CalendarCheck,
  FileText,
  Flame,
  ArrowRight,
  Lightbulb,
  Bell,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardMainPage() {
  const data = await getStudentDashboardData();
  const metrics = data.metrics;
  const nextPaper = data.papers?.ongoing[0];
  const newestAnnouncement = data.announcements?.[0];
  const newestNote = data.specialNotes?.[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Student Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {data.student.fullName.split(" ")[0]}!
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            ID: <span className="text-amber-400 font-bold">{data.student.uniqueId}</span> • Grade {data.student.grade} (
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
      </div>

      {/* 2. Bento Grid Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Latest Result with Animated Ring */}
        <GlassCard variant="bento" spotlight glowColor="rgba(250, 204, 21, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Latest Result
            </span>
            <Badge variant="accent">
              {metrics?.latestResult ? "Marked" : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            {metrics?.latestResult ? (
              <>
                <div className="space-y-1">
                  <div className="text-3xl font-extrabold text-foreground font-mono">
                    <StatCounter value={metrics.latestResult.marks} decimals={1} />
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      / {metrics.latestResult.totalMarks}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {metrics.latestResult.paperTitle}
                  </p>
                </div>
                <div className="shrink-0">
                  <AnimatedRing
                    value={metrics.latestResult.percentage}
                    size={72}
                    strokeWidth={7}
                    color="var(--accent)"
                  />
                </div>
              </>
            ) : (
              <div className="py-4 text-xs text-muted-foreground">
                No recent paper marked yet.
              </div>
            )}
          </div>
        </GlassCard>

        {/* Card 2: Overall Average */}
        <GlassCard variant="bento" spotlight glowColor="rgba(108, 92, 231, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overall Average
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono pt-2">
            <StatCounter value={metrics?.averageScore || 0} decimals={1} suffix="%" />
          </div>
          <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
            Across all term papers & drills
          </p>
        </GlassCard>

        {/* Card 3: Class Rank Band */}
        <GlassCard variant="bento" spotlight glowColor="rgba(45, 212, 160, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Performance Band
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono pt-2">
            {metrics?.rankBand || "Core Band"}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Grade {data.student.grade} Kurunegala batch
          </p>
        </GlassCard>

        {/* Card 4: Attendance & Streak */}
        <GlassCard variant="bento" spotlight glowColor="rgba(249, 115, 22, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Attendance %
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="text-3xl font-extrabold text-foreground font-mono">
              <StatCounter value={metrics?.attendancePercentage || 95} suffix="%" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{metrics?.attendanceStreak || 4} streak</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Active class attendance rate
          </p>
        </GlassCard>
      </div>

      {/* 3. Mid Section: Next Ongoing Paper & Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Paper Target Card */}
        <GlassCard className="p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Ongoing Class Paper
              </h3>
            </div>
            <Badge variant="warn">Open Now</Badge>
          </div>

          {nextPaper ? (
            <div className="space-y-3 pt-1">
              <div>
                <h4 className="font-semibold text-lg text-foreground">
                  {nextPaper.title}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Grade {nextPaper.grade} • Due:{" "}
                  {nextPaper.due_at
                    ? new Date(nextPaper.due_at).toLocaleDateString()
                    : "End of Week"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-amber-400">
                  Total: {nextPaper.total_marks} Marks
                </span>
                <Link href="/dashboard/papers">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <span>View Papers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No paper currently in ongoing submission window.
            </div>
          )}
        </GlassCard>

        {/* Latest Announcement & Special Note Preview */}
        <GlassCard className="p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Latest Notice & Sir&apos;s Note
              </h3>
            </div>
            <Link
              href="/dashboard/announcements"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>All Notices</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {newestAnnouncement && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {newestAnnouncement.title}
                  </span>
                  {newestAnnouncement.pinned && (
                    <Badge variant="accent" className="text-[9px] px-1.5 py-0">
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  {newestAnnouncement.body}
                </p>
              </div>
            )}

            {newestNote && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Sir&apos;s Feedback
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(newestNote.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-300 italic">
                  &ldquo;{newestNote.body}&rdquo;
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* 4. Focus Areas: Top 3 Weak Topics with Action Tips */}
      <GlassCard className="p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Focus Areas & Rapid Improvement Tips
              </h3>
              <p className="text-xs text-muted-foreground">
                Actionable focus topics identified by deterministic performance metrics
              </p>
            </div>
          </div>
          <Badge variant="accent" dot>
            Target Revision
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {metrics?.focusAreas.map((fa, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  Focus 0{i + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <h4 className="font-semibold text-sm text-foreground">
                {fa.topic}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {fa.tip}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
