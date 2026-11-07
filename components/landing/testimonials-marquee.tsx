"use client";

import * as React from "react";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Quotes } from "@phosphor-icons/react";

export function TestimonialsMarquee({
  reviews = [],
}: {
  reviews?: Array<{
    name: string;
    role: string;
    school?: string;
    text: string;
  }>;
}) {
  // If there are no real testimonials entered by Sir with consent, do NOT render fake ones.
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-[clamp(64px,8vw,128px)] px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            Student &amp; Parent Voices
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Proven results in Kurunegala
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            Real experiences from parents and students who turned mathematical fear
            into their strongest academic asset.
          </p>
        </Reveal>
      </div>

      {/* Quiet Studio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, idx) => (
          <Reveal key={idx} delay={idx * 0.08} direction="up">
            <Glass
              tint="subtle"
              className="p-8 rounded-3xl h-full flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <Quotes size={28} weight="regular" className="text-[var(--brand)] opacity-60" />
                <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed font-normal">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <div className="font-semibold text-sm text-[var(--text)]">
                  {review.name}
                </div>
                <div className="text-xs text-[var(--brand)] font-medium">
                  {review.role}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {review.school}
                </div>
              </div>
            </Glass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
