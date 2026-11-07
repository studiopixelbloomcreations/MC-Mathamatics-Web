"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Download,
  Award,
  Layers,
} from "lucide-react";
import { PaperRecord, RecentlyDonePaper } from "@/app/actions/dashboard";

interface PaperResultsViewProps {
  ongoingPapers: Array<PaperRecord>;
  finishedPapers: Array<PaperRecord>;
  recentlyDone: Array<RecentlyDonePaper>;
  studentGrade: number;
}

export function PaperResultsView({
  ongoingPapers,
  finishedPapers,
  recentlyDone,
  studentGrade,
}: PaperResultsViewProps) {
  const [activeTab, setActiveTab] = useState<"ongoing" | "finished" | "recent">("recent");
  const [selectedPaperDetail, setSelectedPaperDetail] = useState<RecentlyDonePaper | null>(null);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "recent"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          Recently Marked ({recentlyDone.length})
        </button>

        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "ongoing"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          Ongoing Papers ({ongoingPapers.length})
        </button>

        <button
          onClick={() => setActiveTab("finished")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "finished"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          All Finished Papers ({finishedPapers.length})
        </button>
      </div>

      {/* Tab 1: Recently Done */}
      {activeTab === "recent" && (
        <div className="space-y-4 animate-in fade-in">
          {recentlyDone.length === 0 ? (
            <GlassCard className="p-10 text-center text-muted-foreground text-sm">
              No recent paper marked yet.
            </GlassCard>
          ) : (
            recentlyDone.map((item) => (
              <GlassCard
                key={item.id}
                className="p-5 border-white/10 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                onClick={() => setSelectedPaperDetail(item)}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="accent" className="text-[10px]">
                      Grade {studentGrade}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-foreground group-hover:text-amber-400 transition-colors">
                    {item.paperTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Click to view section breakdown & anonymous class comparison
                  </p>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  {/* Delta indicator */}
                  <div className="flex items-center gap-1 font-mono text-xs">
                    {item.diff > 0 ? (
                      <span className="flex items-center text-emerald-400 font-bold">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                        +{item.diff}
                      </span>
                    ) : item.diff < 0 ? (
                      <span className="flex items-center text-red-400 font-bold">
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                        {item.diff}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Marks & % */}
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black font-mono text-foreground">
                      {item.marks}{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        / {item.totalMarks}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {item.percentage}%
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Ongoing Papers */}
      {activeTab === "ongoing" && (
        <div className="space-y-4 animate-in fade-in">
          {ongoingPapers.length === 0 ? (
            <GlassCard className="p-10 text-center text-muted-foreground text-sm">
              No papers currently in ongoing submission for Grade {studentGrade}.
            </GlassCard>
          ) : (
            ongoingPapers.map((paper) => (
              <GlassCard
                key={paper.id}
                className="p-6 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="warn">Ongoing</Badge>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Due: {paper.due_at ? new Date(paper.due_at).toLocaleDateString() : "This Week"}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-foreground">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    Total Marks: {paper.total_marks} • Grade {paper.grade}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() =>
                      alert("Question paper file will download once uploaded by Sir to storage.")
                    }
                  >
                    <Download className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Download Paper (PDF)</span>
                  </Button>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Finished Papers */}
      {activeTab === "finished" && (
        <div className="space-y-4 animate-in fade-in">
          {finishedPapers.length === 0 ? (
            <GlassCard className="p-10 text-center text-muted-foreground text-sm">
              No finished papers found.
            </GlassCard>
          ) : (
            finishedPapers.map((paper) => (
              <GlassCard
                key={paper.id}
                className="p-5 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-[10px]">
                      Finished
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {paper.paper_date ? new Date(paper.paper_date).toLocaleDateString() : "Completed"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-base text-foreground">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    Grade {paper.grade} • Maximum Marks: {paper.total_marks}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs self-start sm:self-center"
                  onClick={() =>
                    alert("Marking scheme download will be available when published.")
                  }
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Marking Scheme</span>
                </Button>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Detail Modal / Drawer (Blueprint A4-2) */}
      <Modal
        isOpen={Boolean(selectedPaperDetail)}
        onClose={() => setSelectedPaperDetail(null)}
        title={selectedPaperDetail?.paperTitle || "Paper Breakdown"}
        description={`Performance evaluation and section-wise breakdown`}
      >
        {selectedPaperDetail && (
          <div className="space-y-6 py-2">
            {/* Top Score Comparison */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-white/10 bg-white/5 text-center">
              <div>
                <span className="text-[11px] text-muted-foreground">Your Score</span>
                <div className="text-xl font-bold font-mono text-amber-400">
                  {selectedPaperDetail.marks} / {selectedPaperDetail.totalMarks}
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {selectedPaperDetail.percentage}%
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground">Class Average</span>
                <div className="text-xl font-bold font-mono text-zinc-300">
                  68.5
                </div>
                <span className="text-[10px] text-emerald-400">Anonymous</span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground">Top Score</span>
                <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" />
                  96.0
                </div>
                <span className="text-[10px] text-muted-foreground">Anonymous</span>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Section-wise Scores
              </h5>

              {Object.keys(selectedPaperDetail.sectionMarks).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(selectedPaperDetail.sectionMarks).map(
                    ([sectionName, score]) => (
                      <div
                        key={sectionName}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 text-xs font-mono"
                      >
                        <span className="text-zinc-300">{sectionName}</span>
                        <span className="font-bold text-amber-400">
                          {String(score)} marks
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Overall score entered without section tags.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPaperDetail(null)}
              >
                Close
              </Button>
              <Button
                variant="accent"
                size="sm"
                className="gap-2"
                onClick={() => {
                  alert("Downloading paper and solution key...");
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Paper (PDF)</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
