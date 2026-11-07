import React from "react";
import { getStudentAnalysisData } from "@/app/actions/analysis";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { AnimatedRing } from "@/components/ui/animated-ring";
import { StatCounter } from "@/components/ui/stat-counter";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { TrendLineChart } from "@/components/analysis/trend-line-chart";
import { TopicRadarChart } from "@/components/analysis/topic-radar-chart";
import { ComparisonBarChart } from "@/components/analysis/comparison-bar-chart";
import { RankMovementChart } from "@/components/analysis/rank-movement-chart";
import { TopicHeatmap } from "@/components/analysis/topic-heatmap";
import { ConsistencyMeter } from "@/components/analysis/consistency-meter";
import { InsightsPanel } from "@/components/analysis/insights-panel";
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  EyeOff,
  Info,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalysisDashboardPage() {
  const data = await getStudentAnalysisData();
  const { student, metrics, hideResults } = data;

  if (hideResults) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <GlassCard className="p-8 border-blue-500/30 text-center space-y-4">
          <EyeOff className="w-10 h-10 text-blue-500 mx-auto" />
          <h2 className="text-xl font-bold text-foreground">
            Analysis Temporarily Restricted
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Analytical insights and paper marks are currently hidden from student view as
            configured in Parental Controls.
          </p>
        </GlassCard>
      </div>
    );
  }

  const isSmallClass = metrics.isSmallClass;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Bar with Student ID and "Send me the report" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-xs uppercase font-mono tracking-widest text-blue-500 font-semibold">
              Diagnostic Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Diagnostic Analysis & Growth Engine
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {student.fullName} • ID:{" "}
            <span className="text-blue-500 font-bold">{student.uniqueId}</span> • Grade{" "}
            {student.grade} ({student.classType === "TP" ? "Theory + Paper" : "Theory Only"})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SendReportButton
            studentId={student.uniqueId}
            reportPending={student.reportPending}
            parentWaVerified={student.parentWaVerified}
            size="md"
          />
        </div>
      </div>

      {/* 2. Privacy & Statistical Information Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-foreground">Zero-Identity Anonymization:</strong> Class averages
            and topper scores are calculated strictly from numerical datasets. No peer identities
            are ever disclosed.
          </span>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-[11px] text-blue-500">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deterministic Code Engine</span>
        </div>
      </div>

      {/* Small Class Notification if applicable */}
      {isSmallClass && (
        <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-xs text-sky-200 leading-relaxed">
            <strong>Provisional Cohort:</strong> This grade currently has fewer than 5 completed
            papers recorded. Class averages and comparative rankings are withheld to preserve
            statistical validity and individual privacy.
          </p>
        </div>
      )}

      {/* 3. Top Bento Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Overall Average Mastery */}
        <GlassCard variant="bento" spotlight glowColor="rgba(250, 204, 21, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overall Mastery
            </span>
            <Badge variant="accent">Cumulative</Badge>
          </div>
          <div className="flex items-center gap-4 my-2">
            <AnimatedRing
              value={metrics.percentage}
              size={68}
              strokeWidth={6}
              color="#fbbf24"
              showValue={false}
            />
            <div>
              <div className="text-2xl font-extrabold font-mono text-foreground">
                <StatCounter value={metrics.percentage} decimals={1} suffix="%" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Across {metrics.paperCount} completed {metrics.paperCount === 1 ? "paper" : "papers"}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Card 2: Percentile Rank Band */}
        <GlassCard variant="bento" spotlight glowColor="rgba(56, 189, 248, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cohort Position
            </span>
            <Award className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-sky-400">
              {metrics.percentileBand}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isSmallClass
                ? "Class comparisons unlock at 5+ students"
                : `Benchmark median: ${metrics.classMedian}%`}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Topper benchmark: {metrics.topperScore}%</span>
            </div>
          </div>
        </GlassCard>

        {/* Card 3: Consistency Score Meter */}
        <GlassCard variant="bento" spotlight glowColor="rgba(16, 185, 129, 0.15)">
          <ConsistencyMeter metrics={metrics} />
        </GlassCard>

        {/* Card 4: Trajectory & Growth */}
        <GlassCard variant="bento" spotlight glowColor="rgba(139, 92, 246, 0.15)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trajectory
            </span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-purple-400 capitalize">
              {metrics.trend.direction}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Slope:{" "}
              <span className="font-mono text-foreground font-semibold">
                {metrics.trend.slope > 0 ? `+${metrics.trend.slope}` : metrics.trend.slope}%
              </span>{" "}
              per paper
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Latest test: {metrics.latestPercentage}%</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 4. Deep Dive Charts: Trend Line & Topic Mastery Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Trend Line vs Class Average */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Score Progression Over Time
              </h3>
              <p className="text-xs text-muted-foreground">
                Your paper % over time against class average (dotted)
              </p>
            </div>
            <Badge variant="default" className="font-mono text-[10px]">
              {metrics.paperHistory.length} Papers
            </Badge>
          </div>
          <TrendLineChart data={metrics.paperHistory} isSmallClass={isSmallClass} />
        </GlassCard>

        {/* Chart 2: Topic Mastery Radar */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Syllabus Topic Mastery
              </h3>
              <p className="text-xs text-muted-foreground">
                Student vs Class Avg vs Topper score across topics
              </p>
            </div>
            <Badge variant="default" className="font-mono text-[10px]">
              {metrics.radarData.length} Topics
            </Badge>
          </div>
          <TopicRadarChart data={metrics.radarData} isSmallClass={isSmallClass} />
        </GlassCard>
      </div>

      {/* 5. Benchmark Comparison & Percentile Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Bars */}
        <GlassCard className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Multi-Benchmark Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Latest test vs previous test, 3-test average, class average & topper
            </p>
          </div>
          <ComparisonBarChart metrics={metrics} />
        </GlassCard>

        {/* Rank / Percentile Movement Timeline */}
        <GlassCard className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Cohort Percentile Movement
            </h3>
            <p className="text-xs text-muted-foreground">
              Progression through performance tiers over the academic year
            </p>
          </div>
          <RankMovementChart data={metrics.paperHistory} isSmallClass={isSmallClass} />
        </GlassCard>
      </div>

      {/* 6. Topic Matrix Heatmap */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Topic x Paper Mastery Matrix
            </h3>
            <p className="text-xs text-muted-foreground">
              Detailed performance heatmap across all syllabus areas and exams
            </p>
          </div>
          <Badge variant="accent" className="font-mono text-[10px]">
            Heatmap
          </Badge>
        </div>
        <TopicHeatmap paperHistory={metrics.paperHistory} />
      </GlassCard>

      {/* 7. Deterministic Actionable Insights Panel */}
      <GlassCard className="p-6">
        <InsightsPanel
          insights={metrics.insights}
          focusAreas={metrics.focusAreas}
          biggestDrop={metrics.biggestDrop}
          biggestImprovement={metrics.biggestImprovement}
        />
      </GlassCard>
    </div>
  );
}
