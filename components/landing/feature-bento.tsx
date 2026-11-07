"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  FileText,
  BarChart3,
  MessageSquare,
  CalendarCheck,
  Lock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function FeatureBento() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            Engineered For Excellence
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            An Intelligent Ecosystem for Mathematics
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Every feature is purpose-built to eliminate guesswork for students,
            teachers, and parents.
          </p>
        </Reveal>
      </div>

      {/* Bento Grid Layout (Apple/Linear agency style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        {/* Card 1: Smart Analysis (Wide 7 cols) */}
        <Reveal direction="up" className="md:col-span-3 lg:col-span-7">
          <GlassCard
            variant="bento"
            spotlight
            glowColor="rgba(108, 92, 231, 0.2)"
            className="h-full min-h-[320px] justify-between p-8"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)]">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <Badge variant="brand" dot>
                  Diagnostic Analytics
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)]">
                Smart Analysis &amp; Downfall Detection
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-lg">
                Deterministic calculation engine isolates weakest topics, historical score slopes,
                and section-by-section mastery. Students see exactly where marks are lost before
                the real exam.
              </p>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
                Topic Heatmaps
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--good)]">
                Anonymous Topper Comparisons
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--brand)]">
                Percentile Movement
              </span>
            </div>
          </GlassCard>
        </Reveal>

        {/* Card 2: Parent WhatsApp Reports (5 cols) */}
        <Reveal direction="up" delay={0.1} className="md:col-span-3 lg:col-span-5">
          <GlassCard
            variant="bento"
            spotlight
            glowColor="rgba(255, 200, 87, 0.25)"
            className="h-full min-h-[320px] justify-between p-8"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)]">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <Badge variant="accent" dot>
                  Free-First Architecture
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)]">
                Zero-Cost WhatsApp Reports
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Parents initiate the chat via dashboard button or QR code. Verified replies
                within the 24-hour window cost Rs 0.00 in message fees while keeping parents
                instantly informed.
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-[var(--border)]">
              <span className="text-xs font-mono text-[var(--muted)]">Rule-Based Parent Bot</span>
              <span className="text-xs font-mono font-bold text-[var(--accent)] flex items-center">
                $0 / Month Default <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
              </span>
            </div>
          </GlassCard>
        </Reveal>

        {/* Card 3: Paper Results (4 cols) */}
        <Reveal direction="up" delay={0.2} className="md:col-span-1 lg:col-span-4">
          <GlassCard
            variant="bento"
            spotlight
            className="h-full min-h-[280px] justify-between p-6"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] w-fit text-[var(--brand)]">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">Paper Results</h3>
              <p className="text-xs text-[var(--muted)]">
                Categorized into Ongoing, Finished, and Recently Marked with section score breakdowns
                and downloadable marking schemes.
              </p>
            </div>
            <div className="pt-4 text-xs font-mono text-[var(--good)] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--good)] animate-ping" />
              Live Realtime Sync
            </div>
          </GlassCard>
        </Reveal>

        {/* Card 4: Attendance Tracking (4 cols) */}
        <Reveal direction="up" delay={0.3} className="md:col-span-1 lg:col-span-4">
          <GlassCard
            variant="bento"
            spotlight
            className="h-full min-h-[280px] justify-between p-6"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] w-fit text-[var(--good)]">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">Attendance Heatmap</h3>
              <p className="text-xs text-[var(--muted)]">
                Month-by-month session presence heatmap, streak indicators, and proactive alerts
                when attendance dips below 75%.
              </p>
            </div>
            <div className="pt-4 text-xs font-mono text-[var(--muted)]">
              Physical &amp; Special Class Logs
            </div>
          </GlassCard>
        </Reveal>

        {/* Card 5: Parental Controls & PIN Security (4 cols) */}
        <Reveal direction="up" delay={0.4} className="md:col-span-1 lg:col-span-4">
          <GlassCard
            variant="bento"
            spotlight
            className="h-full min-h-[280px] justify-between p-6"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] w-fit text-[var(--accent)]">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">Parental Controls</h3>
              <p className="text-xs text-[var(--muted)]">
                Separate secondary Parent PIN allows parents to schedule dashboard access hours,
                toggle result visibility, and inspect login logs.
              </p>
            </div>
            <div className="pt-4 text-xs font-mono text-[var(--accent)] flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Hardware/Browser PIN Lock
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
