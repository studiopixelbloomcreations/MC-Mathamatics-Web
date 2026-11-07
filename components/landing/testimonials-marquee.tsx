"use client";

import * as React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Star, Quote } from "lucide-react";

export function TestimonialsMarquee() {
  // TODO: Sir Malinga can replace these placeholder testimonials with real student and parent reviews from Kurunegala
  const reviews = [
    {
      name: "Kasun Jayawardena",
      role: "Grade 11 Student (O/L 2025)",
      school: "Maliyadeva College, Kurunegala",
      text: "Before joining Sir Malinga's class, I scored 48 in my term tests. His section-wise diagnostic paper feedback showed me my trigonometry errors. In the final exam I scored 94 (A grade).",
      rating: 5,
    },
    {
      name: "Mrs. Nilanthi Perera",
      role: "Parent of Grade 10 Student",
      school: "Holy Family Convent, Kurunegala",
      text: "The free WhatsApp reports are a blessing. After every paper sitting, I receive a message on my phone with Kamal's mark, rank band, and areas to work on without paying any extra fee.",
      rating: 5,
    },
    {
      name: "Dineth Wickramasinghe",
      role: "Grade 13 A/L Combined Maths",
      school: "St. Anne's College, Kurunegala",
      text: "Combined Maths was intimidating until Sir explained vectors and calculus from pure logic. The timed paper class with anonymous topper scores motivated me to push into the top 5%.",
      rating: 5,
    },
    {
      name: "Sithmi Fernando",
      role: "Grade 11 Student",
      school: "Maliyadeva Balika Vidyalaya",
      text: "The online dashboard with the unique ID and PIN means I can practice and review past papers at any time. Sir's personal notes on my dashboard kept me focused.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Reveal direction="down">
          <Badge variant="brand" dot>
            Student &amp; Parent Voices
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Proven Results in Kurunegala
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm sm:text-base text-[var(--muted)]">
            {/* TODO: Sir can adjust this intro */}
            Real stories from parents and students who turned mathematical fear
            into their strongest academic asset.
          </p>
        </Reveal>
      </div>

      {/* Marquee Carousel Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
          {[...reviews, ...reviews].map((review, idx) => (
            <GlassCard
              key={idx}
              variant="bento"
              spotlight
              className="w-[340px] sm:w-[400px] p-6 justify-between flex-shrink-0"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-[var(--accent)] gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-[var(--muted)]/40" />
                </div>
                <p className="text-xs sm:text-sm text-[var(--text)] italic leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] mt-4">
                <div className="font-bold text-sm text-[var(--text)]">
                  {review.name}
                </div>
                <div className="text-[11px] font-mono text-[var(--brand)]">
                  {review.role}
                </div>
                <div className="text-[10px] text-[var(--muted)]">
                  {review.school}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
