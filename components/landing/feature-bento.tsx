"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  ChartLineUp,
  WhatsappLogo,
  FileText,
  CalendarCheck,
  ShieldCheck,
  Sparkle,
  ArrowUpRight,
} from "@phosphor-icons/react";

export function FeatureBento() {
  const t = useTranslations("Features");
  return (
    <section id="features" className="py-[clamp(64px,8vw,128px)] px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            {t("badge")}
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t("heading")}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            {t("subheading")}
          </p>
        </Reveal>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        {/* Card 1: Smart Analysis (Wide 7 cols) */}
        <Reveal direction="up" className="md:col-span-3 lg:col-span-7">
          <Glass
            tint="subtle"
            className="h-full min-h-[320px] rounded-3xl justify-between p-8 flex flex-col"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)]">
                  <ChartLineUp size={24} weight="regular" />
                </div>
                <Badge variant="brand" dot>
                  Diagnostic Analytics
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)]">
                {t("card1Title")}
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-lg leading-relaxed">
                {t("card1Desc")}
              </p>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--brand)] [font-feature-settings:'tnum'_1]">
                Topic Heatmaps
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-emerald-400 [font-feature-settings:'tnum'_1]">
                Topper Comparisons
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] [font-feature-settings:'tnum'_1]">
                Percentile Movement
              </span>
            </div>
          </Glass>
        </Reveal>

        {/* Card 2: Parent WhatsApp Reports (5 cols) */}
        <Reveal direction="up" delay={0.1} className="md:col-span-3 lg:col-span-5">
          <Glass
            tint="subtle"
            className="h-full min-h-[320px] rounded-3xl justify-between p-8 flex flex-col"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <WhatsappLogo size={24} weight="regular" />
                </div>
                <Badge variant="accent" dot>
                  Free-First Architecture
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)]">
                {t("card2Title")}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {t("card2Desc")}
              </p>
            </div>

            <div className="pt-6 flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <Sparkle size={14} weight="regular" />
              <span>Free for all registered parents</span>
            </div>
          </Glass>
        </Reveal>

        {/* Card 3: Instant Marking (4 cols) */}
        <Reveal direction="up" delay={0.2} className="md:col-span-1 lg:col-span-4">
          <Glass
            tint="subtle"
            className="h-full min-h-[260px] rounded-3xl justify-between p-7 flex flex-col"
          >
            <div className="space-y-3">
              <div className="p-3 w-fit rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
                <FileText size={22} weight="regular" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text)]">
                Structured paper classes
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Timed model examination sittings that emulate national exam hall pressures.
              </p>
            </div>
            <div className="pt-4 text-xs font-mono text-[var(--muted)]">
              Grades 6–13
            </div>
          </Glass>
        </Reveal>

        {/* Card 4: Attendance Telemetry (4 cols) */}
        <Reveal direction="up" delay={0.25} className="md:col-span-1 lg:col-span-4">
          <Glass
            tint="subtle"
            className="h-full min-h-[260px] rounded-3xl justify-between p-7 flex flex-col"
          >
            <div className="space-y-3">
              <div className="p-3 w-fit rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
                <CalendarCheck size={22} weight="regular" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text)]">
                Attendance telemetry
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Physical check-ins matched to paper submission records for verified presence.
              </p>
            </div>
            <div className="pt-4 text-xs font-mono text-emerald-400">
              Verified sessions
            </div>
          </Glass>
        </Reveal>

        {/* Card 5: Strict Security (4 cols) */}
        <Reveal direction="up" delay={0.3} className="md:col-span-1 lg:col-span-4">
          <Glass
            tint="subtle"
            className="h-full min-h-[260px] rounded-3xl justify-between p-7 flex flex-col"
          >
            <div className="space-y-3">
              <div className="p-3 w-fit rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)]">
                <ShieldCheck size={22} weight="regular" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text)]">
                Row-level student security
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Supabase RLS policies guarantee students access only their own academic data.
              </p>
            </div>
            <div className="pt-4 text-xs font-mono text-[var(--brand)]">
              Private &amp; isolated
            </div>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}
