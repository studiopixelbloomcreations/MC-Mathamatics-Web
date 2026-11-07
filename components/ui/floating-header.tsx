"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Glass } from "@/components/ui/glass";
import {
  Sun,
  Moon,
  Globe,
  Sliders,
  SignIn,
  GraduationCap,
  Sparkle,
} from "@phosphor-icons/react";

interface FloatingHeaderProps {
  currentLocale?: string;
  isLoggedIn?: boolean;
}

export function FloatingHeader({
  currentLocale = "en",
  isLoggedIn = false,
}: FloatingHeaderProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [glassTint, setGlassTint] = useState(70); // 0 = clear, 100 = full tint
  const [showSettings, setShowSettings] = useState(false);
  const headerRef = React.useRef<HTMLElement>(null);

  // Measure rendered header height and expose as CSS variable --header-h
  useEffect(() => {
    if (!headerRef.current) return;
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height;
        // Total offset including top spacing (16px)
        const totalHeight = Math.round(h + 24);
        document.documentElement.style.setProperty("--header-h", `${totalHeight}px`);
      }
    };

    updateHeaderHeight();
    const ro = new ResizeObserver(updateHeaderHeight);
    ro.observe(headerRef.current);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);
  }, []);

  // Scroll dynamics: compacts, hides on scroll down, reappears on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY;
    if (latest > 60) {
      setCompact(true);
    } else {
      setCompact(false);
    }

    if (latest > 180 && diff > 8) {
      setHidden(true);
    } else if (diff < -6) {
      setHidden(false);
    }
    setLastScrollY(latest);
  });

  const toggleTheme = (e: React.MouseEvent) => {
    const nextDark = !isDark;

    // View Transitions circular reveal if supported
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (typeof doc.startViewTransition === "function") {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        setIsDark(nextDark);
        if (nextDark) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      setIsDark(nextDark);
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  const handleTintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setGlassTint(val);
    document.documentElement.style.setProperty(
      "--glass-tint",
      isDark
        ? `rgba(24, 25, 31, ${0.4 + (val / 100) * 0.5})`
        : `rgba(255, 255, 255, ${0.45 + (val / 100) * 0.45})`
    );
  };

  const toggleLocale = () => {
    const nextLocale = currentLocale === "en" ? "si" : "en";
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "si") {
      segments[1] = nextLocale;
      window.location.href = segments.join("/");
    } else {
      window.location.href = `/${nextLocale}${pathname}`;
    }
  };

  return (
    <motion.header
      ref={headerRef}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -90, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <Glass
        variant="capsule"
        className={`pointer-events-auto flex items-center justify-between transition-all duration-300 ${
          compact
            ? "py-2 px-4 max-w-2xl gap-3 shadow-2xl"
            : "py-2.5 px-5 max-w-4xl gap-6 shadow-xl"
        }`}
      >
        {/* 1. Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/mc-logo.jpg"
              alt="MC Mathematics Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
              MC Mathematics
            </span>
            {!compact && (
              <span className="text-[10px] text-[var(--text-tertiary)] font-editorial tracking-normal">
                Maths is the question. MC is the answer.
              </span>
            )}
          </div>
        </Link>

        {/* 2. Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
          <Link
            href="/#about"
            className="px-3 py-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Teacher
          </Link>
          <Link
            href="/#features"
            className="px-3 py-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Method
          </Link>
          <Link
            href="/#grades"
            className="px-3 py-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Curriculum
          </Link>
          <Link
            href="/#faq"
            className="px-3 py-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            FAQ
          </Link>
        </nav>

        {/* 3. Controls & Action Pill */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Glass Tint Slider Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              title="Glass transparency settings"
              aria-label="Liquid Glass Settings"
            >
              <Sliders size={18} weight="regular" />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 w-48 p-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border-light)] shadow-2xl z-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-secondary)]">
                    <span>Liquid Glass Tint</span>
                    <span className="font-mono text-[var(--accent)]">{glassTint}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={95}
                    value={glassTint}
                    onChange={handleTintChange}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-black/10 dark:bg-white/10"
                  />
                  <p className="text-[10px] text-[var(--text-tertiary)]">
                    Adjusts surface refraction and opacity.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            title="Switch Language (English / Sinhala)"
          >
            <Globe size={16} weight="regular" />
            <span className="uppercase text-[10px] tracking-wider">
              {currentLocale === "en" ? "සිං" : "EN"}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            title={isDark ? "Switch to daylight mode" : "Switch to obsidian mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={18} weight="regular" className="text-amber-400" />
            ) : (
              <Moon size={18} weight="regular" className="text-amber-600" />
            )}
          </button>

          {/* Portal Action */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)] text-black hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <GraduationCap size={16} weight="bold" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <SignIn size={16} weight="bold" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </Glass>
    </motion.header>
  );
}
