"use client";

import * as React from "react";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  IdentificationCard,
  PencilSimpleLine,
  ChartLineUp,
} from "@phosphor-icons/react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <IdentificationCard size={24} weight="regular" className="text-[var(--brand)]" />,
      title: "Register & receive student ID",
      description:
        "Sign up with your grade (6–13) and class stream. A permanent atomic ID (e.g. MCG10TP1001) is minted with your chosen 6-digit PIN.",
      badge: "Fast & secure",
    },
    {
      step: "02",
      icon: <PencilSimpleLine size={24} weight="regular" className="text-[var(--text)]" />,
      title: "Master theory & sit timed papers",
      description:
        "Attend regular lecture sessions in Kurunegala, master rigorous mathematical derivations, and sit standardized model papers under exam conditions.",
      badge: "Classroom sittings",
    },
    {
      step: "03",
      icon: <ChartLineUp size={24} weight="regular" className="text-emerald-400" />,
      title: "Diagnose weaknesses & propel marks",
      description:
        "Diagnostic feedback highlights your weakest 3 topics, slope improvement, and class standing. Parents receive progress reports directly on WhatsApp.",
      badge: "Instant telemetry",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="accent" dot>
            Three-Step Progression
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How it works
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            A clear, disciplined path from enrolment to mathematical mastery.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item, idx) => (
          <Reveal key={idx} delay={idx * 0.12} direction="up">
            <Glass
              tint="subtle"
              className="p-8 rounded-3xl h-full flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-[var(--muted)]/40 [font-feature-settings:'tnum'_1]">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <span className="text-xs font-mono text-[var(--brand)]">
                  {item.badge}
                </span>
              </div>
            </Glass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
