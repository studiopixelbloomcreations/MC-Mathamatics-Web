"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  House,
  FileArrowUp,
  GraduationCap,
  CalendarCheck,
  Bell,
  FileText,
  Users,
  ShieldCheck,
  Robot,
  PaperPlaneTilt,
  TerminalWindow,
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function AdminNav({ aiMode }: { aiMode: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: House, exact: true },
    { href: "/admin/papers", label: "Paper Upload", icon: FileArrowUp },
    { href: "/admin/marks", label: "Mark Entry", icon: GraduationCap },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
    { href: "/admin/notes", label: "Special Notes", icon: FileText },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/logs", label: "Login Audit", icon: ShieldCheck },
    {
      href: "/admin/ai-mode",
      label: "AI Mode Cockpit",
      icon: Robot,
      badge: aiMode ? "Active" : "Off",
      badgeClass: aiMode
        ? "bg-[var(--brand)]/20 text-[var(--brand)] border-[var(--brand)]/40"
        : "bg-white/5 text-[var(--muted)]",
    },
    { href: "/admin/reports", label: "Parent Reports", icon: PaperPlaneTilt },
    {
      href: "/admin/ai-simulator",
      label: "AI Simulator",
      icon: TerminalWindow,
      badge: "Dev",
      badgeClass: "bg-white/10 text-zinc-300 border-white/10",
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[#0a0b0e] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Brand */}
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[var(--brand)]/40 shrink-0">
            <Image
              src="/images/mc-logo.jpg"
              alt="MC Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-[var(--text)] text-sm tracking-tight">MC Mathematics</h1>
            <p className="text-[10px] text-[var(--brand)] font-mono font-semibold uppercase tracking-wider">
              Admin Cockpit
            </p>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} weight="regular" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full border font-mono uppercase tracking-wider",
                      link.badgeClass
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Logout link */}
      <div className="p-4 border-t border-[var(--border)]">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--bad)] rounded-xl transition-colors hover:bg-[var(--surface-elevated)]"
        >
          <SignOut size={16} weight="regular" />
          <span>Exit Admin Session</span>
        </Link>
      </div>
    </aside>
  );
}
