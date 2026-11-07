"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { ChevronDown } from "lucide-react";
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
            Clear Answers to Every Question
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
            <Reveal key={idx} delay={idx * 0.06} direction="up">
              <GlassCard
                variant="bento"
                className="p-6 transition-all duration-200 cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text)]">
                    {faq.q}
                  </h3>
                  <div
                    className={cn(
                      "p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-glass)] text-[var(--muted)] transition-transform duration-200",
                      isOpen && "rotate-180 text-[var(--accent)]"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                {isOpen && (
                  <p className="pt-4 text-xs sm:text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)] mt-4 animate-in fade-in-50">
                    {faq.a}
                  </p>
                )}
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
