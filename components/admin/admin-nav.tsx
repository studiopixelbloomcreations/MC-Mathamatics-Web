"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileUp,
  GraduationCap,
  CalendarCheck,
  Bell,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  Bot,
  Send,
  Terminal,
  LogOut,
} from "lucide-react";

export function AdminNav({ aiMode }: { aiMode: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/papers", label: "Paper Upload", icon: FileUp },
    { href: "/admin/marks", label: "Mark Entry", icon: GraduationCap },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
    { href: "/admin/notes", label: "Special Notes", icon: FileSpreadsheet },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/logs", label: "Login Audit", icon: ShieldAlert },
    {
      href: "/admin/ai-mode",
      label: "AI Mode Cockpit",
      icon: Bot,
      badge: aiMode ? "Active" : "Off",
      badgeClass: aiMode ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse" : "bg-white/10 text-muted-foreground",
    },
    { href: "/admin/reports", label: "Parent Reports", icon: Send },
    { href: "/admin/ai-simulator", label: "AI Simulator", icon: Terminal, badge: "Dev", badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="p-4 space-y-6">
        {/* Brand */}
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black text-lg">
            MC
          </div>
          <div>
            <h1 className="font-bold text-foreground text-sm tracking-tight">MC Mathematics</h1>
            <p className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
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
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold shadow-sm shadow-amber-500/10"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-amber-400" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span>{link.label}</span>
                </div>

                {link.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${link.badgeClass}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer strip */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono text-[10px]">Malinga C.</span>
        <Link href="/login" className="hover:text-rose-400 p-1 transition-colors" title="Sign out">
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
