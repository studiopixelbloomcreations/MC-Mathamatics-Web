"use client";

import * as React from "react";
import Image from "next/image";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import {
  Medal,
  BookOpen,
  MapPin,
  CheckCircle,
  GraduationCap,
  Sparkle,
} from "@phosphor-icons/react";

export function MeetSir() {
  return (
    <section id="meet-sir" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Photo Card Column */}
        <div className="lg:col-span-5">
          <Reveal direction="right">
            <Glass
              tint="subtle"
              interactive={false}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden flex flex-col justify-end p-6 sm:p-8 group shadow-2xl"
            >
              {/* High-resolution Official Studio Portrait */}
              <div className="absolute inset-0">
                <Image
                  src="/images/sir-malinga.jpg"
                  alt="Malinga C Dissanayake - Master Mathematics Educator"
                  fill
                  className="object-cover object-top filter brightness-[0.92] contrast-[1.04] transition duration-700 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/40 to-transparent" />
              </div>

              {/* Floating Bottom Card Over Portrait */}
              <Glass
                tint="subtle"
                className="relative z-20 space-y-2 rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="accent" dot>
                    Active Educator
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <MapPin size={14} weight="regular" className="text-[var(--brand)]" />
                    <span>Kurunegala, Sri Lanka</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Malinga C Dissanayake
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Specialist in O/L Mathematics &amp; A/L Combined Mathematics.
                </p>
              </Glass>
            </Glass>
          </Reveal>
        </div>

        {/* Story & Achievements Column */}
        <div className="lg:col-span-7 space-y-8">
          <Reveal direction="left">
            <div className="space-y-4">
              <Badge variant="brand" dot>
                Pedagogical Leadership
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Empowering minds.{" "}
                <span className="font-editorial italic font-normal text-[var(--brand)]">
                  Demystifying mathematics.
                </span>
              </h2>
              <p className="text-base text-[var(--muted)] leading-relaxed">
                With over a decade of dedicated classroom teaching in Kurunegala,
                Sir Malinga C Dissanayake has transformed how Sri Lankan students approach
                mathematics. Rather than rote memorization, his methodology focuses on
                first-principles derivations, analytical paper analysis, and systematic error correction.
              </p>
            </div>
          </Reveal>

          {/* Key Strengths & Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Reveal delay={0.1} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} weight="regular" className="text-emerald-400" />
                  <span className="text-sm font-semibold text-[var(--text)]">Structured paper sittings</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Timed model examinations mimicking actual exam pressure with instant marking.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                <div className="flex items-center gap-2">
                  <Medal size={18} weight="regular" className="text-[var(--brand)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">Island top-rankers</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Consistently mentoring students achieving district ranks and 9A distinctions.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} weight="regular" className="text-[var(--brand)]" />
                  <span className="text-sm font-semibold text-[var(--text)]">Dual curriculum mastery</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Tailored pathways for Grade 6–11 O/L core and Grade 12–13 Combined Mathematics.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4} direction="up">
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} weight="regular" className="text-emerald-400" />
                  <span className="text-sm font-semibold text-[var(--text)]">Personal diagnostic notes</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Sir reviews weak areas individually, providing handwritten corrections and advice.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
