"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { KeyRound, PenTool, LineChart, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <KeyRound className="h-6 w-6 text-[var(--accent)]" />,
      title: "Register & Receive Atomic ID",
      description:
        "Sign up with your grade (6–13) and class stream (Theory or Theory + Paper). An atomic ID (e.g. MCG10TP1001) is minted with your chosen 6-digit PIN and saved to your browser keychain.",
      badge: "Fast & Secure",
    },
    {
      step: "02",
      icon: <PenTool className="h-6 w-6 text-[var(--brand)]" />,
      title: "Master Theory & Sit Timed Papers",
      description:
        "Attend regular lecture sessions in Kurunegala, master rigorous mathematical derivations, and sit standardized model papers under authentic examination conditions.",
      badge: "Real-world Practice",
    },
    {
      step: "03",
      icon: <LineChart className="h-6 w-6 text-[var(--good)]" />,
      title: "Pinpoint Weaknesses & Propel Marks",
      description:
        "Immediate diagnostic feedback highlights your weakest 3 topics, slope improvement, and class standing. Parents receive instant progress reports straight on WhatsApp for free.",
      badge: "Actionable Insights",
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
            How It Works
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            A clear, disciplined path from enrolment to mathematical mastery.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, idx) => (
          <Reveal key={idx} delay={idx * 0.15} direction="up">
            <GlassCard
              variant="bento"
              spotlight
              className="h-full justify-between p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 font-mono text-6xl font-black text-[var(--border)]/60 select-none pointer-events-none">
                {item.step}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
                    {item.icon}
                  </div>
                  <Badge variant="default">{item.badge}</Badge>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 relative z-10 flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Stage Verified</span>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
