"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MathFormula } from "@/components/ui/math-formula";
import { ArrowRight, Sparkle, CaretDown } from "@phosphor-icons/react";

export function HeroSequence() {
  const t = useTranslations("Hero");
  const common = useTranslations("Common");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop scroll progress (target container)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth transforms across the scroll range [0, 0.9]
  const questionOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const answerOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);
  const answerY = useTransform(scrollYProgress, [0.35, 0.75], [20, 0]);

  const questionMarkScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.6]);
  const questionMarkOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const mcScale = useTransform(scrollYProgress, [0.35, 0.75], [0.75, 1]);
  const mcOpacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);

  const ctaOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.55, 0.85], [16, 0]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const floatingFormulas = [
    { formula: "\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}", top: "15%", left: "8%" },
    { formula: "e^{i\\pi} + 1 = 0", top: "22%", right: "10%" },
    { formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", top: "68%", left: "12%" },
    { formula: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}", top: "72%", right: "8%" },
    { formula: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1", top: "45%", left: "4%" },
    { formula: "\\nabla \\times \\vec{B} = \\mu_0 \\vec{J}", top: "40%", right: "5%" },
  ];

  // Mobile / Reduced-Motion layout: Single clean view without pinning traps
  if (isMobile || shouldReduceMotion) {
    return (
      <div className="relative w-full min-h-[90svh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-[var(--bg)] overflow-hidden">
        {/* Math Grid Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(var(--text) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="accent" dot>
            Malinga C Dissanayake · Kurunegala
          </Badge>

          {/* MC Emblem */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border border-[var(--brand)]/40 p-1 bg-[#0c0d10] shadow-[0_0_35px_rgba(250,204,21,0.25)]">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image
                src="/images/mc-logo.jpg"
                alt="MC Mathematics Monogram"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Slogan */}
          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--muted)]">
              {t("q1")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-[var(--brand)] font-editorial italic">
              {t("a1")}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="gap-2">
                <span>{t("joinClass")}</span>
                <Sparkle size={18} weight="fill" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="gap-2">
                <span>{t("studentLogin")}</span>
                <ArrowRight size={18} weight="bold" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Desktop pinned sequence (tight 140vh scroll space with zero dead gap)
  return (
    <div
      ref={containerRef}
      className="relative h-[140vh] w-full bg-[var(--bg)]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center px-6">
        {/* Math Grid Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
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
              animate={{ opacity: 0.16, y: [0, -10, 0] }}
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
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="accent" dot>
              Malinga C Dissanayake · Kurunegala
            </Badge>
          </motion.div>

          {/* Morphing Symbol: ? into Official MC Emblem */}
          <div className="relative h-32 w-32 sm:h-36 sm:w-36 flex items-center justify-center my-1">
            {/* Pulsing ? Symbol */}
            <motion.div
              style={{ opacity: questionMarkOpacity, scale: questionMarkScale }}
              className="absolute inset-0 flex items-center justify-center font-editorial italic text-7xl sm:text-8xl font-normal text-[var(--brand)] drop-shadow-[0_0_35px_rgba(250,204,21,0.4)] select-none animate-pulse"
            >
              ?
            </motion.div>

            {/* Official MC Emblem */}
            <motion.div
              style={{ opacity: mcOpacity, scale: mcScale }}
              className="absolute inset-0 flex items-center justify-center rounded-full border border-[var(--brand)]/40 p-1 bg-[#0c0d10] shadow-[0_0_50px_rgba(250,204,21,0.25)]"
            >
              <div className="relative h-full w-full rounded-full overflow-hidden">
                <Image
                  src="/images/mc-logo.jpg"
                  alt="MC Mathematics Monogram"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Slogan Text Transformation */}
          <div className="relative min-h-[120px] sm:min-h-[140px] flex items-center justify-center">
            {/* Step 1: "Maths is the question." */}
            <motion.h1
              style={{ opacity: questionOpacity }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-[var(--text)]"
            >
              {t("q1")}
            </motion.h1>

            {/* Step 2: "MC is the answer." with Instrument Serif */}
            <motion.h1
              style={{ opacity: answerOpacity, y: answerY }}
              className="absolute text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.1] text-[var(--brand)] font-editorial italic"
            >
              {t("a1")}
            </motion.h1>
          </div>

          {/* Subtext description */}
          <p className="text-sm sm:text-base md:text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link href="/signup">
              <Button size="lg" variant="primary" magnetic className="gap-2">
                <span>{t("joinClass")}</span>
                <Sparkle size={18} weight="fill" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="gap-2">
                <span>{t("studentLogin")}</span>
                <ArrowRight size={18} weight="bold" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator Prompt (fades out immediately when scroll starts) */}
        <motion.div
          style={{ opacity: promptOpacity }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 flex flex-col items-center gap-1.5 text-xs text-[var(--muted)] select-none pointer-events-none"
        >
          <span>{t("scrollPrompt")}</span>
          <CaretDown size={14} weight="bold" className="text-[var(--brand)]" />
        </motion.div>
      </div>
    </div>
  );
}
