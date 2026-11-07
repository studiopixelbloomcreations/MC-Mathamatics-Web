"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCounter } from "@/components/ui/stat-counter";
import { Reveal } from "@/components/ui/reveal";
import { Award, Users, TrendingUp, MessageCircle } from "lucide-react";

export function TrustStrip() {
  const stats = [
    {
      icon: <Users className="h-5 w-5 text-[var(--brand)]" />,
      value: 1200,
      suffix: "+",
      label: "Students Taught",
      description: "Across Kurunegala district",
    },
    {
      icon: <Award className="h-5 w-5 text-[var(--accent)]" />,
      value: 12,
      suffix: "+",
      label: "Years of Mastery",
      description: "Pure & Applied Mathematics",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-[var(--good)]" />,
      value: 23.8,
      prefix: "+",
      suffix: "%",
      decimals: 1,
      label: "Average Score Gain",
      description: "Within first 5 paper sessions",
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-[var(--accent)]" />,
      value: 0,
      prefix: "$",
      label: "Zero Message Cost",
      description: "Free-first WhatsApp parent bot",
    },
  ];

  return (
    <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
      <Reveal direction="up">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs uppercase tracking-widest font-mono text-[var(--accent)]">
            Recognized Excellence
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Top Mathematics Specialist in Kurunegala
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Reveal key={idx} delay={idx * 0.1} direction="up">
            <GlassCard variant="bento" spotlight className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)]">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-mono uppercase text-[var(--muted)]">
                  Verified Metric
                </span>
              </div>
              <div className="pt-6">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text)] tracking-tight">
                  <StatCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <div className="text-sm font-semibold text-[var(--text)] pt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {stat.description}
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
