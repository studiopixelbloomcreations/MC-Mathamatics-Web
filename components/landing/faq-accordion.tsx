"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <section id="faq" className="py-[clamp(64px,8vw,128px)] px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <Reveal direction="down">
          <Badge variant="accent" dot>
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

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Reveal key={idx} delay={idx * 0.05} direction="up">
              <Glass
                tint="subtle"
                interactive={false}
                className="rounded-2xl transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="font-semibold text-base sm:text-lg text-[var(--text)]">
                    {faq.q}
                  </span>
                  <div
                    className={cn(
                      "p-1.5 rounded-full bg-[var(--surface-elevated)] text-[var(--muted)] transition-transform duration-300",
                      isOpen && "rotate-180 text-[var(--brand)]"
                    )}
                  >
                    <CaretDown size={18} weight="bold" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)] mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Glass>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
