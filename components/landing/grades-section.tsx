"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, Clock } from "@phosphor-icons/react";

export function GradesSection() {
  const grades = [
    {
      grade: "Grade 6",
      tag: "Junior Foundation",
      focus: "Arithmetic, basic geometry & fractions",
      sessions: "Weekly 2.5h",
      badge: "T Stream",
    },
    {
      grade: "Grade 7",
      tag: "Junior Foundation",
      focus: "Pre-algebra, measurements & graphs",
      sessions: "Weekly 2.5h",
      badge: "T Stream",
    },
    {
      grade: "Grade 8",
      tag: "Junior Foundation",
      focus: "Linear equations, angles & percentages",
      sessions: "Weekly 3.0h",
      badge: "T Stream",
    },
    {
      grade: "Grade 9",
      tag: "Junior High",
      focus: "Simultaneous equations, pythagoras & probability",
      sessions: "Weekly 3.0h",
      badge: "T + TP Options",
    },
    {
      grade: "Grade 10",
      tag: "O/L Core Year",
      focus: "Quadratic equations, circle theorems & logarithms",
      sessions: "Weekly 3.5h + Papers",
      badge: "T & TP Streams",
      highlight: true,
    },
    {
      grade: "Grade 11",
      tag: "O/L Target Examination",
      focus: "Full syllabus revision, speed drills & model papers",
      sessions: "Weekly 4.0h + Intensive Papers",
      badge: "T & TP Streams",
      highlight: true,
    },
    {
      grade: "Grade 12",
      tag: "A/L Combined Mathematics",
      focus: "Pure maths (trigonometry, calculus) & applied (vectors)",
      sessions: "Weekly 5.0h + Papers",
      badge: "A/L Stream",
    },
    {
      grade: "Grade 13",
      tag: "A/L Intensive Revision",
      focus: "Island-rank past paper drilling & diagnostic mastery",
      sessions: "Weekly 6.0h + Papers",
      badge: "A/L Stream",
      highlight: true,
    },
  ];

  return (
    <section id="grades" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            Curriculum Structure
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Academic pathways (grades 6–13)
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Every grade follows an aligned syllabus with weekly exercises,
            first-principles derivations, and standardized model evaluations.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {grades.map((item, idx) => (
          <Reveal key={idx} delay={idx * 0.05} direction="up">
            <Glass
              tint="subtle"
              className="p-6 rounded-3xl h-full flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={item.highlight ? "accent" : "default"}>
                    {item.badge}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                    <Clock size={12} weight="regular" />
                    <span>{item.sessions}</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text)]">
                    {item.grade}
                  </h3>
                  <span className="text-xs font-mono text-[var(--brand)]">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {item.focus}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <Link href="/signup">
                  <Button
                    variant={item.highlight ? "primary" : "ghost"}
                    size="sm"
                    className="w-full text-xs justify-between"
                  >
                    <span>Enrol in stream</span>
                    <ArrowRight size={14} weight="bold" />
                  </Button>
                </Link>
              </div>
            </Glass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
