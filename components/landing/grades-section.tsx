"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, Clock } from "@phosphor-icons/react";

export function GradesSection() {
  const t = useTranslations("Grades");
  const grades = [
    {
      grade: t("g6"),
      tag: t("g6Tag"),
      focus: t("g6Focus"),
      sessions: "Weekly 2.5h",
      badge: "T Stream",
    },
    {
      grade: t("g7"),
      tag: t("g7Tag"),
      focus: t("g7Focus"),
      sessions: "Weekly 2.5h",
      badge: "T Stream",
    },
    {
      grade: t("g8"),
      tag: t("g8Tag"),
      focus: t("g8Focus"),
      sessions: "Weekly 3.0h",
      badge: "T Stream",
    },
    {
      grade: t("g9"),
      tag: t("g9Tag"),
      focus: t("g9Focus"),
      sessions: "Weekly 3.0h",
      badge: "T + TP Options",
    },
    {
      grade: t("g10"),
      tag: t("g10Tag"),
      focus: t("g10Focus"),
      sessions: "Weekly 3.5h + Papers",
      badge: "T & TP Streams",
      highlight: true,
    },
    {
      grade: t("g11"),
      tag: t("g11Tag"),
      focus: t("g11Focus"),
      sessions: "Weekly 4.0h + Intensive Papers",
      badge: "T & TP Streams",
      highlight: true,
    },
    {
      grade: t("g12"),
      tag: t("g12Tag"),
      focus: t("g12Focus"),
      sessions: "Weekly 5.0h + Papers",
      badge: "A/L Stream",
    },
    {
      grade: t("g13"),
      tag: t("g13Tag"),
      focus: t("g13Focus"),
      sessions: "Weekly 6.0h + Papers",
      badge: "A/L Stream",
      highlight: true,
    },
  ];

  return (
    <section id="grades" className="py-[clamp(64px,8vw,128px)] px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto space-y-16">
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
