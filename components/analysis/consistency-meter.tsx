"use client";

import React from "react";
import { Activity, Gauge, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnalysisMetrics } from "@/lib/analysis/types";

interface ConsistencyMeterProps {
  metrics: AnalysisMetrics;
}

export function ConsistencyMeter({ metrics }: ConsistencyMeterProps) {
  const { consistencyScore, consistencyRating, trend, paperCount } = metrics;

  const getMeterColor = (score: number) => {
    if (score >= 85) return "from-emerald-500 to-teal-400";
    if (score >= 70) return "from-sky-500 to-indigo-400";
    if (score >= 55) return "from-blue-600 to-sky-400";
    return "from-rose-500 to-orange-400";
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "Exceptionally Stable":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Consistent":
        return "bg-sky-500/20 text-sky-300 border-sky-500/40";
      case "Moderate Variance":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "Volatile":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      default:
        return "bg-neutral-800 text-neutral-300 border-white/10";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Consistency Index
          </span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getRatingBadge(
            consistencyRating
          )}`}
        >
          {consistencyRating}
        </span>
      </div>

      {/* Main Score Display & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-foreground">
              {consistencyScore}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ 100</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {paperCount} {paperCount === 1 ? "paper evaluated" : "papers evaluated"}
          </span>
        </div>

        {/* Visual Bar */}
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getMeterColor(
              consistencyScore
            )} transition-all duration-1000 ease-out`}
            style={{ width: `${consistencyScore}%` }}
          />
        </div>
      </div>

      {/* Trajectory Slope & Stability Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            {trend.direction === "improving" ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : trend.direction === "declining" ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>Trend Slope</span>
          </div>
          <p className="text-sm font-bold font-mono text-foreground">
            {trend.slope > 0 ? `+${trend.slope}%` : `${trend.slope}%`} / test
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Last 3 Avg</span>
          </div>
          <p className="text-sm font-bold font-mono text-foreground">
            {trend.lastThreeAverage}%
          </p>
        </div>
      </div>
    </div>
  );
}
