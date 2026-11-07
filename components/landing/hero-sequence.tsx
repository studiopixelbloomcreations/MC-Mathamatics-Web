"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MathFormula } from "@/components/ui/math-formula";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSequence() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll animation hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Morphing transforms (? -> MC Monogram, and Question -> Answer reveal)
  const questionOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const answerOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);
  const answerY = useTransform(scrollYProgress, [0.35, 0.75], [40, 0]);

  // Morph symbol (? fades/scales out, MC fades/scales in)
  const questionMarkScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.4]);
  const questionMarkOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const mcScale = useTransform(scrollYProgress, [0.4, 0.8], [0.6, 1]);
  const mcOpacity = useTransform(scrollYProgress, [0.4, 0.75], [0, 1]);

  const ctaOpacity = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.65, 0.95], [30, 0]);

  const floatingFormulas = [
    { formula: "\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}", top: "15%", left: "8%" },
    { formula: "e^{i\\pi} + 1 = 0", top: "22%", right: "10%" },
    { formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", top: "68%", left: "12%" },
    { formula: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}", top: "72%", right: "8%" },
    { formula: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1", top: "45%", left: "4%" },
    { formula: "\\nabla \\times \\vec{B} = \\mu_0 \\vec{J}", top: "40%", right: "5%" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-[220vh] w-full bg-[var(--bg)]"
    >
      {/* Sticky Hero Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6">
        {/* Subtle Aurora Ambient Mesh (GPU cheap CSS) */}
        <div className="pointer-events-none absolute inset-0 -z-20 opacity-30 dark:opacity-20">
          <div className="absolute -top-[30%] left-[20%] h-[600px] w-[600px] rounded-full bg-[var(--brand)] blur-[140px]" />
          <div className="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-[var(--accent)] blur-[160px]" />
        </div>

        {/* Math Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(var(--text) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating KaTeX Formulas */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden sm:block">
          {floatingFormulas.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 1 },
                y: { duration: 6 + idx, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute text-xs md:text-sm font-mono text-[var(--muted)]"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
              }}
            >
              <MathFormula formula={item.formula} />
            </motion.div>
          ))}
        </div>

        {/* Central Kinetic Sequence */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="accent" dot>
              Malinga C Dissanayake · Kurunegala
            </Badge>
          </motion.div>

          {/* Morphing Symbol: ? into MC Monogram */}
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 flex items-center justify-center my-2">
            {/* Pulsing ? Symbol */}
            <motion.div
              style={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: questionMarkOpacity, scale: questionMarkScale }
              }
              className="absolute inset-0 flex items-center justify-center font-serif text-7xl sm:text-8xl font-black text-[var(--brand)] drop-shadow-[0_0_35px_rgba(108,92,231,0.6)] select-none animate-pulse"
            >
              ?
            </motion.div>

            {/* Glowing MC Monogram */}
            <motion.div
              style={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: mcOpacity, scale: mcScale }
              }
              className="absolute inset-0 flex items-center justify-center rounded-3xl border border-[var(--accent)]/40 bg-[var(--surface-glass)] shadow-[0_0_50px_rgba(255,200,87,0.35)] backdrop-blur-xl"
            >
              <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[var(--accent)]">
                MC
              </span>
            </motion.div>
          </div>

          {/* Slogan Text Transformation */}
          <div className="relative min-h-[140px] sm:min-h-[160px] flex items-center justify-center">
            {/* Step 1: "Maths is the question." */}
            <motion.h1
              style={shouldReduceMotion ? { opacity: 1 } : { opacity: questionOpacity }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-[var(--text)]"
            >
              Maths is the <span className="text-[var(--brand)]">question.</span>
            </motion.h1>

            {/* Step 2: "MC is the answer." */}
            <motion.h1
              style={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: answerOpacity, y: answerY }
              }
              className="absolute text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-[var(--text)]"
            >
              <span className="text-[var(--accent)] font-serif italic">
                MC is the answer.
              </span>
            </motion.h1>
          </div>

          {/* Subtext description */}
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] max-w-xl mx-auto">
            Kurunegala&apos;s premier mathematics academy. Transforming O/L and A/L
            mathematics into measurable excellence with instant diagnostic feedback.
          </p>

          {/* CTAs */}
          <motion.div
            style={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: ctaOpacity, y: ctaY }
            }
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link href="/signup">
              <Button size="lg" variant="accent" magnetic>
                Join the class
                <Sparkles className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" magnetic>
                Student login
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator Prompt */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 flex flex-col items-center gap-1.5 text-xs text-[var(--muted)] select-none pointer-events-none"
        >
          <span>Scroll to uncover the answer</span>
          <ChevronDown className="h-4 w-4 text-[var(--accent)]" />
        </motion.div>
      </div>
    </div>
  );
}
