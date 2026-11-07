import React from "react";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import { PaperResultsView } from "@/components/dashboard/paper-results-view";
import { SendReportButton } from "@/components/dashboard/send-report-button";
import { FileText, EyeOff } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default async function PapersPage() {
  const data = await getStudentDashboardData();

  if (data.hideResults) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <GlassCard className="p-8 border-amber-500/30 text-center space-y-4">
          <EyeOff className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-foreground">
            Results Temporarily Hidden
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Paper marks are currently hidden from student view as requested in Parental Controls.
            Your parent can toggle this setting in the Parental Controls tab.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Academic Assessments
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Paper Results & Submissions
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Showing papers for Grade {data.student.grade} (
            {data.student.classType === "TP" ? "Theory + Paper" : "Theory Only"})
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

      <PaperResultsView
        ongoingPapers={data.papers?.ongoing || []}
        finishedPapers={data.papers?.finished || []}
        recentlyDone={data.papers?.recentlyDone || []}
        studentGrade={data.student.grade}
      />
    </div>
  );
}
