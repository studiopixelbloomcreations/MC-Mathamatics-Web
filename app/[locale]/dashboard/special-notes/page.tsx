import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { SpecialNotesView } from "@/components/dashboard/special-notes-view";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { FileSpreadsheet } from "lucide-react";

export default async function SpecialNotesPage() {
  const data = await getStudentDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            <span className="text-xs uppercase font-mono tracking-widest text-blue-500 font-semibold">
              Private Teacher Communication
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Special Notes from Sir
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Direct personal feedback, encouragement, and exam strategy pointers from Malinga Sir
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

      <SpecialNotesView notes={data.specialNotes || []} />
    </div>
  );
}
