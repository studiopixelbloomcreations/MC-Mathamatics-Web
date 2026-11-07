"use client";

import React from "react";
import { PaperHistoryItem } from "@/lib/analysis/types";
import { Award, ShieldCheck } from "lucide-react";

interface RankMovementChartProps {
  data: PaperHistoryItem[];
  isSmallClass?: boolean;
}

export function RankMovementChart({ data, isSmallClass }: RankMovementChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
        <p className="text-sm text-muted-foreground">Percentile tracking begins after your first paper.</p>
      </div>
    );
  }

  const getBandStyles = (band: string) => {
    switch (band) {
      case "Top 10%":
        return {
          bg: "bg-amber-500/15 border-amber-500/40 text-amber-300",
          dot: "bg-amber-400",
          label: "Elite Tier (Top 10%)",
        };
      case "Top 25%":
        return {
          bg: "bg-sky-500/15 border-sky-500/40 text-sky-300",
          dot: "bg-sky-400",
          label: "Advanced Tier (Top 25%)",
        };
      case "Top 50%":
        return {
          bg: "bg-indigo-500/15 border-indigo-500/40 text-indigo-300",
          dot: "bg-indigo-400",
          label: "Upper Half (Top 50%)",
        };
      default:
        return {
          bg: "bg-neutral-800 border-white/10 text-neutral-300",
          dot: "bg-neutral-400",
          label: isSmallClass ? "Class < 5 (Provisional)" : "Core Band",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Timeline Progression</span>
        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Anonymized Percentile Bands
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {data.map((item, idx) => {
          const style = getBandStyles(item.percentileBand);
          const isLatest = idx === data.length - 1;

          return (
            <div key={item.paperId} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-background transition-transform group-hover:scale-125 ${
                  isLatest ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" : style.dot
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-white/[0.02] border-white/5 hover:border-white/15 transition-all">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.paperTitle}</p>
                    {isLatest && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.date} • Score: <span className="text-foreground font-medium">{item.marksScored}/{item.totalMarks} ({item.studentPercentage}%)</span>
                  </p>
                </div>

                <div className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${style.bg}`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>{item.percentileBand}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
