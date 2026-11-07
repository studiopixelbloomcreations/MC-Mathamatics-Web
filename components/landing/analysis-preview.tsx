"use client";

import * as React from "react";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import { Trophy, WarningCircle } from "@phosphor-icons/react";

const trendData = [
  { paper: "P 08", student: 64, classAvg: 58 },
  { paper: "P 09", student: 72, classAvg: 60 },
  { paper: "P 10", student: 68, classAvg: 62 },
  { paper: "P 11", student: 79, classAvg: 63 },
  { paper: "P 12", student: 84, classAvg: 65 },
  { paper: "P 13", student: 91, classAvg: 66 },
];

const topicRadarData = [
  { topic: "Algebra", student: 92, classAvg: 68, topper: 96 },
  { topic: "Geometry", student: 74, classAvg: 60, topper: 90 },
  { topic: "Trigonometry", student: 86, classAvg: 65, topper: 94 },
  { topic: "Calculus", student: 88, classAvg: 70, topper: 98 },
  { topic: "Matrices", student: 95, classAvg: 72, topper: 98 },
  { topic: "Probability", student: 80, classAvg: 62, topper: 92 },
];

export function AnalysisPreview() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="analysis" className="py-[clamp(64px,8vw,128px)] px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            Diagnostic Preview · Student MCG10TP1001
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            See exactly where marks are won &amp; lost
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            A dynamic telemetry console designed to turn ambiguous math anxieties into
            clear, measurable weekly action steps.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Line & Class Average Comparison (7 cols) */}
        <Reveal direction="up" className="lg:col-span-7">
          <Glass tint="subtle" className="p-6 md:p-8 space-y-6 rounded-3xl h-full flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block [font-feature-settings:'tnum'_1]">
                  Performance Telemetry
                </span>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  Student vs. class average
                </h3>
              </div>
              <Badge variant="good" dot>
                +27% over 6 papers
              </Badge>
            </div>

            {/* Recharts Thin Area Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="previewGoldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="paper"
                      stroke="var(--muted)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[50, 100]}
                      stroke="var(--muted)"
                      fontSize={11}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      cursor={{ stroke: "var(--brand)", strokeWidth: 1, strokeDasharray: "2 2" }}
                      contentStyle={{
                        backgroundColor: "#0c0d10",
                        borderColor: "rgba(250, 204, 21, 0.3)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="student"
                      name="Student"
                      stroke="var(--brand)"
                      strokeWidth={1.5}
                      fill="url(#previewGoldGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="classAvg"
                      name="Class Avg"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      strokeWidth={1.2}
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-2xl bg-[var(--surface-elevated)] animate-pulse" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-4 [font-feature-settings:'tnum'_1]">
              <span className="flex items-center gap-1.5 text-[var(--brand)] font-semibold">
                ● Student: 91% (P13)
              </span>
              <span>- - - Class Avg: 66%</span>
              <span className="text-emerald-400">Rank Band: Top 8%</span>
            </div>
          </Glass>
        </Reveal>

        {/* Right: Radar Analysis Chart (5 cols) */}
        <Reveal direction="up" delay={0.15} className="lg:col-span-5">
          <Glass tint="subtle" className="p-6 md:p-8 space-y-6 rounded-3xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block">
                  Topic Balance
                </span>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  Subject radar
                </h3>
              </div>
              <Badge variant="accent">Top Percentile</Badge>
            </div>

            {/* Radar Chart */}
            <div className="h-64 sm:h-72 w-full flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={topicRadarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="topic"
                      stroke="var(--muted)"
                      fontSize={10}
                    />
                    <Radar
                      name="Student"
                      dataKey="student"
                      stroke="var(--brand)"
                      fill="var(--brand)"
                      fillOpacity={0.35}
                    />
                    <Radar
                      name="Topper"
                      dataKey="topper"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.1}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-2xl bg-[var(--surface-elevated)] animate-pulse" />
              )}
            </div>

            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Trophy size={14} weight="regular" /> Strongest: Matrices &amp; Algebra
                </span>
                <span className="font-mono text-[var(--muted)] [font-feature-settings:'tnum'_1]">92–95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--brand)] flex items-center gap-1.5 font-medium">
                  <WarningCircle size={14} weight="regular" /> Focus Area: Geometry Proofs
                </span>
                <span className="font-mono text-[var(--muted)] [font-feature-settings:'tnum'_1]">74%</span>
              </div>
            </div>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}
