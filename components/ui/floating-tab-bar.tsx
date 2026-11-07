"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Glass } from "@/components/ui/glass";
import {
  House,
  Exam,
  ChartLineUp,
  CalendarCheck,
  ChatTeardropText,
  ShieldCheck,
} from "@phosphor-icons/react";

interface FloatingTabBarProps {
  unreadNotesCount?: number;
}

export function FloatingTabBar({ unreadNotesCount = 0 }: FloatingTabBarProps) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: "Home", icon: House, exact: true },
    { href: "/dashboard/papers", label: "Papers", icon: Exam },
    { href: "/dashboard/analysis", label: "Analysis", icon: ChartLineUp },
    { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
    {
      href: "/dashboard/special-notes",
      label: "Notes",
      icon: ChatTeardropText,
      badge: unreadNotesCount > 0,
    },
    { href: "/dashboard/parental-controls", label: "Parent", icon: ShieldCheck },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <Glass
        variant="capsule"
        className="pointer-events-auto p-1.5 flex items-center gap-1 shadow-2xl border border-[var(--glass-border-light)]"
      >
        {tabs.map((tab) => {
          const normalizedPath = pathname.replace(/^\/(en|si)/, "") || "/";
          const isActive = tab.exact
            ? normalizedPath === tab.href
            : normalizedPath.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative px-3 py-2 flex flex-col items-center gap-0.5 rounded-full text-center transition-all duration-200 select-none"
            >
              {/* Sliding Glass Selection Pill */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] -z-10 shadow-sm"
                />
              )}

              <motion.div
                animate={isActive ? { scale: 1.12, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative"
              >
                <Icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  className={
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--surface)]" />
                )}
              </motion.div>

              <span
                className={`text-[9px] font-medium tracking-tight ${
                  isActive
                    ? "font-bold text-[var(--accent)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </Glass>
    </div>
  );
}
