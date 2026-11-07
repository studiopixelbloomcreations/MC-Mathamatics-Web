"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Student ID and 6-digit PIN login work?",
      a: "At registration, every student receives an atomic sequential ID (for example, MCG10TP1001 for Grade 10 Theory+Paper student #1001). Paired with a private 6-digit PIN, your browser automatically prompts to save the credentials. This ensures no unauthorized person can guess sequential IDs to read another student's marks or phone numbers.",
    },
    {
      q: "Why are the WhatsApp progress reports 100% free for parents?",
      a: "Meta WhatsApp Cloud API permits businesses to reply free of charge within a 24-hour service window after a user messages first. When a parent registers or taps 'Send me the report' on the dashboard, a pre-filled WhatsApp link (wa.me) opens. When sent, our rule-based parent bot replies immediately with the diagnostic breakdown inside the free window—costing zero message fees.",
    },
    {
      q: "Where are the physical lecture halls located in Kurunegala?",
      a: "Physical classes are conducted in prime academic halls in Kurunegala town with dedicated spaces for regular theory and silent, timed paper sittings. Specific hall allocations and timetables are displayed on the student announcement feed upon enrolment.",
    },
    {
      q: "What is the difference between Theory (T) and Theory + Paper (TP)?",
      a: "Theory only (T) focuses on comprehensive curriculum lectures, textbook proofs, and worked examples. Theory + Paper (TP) adds mandatory weekly timed examination papers under realistic exam conditions, individualized grading with section marks, and longitudinal ranking trends.",
    },
    {
      q: "Can parents restrict when students access the dashboard?",
      a: "Yes. The dashboard includes a dedicated Parental Controls section secured by an independent Parent PIN. Parents can schedule locked hours (e.g., weekdays after 10 PM), toggle marks visibility, and inspect recent login sessions and devices.",
    },
    {
      q: "What happens if a student forgets their 6-digit PIN?",
      a: "Students can request a PIN reset from the login page, which alerts Sir's admin console. Alternatively, parents can text 'PIN <ID>' to the official MC Maths WhatsApp number from their registered phone to receive an instant one-time verification code.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <Reveal direction="down">
          <Badge variant="accent" dot>
            Frequently Answered Questions
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Clear answers to every question
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Everything you need to know about enrolment, security, and WhatsApp reports.
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
