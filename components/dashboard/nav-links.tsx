"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarCheck2,
  FileSpreadsheet,
  Bell,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

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
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      href: "/dashboard/papers",
      label: "Paper Results",
      icon: FileText,
      badge: null,
      exact: false,
    },
    {
      href: "/dashboard/analysis",
      label: "Smart Analysis",
      icon: BarChart3,
      badge: "AI",
      badgeVariant: "accent",
      exact: false,
    },
    {
      href: "/dashboard/attendance",
      label: "Attendance",
      icon: CalendarCheck2,
      badge: null,
      exact: false,
    },
    {
      href: "/dashboard/special-notes",
      label: "Special Notes",
      icon: FileSpreadsheet,
      badge: unreadNotesCount > 0 ? `${unreadNotesCount} new` : null,
      badgeVariant: "accent",
      exact: false,
    },
    {
      href: "/dashboard/announcements",
      label: "Announcements",
      icon: Bell,
      badge: announcementsCount > 0 ? announcementsCount : null,
      badgeVariant: "default",
      exact: false,
    },
    {
      href: "/dashboard/parental-controls",
      label: "Parental Controls",
      icon: ShieldAlert,
      badge: null,
      exact: false,
    },
  ];

  return (
    <div className="space-y-1">
      {links.map((link) => {
        // Strip locale prefix if present (e.g., /en/dashboard -> /dashboard)
        const normalizedPath = pathname.replace(/^\/(en|si)/, "") || "/";
        const isActive = link.exact
          ? normalizedPath === link.href
          : normalizedPath.startsWith(link.href);

        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-sm shadow-amber-500/10"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? "text-amber-400" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span>{link.label}</span>
            </div>

            {link.badge && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  link.badgeVariant === "accent"
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {link.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
