import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { AnnouncementsView } from "@/components/dashboard/announcements-view";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { Bell } from "lucide-react";

export default async function AnnouncementsPage() {
  const data = await getStudentDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Official Bulletins
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Class Announcements
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Upcoming revision seminars, holiday timetables, and paper release schedules
          </p>
        </div>

        <SendReportButton
          studentId={data.student.uniqueId}
          reportPending={data.student.reportPending}
          lastReportRequestTime={data.lastReportRequest?.createdAt}
          parentWaVerified={data.student.parentWaVerified}
          size="sm"
        />
      </div>

      <AnnouncementsView
        announcements={data.announcements || []}
      />
    </div>
  );
}
