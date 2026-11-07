"use client";

import React from "react";
import { RuleBasedInsights, FocusArea } from "@/lib/analysis/types";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface InsightsPanelProps {
  insights: RuleBasedInsights;
  focusAreas: FocusArea[];
  biggestDrop?: {
    paperTitle: string;
    dropPercentage: number;
    fromScore: number;
    toScore: number;
  } | null;
  biggestImprovement?: {
    paperTitle: string;
    gainPercentage: number;
    fromScore: number;
    toScore: number;
  } | null;
}

export function InsightsPanel({
  insights,
  focusAreas,
  biggestDrop,
  biggestImprovement,
}: InsightsPanelProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header with Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h3 className="text-base font-bold text-foreground">
            Deterministic Diagnostic Assessment
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
          Pure Analysis Engine
        </span>
      </div>

      {/* 2. Critical Alert Banner if significant drop or improvement */}
      {biggestImprovement && biggestImprovement.gainPercentage >= 10 && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-300">
              Breakthrough Peak Performance: +{biggestImprovement.gainPercentage}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Achieved in {biggestImprovement.paperTitle} (jumped from {biggestImprovement.fromScore}% to{" "}
              {biggestImprovement.toScore}%).
            </p>
          </div>
        </div>
      )}

      {biggestDrop && biggestDrop.dropPercentage >= 12 && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-rose-300">
              Downfall Alert: -{biggestDrop.dropPercentage}% Dip
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Experienced in {biggestDrop.paperTitle} (fell from {biggestDrop.fromScore}% to{" "}
              {biggestDrop.toScore}%). Review problem areas to avoid recurring pitfalls.
            </p>
          </div>
        </div>
      )}

      {/* 3. Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Identified Strengths
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {insights.strengthsSummary}
          </p>
        </div>

        {/* Weaknesses */}
        <div className="p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Priority Weaknesses
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {insights.weaknessesSummary}
          </p>
          {focusAreas.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {focusAreas.map((fa, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  {fa.topic}: {Math.round(fa.percentage)}%
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Three Concrete Next Steps ("What to do next") */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            What To Do Next (3 Concrete Action Steps)
          </h4>
        </div>

        <div className="space-y-2">
          {insights.actionSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] border border-blue-500/30">
                {idx + 1}
              </span>
              <p className="text-muted-foreground pt-0.5 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Predicted Trajectory Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 space-y-1">
        <div className="flex items-center gap-1.5 text-sky-400 text-xs font-semibold">
          <ArrowUpRight className="w-4 h-4" />
          <span>Projected Trajectory (Estimate)</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {insights.trajectoryNote}
        </p>
      </div>
    </div>
  );
}
