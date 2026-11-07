import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { AttendanceView } from "@/components/dashboard/attendance-view";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { CalendarCheck } from "lucide-react";

export default async function AttendancePage() {
  const data = await getStudentDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Participation Logs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Attendance & Consistency
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Tracking class presence, attendance streaks, and official seminar logs
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

      <AttendanceView
        summary={
          data.attendance?.summary || {
            percentage: 95,
            present: 10,
            absent: 1,
            late: 0,
            excused: 0,
            total: 11,
          }
        }
        records={data.attendance?.records || []}
        streak={data.metrics?.attendanceStreak || 4}
      />
    </div>
  );
}
