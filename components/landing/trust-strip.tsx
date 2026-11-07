"use client";

import * as React from "react";
import { Glass } from "@/components/ui/glass";
import { StatCounter } from "@/components/ui/stat-counter";
import { Reveal } from "@/components/ui/reveal";
import { Users, Medal, TrendUp, WhatsappLogo } from "@phosphor-icons/react";

export function TrustStrip() {
  const stats = [
    {
      icon: <Users size={20} weight="regular" className="text-[var(--text)]" />,
      value: 1200,
      suffix: "+",
      label: "Students taught",
      description: "Across Kurunegala district",
    },
    {
      icon: <Medal size={20} weight="regular" className="text-[var(--brand)]" />,
      value: 12,
      suffix: "+",
      label: "Years of teaching",
      description: "Pure & applied mathematics",
    },
    {
      icon: <TrendUp size={20} weight="regular" className="text-emerald-400" />,
      value: 23.8,
      prefix: "+",
      suffix: "%",
      decimals: 1,
      label: "Average score gain",
      description: "Within first 5 paper sessions",
    },
    {
      icon: <WhatsappLogo size={20} weight="fill" className="text-emerald-400" />,
      value: 0,
      prefix: "$",
      label: "Zero message fee",
      description: "Free-first WhatsApp parent bot",
    },
  ];

  return (
    <section className="relative z-10 py-[clamp(64px,7vw,112px)] px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
      <Reveal direction="up">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs uppercase tracking-widest font-mono text-[var(--brand)]">
            Recognized Excellence
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Top mathematics specialist in Kurunegala
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Reveal key={idx} delay={idx * 0.08} direction="up">
            <Glass tint="subtle" className="p-6 rounded-3xl h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[var(--muted)] tracking-wider">
                  {stat.label}
                </span>
                <div className="p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] mb-1 [font-feature-settings:'tnum'_1]">
                <StatCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                />
              </div>
              <p className="text-xs text-[var(--muted)]">
                {stat.description}
              </p>
            </Glass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
