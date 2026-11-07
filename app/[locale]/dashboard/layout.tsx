import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { LockedScreen } from "@/components/dashboard/locked-screen";
import { RealtimeListener } from "@/components/dashboard/realtime-listener";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { PushNotificationToggle } from "@/components/dashboard/push-notification-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  CalendarCheck2,
  FileSpreadsheet,
  ShieldAlert,
  LogOut,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { DashboardNavLinks } from "@/components/dashboard/nav-links";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getStudentDashboardData();

  // If parental lock is active on the server, render the locked screen immediately!
  // Private child pages will never be evaluated or rendered.
  if (data.locked) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <header className="p-6 border-b border-white/10 flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black text-xl">
              MC
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">MC Mathematics</h1>
              <p className="text-[11px] text-muted-foreground font-mono">
                Student Portal Security Gate
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <LockedScreen
            studentName={data.student.fullName}
            uniqueId={data.student.uniqueId}
            grade={data.student.grade}
            lockUntil={data.lockUntil}
            lockReason={data.lockReason}
          />
        </main>

        <footer className="p-6 text-center text-xs text-muted-foreground border-t border-white/10">
          <p>© 2026 MC Mathematics. Kurunegala, Sri Lanka.</p>
        </footer>
      </div>
    );
  }

  const unreadNotesCount = data.specialNotes?.filter((n) => !n.isRead).length || 0;
  const announcementsCount = data.announcements?.length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Realtime listener for Live Marks, Notes & Announcements */}
      <RealtimeListener studentId={data.student.id} />

      {/* ========================================================================= */}
      {/* 1. Desktop Left Sidebar */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-white/10 bg-zinc-950/40 backdrop-blur-2xl p-6 sticky top-0 h-screen shrink-0">
        <div className="space-y-6">
          {/* Header Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif font-black text-xl group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(250,204,21,0.15)]">
              MC
            </div>
            <div>
              <div className="font-extrabold text-foreground tracking-tight text-base leading-none">
                MC Mathematics
              </div>
              <span className="text-[11px] text-amber-500/80 font-mono">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Student Profile Chip */}
          <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">
                {data.student.uniqueId}
              </span>
              <Badge variant="accent" className="text-[10px] px-2 py-0.5">
                Grade {data.student.grade} • {data.student.classType === "TP" ? "TP" : "T"}
              </Badge>
            </div>
            <div className="font-bold text-foreground text-sm truncate">
              {data.student.fullName}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <DashboardNavLinks
              unreadNotesCount={unreadNotesCount}
              announcementsCount={announcementsCount}
            />
          </nav>
        </div>

        {/* Sidebar Footer: Report CTA, Push Toggle, Settings */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {/* WhatsApp Report Button (A4-8) */}
          <SendReportButton
            studentId={data.student.uniqueId}
            reportPending={data.student.reportPending}
            lastReportRequestTime={data.lastReportRequest?.createdAt}
            parentWaVerified={data.student.parentWaVerified}
            size="sm"
            fullWidth
          />

          {/* Web Push Notification Toggle */}
          <div className="flex justify-center">
            <PushNotificationToggle />
          </div>

          {/* Theme & Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1.5 transition-colors p-1.5"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. Mobile Top Navigation Strip */}
      {/* ========================================================================= */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black text-sm">
            MC
          </div>
          <span className="font-bold text-sm text-foreground">MC Maths</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="accent" className="text-[10px] font-mono">
            {data.student.uniqueId}
          </Badge>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. Main Dashboard Content Area */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4. Mobile Bottom Tab Bar */}
      {/* ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 px-3 py-2 flex items-center justify-around">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 active:scale-95 transition-all p-1"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/dashboard/papers"
          className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 active:scale-95 transition-all p-1"
        >
          <FileText className="w-5 h-5" />
          <span>Papers</span>
        </Link>

        <Link
          href="/dashboard/analysis"
          className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 active:scale-95 transition-all p-1"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analysis</span>
        </Link>

        <Link
          href="/dashboard/attendance"
          className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 active:scale-95 transition-all p-1"
        >
          <CalendarCheck2 className="w-5 h-5" />
          <span>Attendance</span>
        </Link>

        <Link
          href="/dashboard/special-notes"
          className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 active:scale-95 transition-all p-1 relative"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>Notes</span>
          {unreadNotesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
          )}
        </Link>

        <Link
          href="/dashboard/parental-controls"
          className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 active:scale-95 transition-all p-1"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>Parent</span>
        </Link>
      </nav>
    </div>
  );
}
