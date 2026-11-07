"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import { AlertCircle, Award } from "lucide-react";

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
    <section id="analysis" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            Live Preview · Kamal Perera (MCG10TP1001)
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            See Exactly Where Marks Are Won &amp; Lost
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            A dynamic dashboard designed to turn ambiguous math anxieties into
            clear, measurable weekly action steps.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Trend Line & Class Average Comparison (7 cols) */}
        <Reveal direction="up" className="lg:col-span-7">
          <GlassCard variant="bento" spotlight className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[var(--muted)] uppercase">
                  Longitudinal Performance Trend
                </span>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  Student vs. Class Average
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="good" dot>
                  +27% Over 6 Papers
                </Badge>
              </div>
            </div>

            {/* Recharts Trend Line */}
            <div className="h-64 sm:h-72 w-full pt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
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
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="student"
                      name="Kamal (Student)"
                      stroke="var(--accent)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "var(--accent)" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="classAvg"
                      name="Class Average"
                      stroke="var(--muted)"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-xl bg-[var(--surface-glass)] animate-pulse" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-4">
              <span className="flex items-center gap-1 text-[var(--accent)]">
                ● Kamal: 91% (Paper 13)
              </span>
              <span>- - - Class Avg: 66%</span>
              <span className="text-[var(--good)]">Rank Band: Top 8%</span>
            </div>
          </GlassCard>
        </Reveal>

        {/* Right: Radar Analysis Chart (5 cols) */}
        <Reveal direction="up" delay={0.15} className="lg:col-span-5">
          <GlassCard variant="bento" spotlight className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[var(--muted)] uppercase">
                  Multi-Dimensional Topics
                </span>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  Subject Radar
                </h3>
              </div>
              <Badge variant="accent">Anonymous Topper</Badge>
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
                      name="Kamal"
                      dataKey="student"
                      stroke="var(--brand)"
                      fill="var(--brand)"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Topper"
                      dataKey="topper"
                      stroke="var(--accent)"
                      fill="var(--accent)"
                      fillOpacity={0.15}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-xl bg-[var(--surface-glass)] animate-pulse" />
              )}
            </div>

            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--good)] flex items-center gap-1 font-medium">
                  <Award className="h-3.5 w-3.5" /> Strongest: Matrices &amp; Algebra
                </span>
                <span className="font-mono text-[var(--muted)]">92-95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--warn)] flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" /> Focus Area: Geometry Proofs
                </span>
                <span className="font-mono text-[var(--muted)]">74%</span>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
