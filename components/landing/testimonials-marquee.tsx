"use client";

import * as React from "react";
import { Glass } from "@/components/ui/glass";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Quotes } from "@phosphor-icons/react";

export function TestimonialsMarquee() {
  const reviews = [
    {
      name: "Kasun Jayawardena",
      role: "Grade 11 Student (O/L 2025)",
      school: "Maliyadeva College, Kurunegala",
      text: "Before joining Sir Malinga's class, I scored 48 in my term tests. His section-wise diagnostic paper feedback showed me my trigonometry errors. In the final exam I scored 94 (A grade).",
    },
    {
      name: "Mrs. Nilanthi Perera",
      role: "Parent of Grade 10 Student",
      school: "Holy Family Convent, Kurunegala",
      text: "The free WhatsApp reports are a blessing. After every paper sitting, I receive a message on my phone with Kamal's mark, rank band, and areas to work on without paying any extra fee.",
    },
    {
      name: "Dineth Wickramasinghe",
      role: "Grade 13 A/L Combined Maths",
      school: "St. Anne's College, Kurunegala",
      text: "Combined Maths was intimidating until Sir explained vectors and calculus from pure logic. The timed paper class with anonymous topper scores motivated me to push into the top 5%.",
    },
    {
      name: "Sithmi Fernando",
      role: "Grade 11 Student",
      school: "Maliyadeva Balika Vidyalaya",
      text: "The online dashboard with the unique ID and PIN means I can practice and review past papers at any time. Sir's personal notes on my dashboard kept me focused.",
    },
  ];

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
