"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Award, BookOpen, MapPin, CheckCircle2 } from "lucide-react";

export function MeetSir() {
  return (
    <section id="meet-sir" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Photo Card Column */}
        <div className="lg:col-span-5">
          <Reveal direction="right">
            <GlassCard
              spotlight
              glowColor="rgba(255, 200, 87, 0.25)"
              className="relative aspect-[4/5] rounded-3xl overflow-hidden flex flex-col justify-end p-8 border border-[var(--border)] group"
            >
              {/* Background Portrait Graphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent z-10" />

              {/* TODO: Sir Malinga C Dissanayake to replace this placeholder with his high-resolution professional portrait */}
              <div className="absolute inset-0 bg-[var(--surface)] flex flex-col items-center justify-center p-6 text-center">
                <div className="h-24 w-24 rounded-full bg-[var(--surface-glass)] border border-[var(--border)] flex items-center justify-center text-3xl font-black font-mono text-[var(--accent)] mb-4 shadow-xl">
                  MC
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
                  {/* TODO: Upload official portrait image to Supabase storage */}
                  [Photo Area: Sir Malinga C Dissanayake]
                </span>
                <p className="text-[11px] text-[var(--muted)] mt-1 max-w-xs">
                  Photo placeholder: To be replaced by Sir with official studio portrait.
                </p>
              </div>

              {/* Floating Bottom Card Over Portrait */}
              <div className="relative z-20 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)]/90 backdrop-blur-xl p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <Badge variant="accent" dot>
                    Active Educator
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>Kurunegala, LK</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Malinga C Dissanayake
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Specialist in O/L Mathematics &amp; A/L Combined Mathematics.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>

        {/* Story & Achievements Column */}
        <div className="lg:col-span-7 space-y-8">
          <Reveal direction="left">
            <div className="space-y-4">
              <Badge variant="brand" dot>
                Pedagogical Leadership
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Empowering Minds.{" "}
                <span className="font-serif italic text-[var(--accent)]">
                  Demystifying Mathematics.
                </span>
              </h2>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                {/* TODO: Sir Malinga can customize this biography text */}
                With over a decade of dedicated classroom teaching in Kurunegala,
                Sir Malinga C Dissanayake has transformed how Sri Lankan students approach
                mathematics. Rather than rote memorization, his methodology focuses on
                first-principles derivations, analytical paper analysis, and systematic error correction.
              </p>
            </div>
          </Reveal>

          {/* Key Strengths & Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Reveal delay={0.1} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--good)]" />
                  <span className="text-sm font-semibold">Structured Paper Sittings</span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Timed model examinations mimicking actual exam pressure with instant marking.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-sm font-semibold">Island Ranking Track Record</span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Consistent producing of District and Island Ranks in O/L &amp; A/L Combined Maths.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[var(--brand)]" />
                  <span className="text-sm font-semibold">Curated Theory Modules</span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Comprehensive syllabus coverage tailored for both Theory and Theory + Paper tracks.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-sm font-semibold">Kurunegala Town Centers</span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Conveniently situated physical lecture halls with modern audio-visual infrastructure.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
