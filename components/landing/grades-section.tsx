"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";

export function GradesSection() {
  const grades = [
    {
      grade: "Grade 6",
      tag: "Junior Foundation",
      focus: "Arithmetic, Basic Geometry & Fractions",
      sessions: "Weekly 2.5h",
      badge: "T Stream",
    },
    {
      grade: "Grade 7",
      tag: "Junior Foundation",
      focus: "Pre-Algebra, Measurements & Graphs",
      sessions: "Weekly 2.5h",
      badge: "T Stream",
    },
    {
      grade: "Grade 8",
      tag: "Junior Foundation",
      focus: "Linear Equations, Angles & Percentages",
      sessions: "Weekly 3.0h",
      badge: "T Stream",
    },
    {
      grade: "Grade 9",
      tag: "Junior High",
      focus: "Simultaneous Equations, Pythagoras & Probability",
      sessions: "Weekly 3.0h",
      badge: "T + TP Options",
    },
    {
      grade: "Grade 10",
      tag: "O/L Core Year",
      focus: "Quadratic Equations, Circle Theorems & Logarithms",
      sessions: "Weekly 3.5h + Papers",
      badge: "T & TP Streams",
      highlight: true,
    },
    {
      grade: "Grade 11",
      tag: "O/L Target Examination",
      focus: "Full Syllabus Revision, Speed Drills & Model Papers",
      sessions: "Weekly 4.0h + Intensive Papers",
      badge: "T & TP Streams",
      highlight: true,
    },
    {
      grade: "Grade 12",
      tag: "A/L Combined Mathematics",
      focus: "Pure Maths (Trigonometry, Calculus) & Applied (Vectors)",
      sessions: "Weekly 5.0h + Papers",
      badge: "Pure & Applied",
      highlight: true,
    },
    {
      grade: "Grade 13",
      tag: "A/L Fast-Track Final",
      focus: "Integration, Statics, Dynamics & Island-Rank Papers",
      sessions: "Weekly 6.0h + Model Sittings",
      badge: "Pure & Applied",
      highlight: true,
    },
  ];

  return (
    <section id="grades" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="accent" dot>
            Class Batches (Grades 6–13)
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Curated Programs by Academic Grade
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Tailored curricula adhering to the Sri Lankan National Syllabus with
            specialized tracks for Theory (T) and Theory + Paper (TP).
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {grades.map((item, idx) => (
          <Reveal key={idx} delay={idx * 0.08} direction="up">
            <GlassCard
              variant="bento"
              spotlight
              glowColor={item.highlight ? "rgba(255, 200, 87, 0.2)" : "rgba(108, 92, 231, 0.15)"}
              className={`h-full min-h-[290px] justify-between p-6 ${
                item.highlight ? "border-[var(--accent)]/30" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-[var(--text)]">
                    {item.grade}
                  </span>
                  <Badge variant={item.highlight ? "accent" : "default"}>
                    {item.badge}
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-[var(--brand)]">
                  {item.tag}
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {item.focus}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                  <Clock className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>{item.sessions}</span>
                </div>
                <Link href="/signup">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Enroll for {item.grade}
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
