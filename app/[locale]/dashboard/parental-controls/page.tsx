import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { ParentalControlsView } from "@/components/dashboard/parental-controls-view";
import { ShieldCheck } from "lucide-react";

export default async function ParentalControlsPage() {
  const data = await getStudentDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Guardian Security & Privacy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Parental Controls
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Control dashboard lock schedules, report delivery preferences, and audit student logins
          </p>
        </div>
      </div>

      <ParentalControlsView
        settings={
          data.parentalSettings || {
            locked: false,
            lockSchedule: { enabled: false, start: "22:00", end: "06:00" },
            hideResults: false,
            reportFrequency: "every_paper",
            hasPinSet: false,
          }
        }
        studentId={data.student.uniqueId}
        reportPending={data.student.reportPending}
        lastReportRequestTime={data.lastReportRequest?.createdAt}
        parentWaVerified={data.student.parentWaVerified}
        recentLogins={data.recentLogins || []}
      />
    </div>
  );
}
