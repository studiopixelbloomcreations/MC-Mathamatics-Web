"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Glass } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import {
  ArrowRight,
  Sparkle,
  WhatsappLogo,
  MapPin,
  PhoneCall,
  ShieldCheck,
} from "@phosphor-icons/react";

export function CTAFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--surface)] pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Final CTA Band */}
        <Reveal direction="up">
          <Glass
            tint="subtle"
            className="p-8 sm:p-14 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="text-xs uppercase font-mono tracking-widest text-[var(--brand)] font-semibold">
                Begin Your Journey Today
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)]">
                Maths is the question.{" "}
                <span className="font-editorial italic font-normal text-[var(--brand)]">
                  MC is the answer.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Join hundreds of Kurunegala students mastering pure mathematical
                logic. Generate your atomic Student ID and start tracking your progress now.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" variant="primary" magnetic className="gap-2">
                    <span>Join the class</span>
                    <Sparkle size={18} weight="fill" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <span>Student portal login</span>
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                </Link>
              </div>
            </div>
          </Glass>
        </Reveal>

        {/* Footer Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs text-[var(--muted)]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[var(--brand)]/40 shadow-sm shrink-0">
                <Image
                  src="/images/mc-logo.jpg"
                  alt="MC Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-base font-bold text-[var(--text)] tracking-tight">
                MC Mathematics
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] max-w-sm leading-relaxed">
              Premium e-learning and performance diagnostics platform for maths teacher
              Malinga C Dissanayake. Delivering zero-hallucination analysis and free-first
              WhatsApp progress reports.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <ShieldCheck size={16} weight="regular" />
              <span>Sri Lanka PDPA (No. 9 of 2022) Privacy Adherent</span>
            </div>
          </div>

          {/* Academic Programs */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[var(--text)]">Curricula</h4>
            <ul className="space-y-2">
              <li>Grades 6–8 (Foundation)</li>
              <li>Grade 9 (Pre-O/L Track)</li>
              <li>Grade 10 (O/L Theory + Paper)</li>
              <li>Grade 11 (O/L Target Revision)</li>
              <li>Grade 12–13 (A/L Combined Maths)</li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[var(--text)]">Surfaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-[var(--text)] transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[var(--text)] transition-colors">
                  Join Class (Atomic ID)
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-[var(--text)] transition-colors">
                  Design System (2026)
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--text)] transition-colors">
                  Feature Bento
                </a>
              </li>
              <li>
                <a href="#analysis" className="hover:text-[var(--text)] transition-colors">
                  Smart Diagnostic Preview
                </a>
              </li>
            </ul>
          </div>

          {/* Physical Center & Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-[var(--text)]">Class Locations</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin size={16} weight="regular" className="text-[var(--brand)] shrink-0 mt-0.5" />
                <span>Kurunegala Town Centers, North Western Province, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <WhatsappLogo size={16} weight="fill" className="text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors"
                >
                  +94 77 123 4567 (Inquiries)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall size={16} weight="regular" className="text-[var(--brand)] shrink-0" />
                <span>+94 37 222 3456 (Office)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--muted)]">
          <p>© {new Date().getFullYear()} MC Mathematics — Malinga C Dissanayake. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/design-system" className="hover:text-[var(--text)]">
              Tokens &amp; Components
            </Link>
            <span>·</span>
            <a
              href="https://admin.mcmaths.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand)] hover:underline"
            >
              Admin Cockpit ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
