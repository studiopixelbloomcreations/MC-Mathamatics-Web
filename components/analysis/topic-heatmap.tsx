"use client";

import React from "react";
import { PaperHistoryItem } from "@/lib/analysis/types";

interface TopicHeatmapProps {
  paperHistory: PaperHistoryItem[];
}

export function TopicHeatmap({ paperHistory }: TopicHeatmapProps) {
  // Extract all unique topics across all papers
  const topicSet = new Set<string>();
  for (const p of paperHistory) {
    if (p.sectionMarks) {
      for (const t of Object.keys(p.sectionMarks)) {
        topicSet.add(t.charAt(0).toUpperCase() + t.slice(1));
      }
    }
  }

  const topics = Array.from(topicSet);

  if (topics.length === 0 || paperHistory.length === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
        <p className="text-sm font-semibold text-foreground">Detailed Heatmap Matrix</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Section marks from papers will automatically generate your comprehensive topic x test performance matrix.
        </p>
      </div>
    );
  }

  const getHeatClass = (score: number | undefined) => {
    if (score === undefined) {
      return "bg-white/5 text-muted-foreground border-white/5";
    }
    if (score >= 80) {
      return "bg-emerald-500/25 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/35";
    }
    if (score >= 65) {
      return "bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30";
    }
    if (score >= 50) {
      return "bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30";
    }
    return "bg-rose-500/25 text-rose-300 border-rose-500/40 hover:bg-rose-500/35";
  };

  return (
    <div className="overflow-x-auto pb-2">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
              Topic / Syllabus Area
            </th>
            {paperHistory.map((p, idx) => (
              <th
                key={p.paperId}
                className="py-2.5 px-3 font-mono font-medium text-center text-muted-foreground text-[11px] whitespace-nowrap"
              >
                P{idx + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {topics.map((topic) => (
            <tr key={topic} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                {topic}
              </td>
              {paperHistory.map((p) => {
                const secMarks = p.sectionMarks || {};
                // match case insensitively
                const key = Object.keys(secMarks).find(
                  (k) => k.toLowerCase() === topic.toLowerCase()
                );
                const score = key !== undefined ? Number(secMarks[key]) : undefined;
                // estimate percentage based on max 25 if total marks 100 with 4 sections
                const percentage = score !== undefined ? Math.min(100, Math.round((score / 25) * 100)) : undefined;

                return (
                  <td key={p.paperId} className="p-1.5 text-center">
                    <div
                      className={`py-1.5 px-2 rounded font-mono font-semibold text-[11px] border transition-all ${getHeatClass(
                        percentage
                      )}`}
                      title={`${topic} in ${p.paperTitle}: ${score !== undefined ? `${score} marks` : "N/A"}`}
                    >
                      {percentage !== undefined ? `${percentage}%` : "—"}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3 text-[10px] text-muted-foreground font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500" />
          <span>≥ 80% (Mastery)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-sky-500/40 border border-sky-500" />
          <span>65-79% (Proficient)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-blue-500/40 border border-blue-500" />
          <span>50-64% (Developing)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-500" />
          <span>&lt; 50% (Focus Area)</span>
        </div>
      </div>
    </div>
  );
}
