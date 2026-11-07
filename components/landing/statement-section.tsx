"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Glass } from "@/components/ui/glass";
import { ArrowUpRight, CheckCircle, TrendUp } from "@phosphor-icons/react";

export function StatementSection() {
  const containerRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Number counter animation for the score (0 -> 78)
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const target = 78;
    const stepTime = 16;
    const increment = Math.ceil(target / (1200 / stepTime));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setScore(target);
        clearInterval(timer);
      } else {
        setScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      id="method"
      className="relative w-full border-t border-[var(--border)] py-[clamp(64px,8vw,120px)] px-4 sm:px-6 lg:px-8 bg-[var(--bg)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Quiet Headline, Statement, 01/02/03 List */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-mono text-[var(--brand)]">
                The MC Method
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] text-[var(--text)]">
                One teacher. One method. Progress you can measure.
              </h2>
              {/* TODO: Sir Malinga can edit this statement */}
              <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-2xl">
                Mathematics is not a test of memory; it is a discipline of structured thinking.
                Every student receives individual diagnostic attention, weekly exam-standard drills,
                and transparent feedback so improvement becomes inevitable.
              </p>
            </div>

            {/* Three-row numbered list with hairline dividers */}
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)] pt-1">
              {/* Row 01 */}
              <div className="py-5 flex items-baseline gap-6 group">
                <span className="font-mono text-sm sm:text-base text-[var(--brand)] shrink-0 font-medium">
                  01
                </span>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-[var(--text)]">
                    Learn
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    First-principles concept mastery across grades 6 through 13 with structured class notes.
                  </p>
                </div>
              </div>

              {/* Row 02 */}
              <div className="py-5 flex items-baseline gap-6 group">
                <span className="font-mono text-sm sm:text-base text-[var(--brand)] shrink-0 font-medium">
                  02
                </span>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-[var(--text)]">
                    Practice
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    Weekly timed model papers mirroring real national examination standards and strict marking schemes.
                  </p>
                </div>
              </div>

              {/* Row 03 */}
              <div className="py-5 flex items-baseline gap-6 group">
                <span className="font-mono text-sm sm:text-base text-[var(--brand)] shrink-0 font-medium">
                  03
                </span>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-[var(--text)]">
                    Improve
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    Automated performance diagnostics and personalized progress reports sent directly to parents on WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quiet Animated Analysis Preview Card */}
          <div className="lg:col-span-5 w-full">
            <Glass
              tint="subtle"
              className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
                <div>
                  <p className="text-xs uppercase tracking-wider font-mono text-[var(--muted)]">
                    Diagnostic Analysis
                  </p>
                  <p className="text-sm font-medium text-[var(--text)] mt-0.5">
                    Term Assessment · Pure Mathematics
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <TrendUp size={14} weight="bold" />
                  Verified
                </span>
              </div>

              {/* Score Display */}
              <div className="py-6 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-[var(--text)]">
                      {score}
                    </span>
                    <span className="text-xl font-mono text-[var(--muted)]">
                      / 100
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1 font-mono">
                    Class Rank: <span className="text-[var(--text)] font-medium">04 of 48</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs font-mono text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-1 rounded">
                    +18 marks vs batch
                  </span>
                </div>
              </div>

              {/* Quiet Animated SVG Sparkline */}
              <div className="py-4">
                <p className="text-xs font-mono text-[var(--muted)] mb-2">
                  5-week progression trajectory
                </p>
                <div className="h-20 w-full relative">
                  <svg
                    viewBox="0 0 300 80"
                    fill="none"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    {/* Grid hairline lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" className="text-[var(--border)]" strokeDasharray="3 3" strokeWidth="1" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" className="text-[var(--border)]" strokeDasharray="3 3" strokeWidth="1" />
                    
                    {/* Progression Line */}
                    <motion.path
                      d="M 10,65 L 75,52 L 145,46 L 215,28 L 290,14"
                      stroke="var(--brand)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                    />

                    {/* Final Point Indicator */}
                    <motion.circle
                      cx="290"
                      cy="14"
                      r="4"
                      fill="var(--brand)"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 1.4, duration: 0.3 }}
                    />
                  </svg>
                </div>
              </div>

              {/* Direct Topic Tags (Quiet & Minimal) */}
              <div className="pt-4 border-t border-[var(--border)] space-y-2.5">
                <p className="text-xs font-mono text-[var(--muted)]">
                  Diagnostic feedback
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)]">
                    <CheckCircle size={14} className="text-emerald-400" weight="fill" />
                    Calculus: strong
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                    Probability: needs work
                  </span>
                </div>
              </div>
            </Glass>
          </div>

        </div>
      </div>
    </section>
  );
}
