"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Exam,
  ChartLineUp,
  CalendarCheck,
  ChatTeardropText,
  Bell,
  ShieldCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  unreadNotesCount: number;
  announcementsCount: number;
}

export function DashboardNavLinks({
  unreadNotesCount,
  announcementsCount,
}: NavLinksProps) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Main Dashboard",
      icon: House,
      badge: null,
      exact: true,
    },
    {
      href: "/dashboard/papers",
      label: "Paper Results",
      icon: Exam,
      badge: null,
      exact: false,
    },
    {
      href: "/dashboard/analysis",
      label: "Smart Analysis",
      icon: ChartLineUp,
      badge: "AI",
      badgeVariant: "accent",
      exact: false,
    },
    {
      href: "/dashboard/attendance",
      label: "Attendance",
      icon: CalendarCheck,
      badge: null,
      exact: false,
    },
    {
      href: "/dashboard/special-notes",
      label: "Special Notes",
      icon: ChatTeardropText,
      badge: unreadNotesCount > 0 ? `${unreadNotesCount} New` : null,
      badgeVariant: "warn",
      exact: false,
    },
    {
      href: "/dashboard/announcements",
      label: "Announcements",
      icon: Bell,
      badge: announcementsCount > 0 ? `${announcementsCount}` : null,
      badgeVariant: "brand",
      exact: false,
    },
    {
      href: "/dashboard/parental-controls",
      label: "Parental Controls",
      icon: ShieldCheck,
      badge: "PIN",
      badgeVariant: "secondary",
      exact: false,
    },
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const normalizedPath = pathname.replace(/^\/(en|si)/, "") || "/";
        const isActive = link.exact
          ? normalizedPath === link.href
          : normalizedPath.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 select-none",
              isActive
                ? "bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 font-semibold"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)]"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} weight="regular" />
              <span>{link.label}</span>
            </div>

            {link.badge && (
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                  link.badgeVariant === "warn" && "bg-amber-500/20 text-amber-300 border-amber-500/40",
                  link.badgeVariant === "accent" && "bg-[var(--brand)]/20 text-[var(--brand)] border-[var(--brand)]/40",
                  link.badgeVariant === "brand" && "bg-white/10 text-[var(--text)] border-white/20",
                  link.badgeVariant === "secondary" && "bg-white/5 text-[var(--muted)] border-white/10"
                )}
              >
                {link.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
