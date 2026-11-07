"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getStudentAnalysis, recomputeStudentAnalysis } from "@/lib/analysis/recompute";
import { AnalysisMetrics } from "@/lib/analysis/types";
import { computeStudentAnalysis } from "@/lib/analysis/engine";

export interface StudentAnalysisResponse {
  locked: boolean;
  lockUntil?: string | null;
  lockReason?: "manual" | "schedule" | "temporary";
  hideResults: boolean;
  student: {
    id: string;
    uniqueId: string;
    fullName: string;
    grade: number;
    classType: "T" | "TP";
    reportPending: boolean;
    parentWaVerified: boolean;
  };
  metrics: AnalysisMetrics;
}

export async function getStudentAnalysisData(): Promise<StudentAnalysisResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let studentRecord: {
    id: string;
    unique_id: string;
    full_name: string;
    grade: number;
    class_type: "T" | "TP";
    report_pending: boolean;
    parent_wa_verified: boolean;
  } | null = null;

  if (user) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("students")
      .select("id, unique_id, full_name, grade, class_type, report_pending, parent_wa_verified")
      .eq("user_id", user.id)
      .maybeSingle();
    studentRecord = data;
  }

  // Fallback demo for preview/development when unauthenticated
  if (!studentRecord) {
    const demoMetrics: AnalysisMetrics = computeStudentAnalysis({
      studentId: "demo-student",
      studentMarks: [
        {
          id: "dm1",
          studentId: "demo-student",
          paperId: "dp1",
          marks: 72,
          sectionMarks: { Algebra: 21, Geometry: 15, Trigonometry: 18, Statistics: 18 },
          enteredAt: "2026-01-15T00:00:00Z",
        },
        {
          id: "dm2",
          studentId: "demo-student",
          paperId: "dp2",
          marks: 85,
          sectionMarks: { Algebra: 24, Geometry: 20, Trigonometry: 21, Statistics: 20 },
          enteredAt: "2026-02-10T00:00:00Z",
        },
        {
          id: "dm3",
          studentId: "demo-student",
          paperId: "dp3",
          marks: 78,
          sectionMarks: { Algebra: 22, Geometry: 16, Trigonometry: 22, Statistics: 18 },
          enteredAt: "2026-03-05T00:00:00Z",
        },
        {
          id: "dm4",
          studentId: "demo-student",
          paperId: "dp4",
          marks: 92,
          sectionMarks: { Algebra: 25, Geometry: 22, Trigonometry: 23, Statistics: 22 },
          enteredAt: "2026-04-01T00:00:00Z",
        },
      ],
      allMarks: [
        // Paper 1
        { id: "cm1", studentId: "s2", paperId: "dp1", marks: 60, sectionMarks: { Algebra: 15, Geometry: 15, Trigonometry: 15, Statistics: 15 } },
        { id: "cm2", studentId: "s3", paperId: "dp1", marks: 88, sectionMarks: { Algebra: 24, Geometry: 22, Trigonometry: 22, Statistics: 20 } },
        { id: "cm3", studentId: "s4", paperId: "dp1", marks: 75, sectionMarks: { Algebra: 20, Geometry: 18, Trigonometry: 20, Statistics: 17 } },
        { id: "cm4", studentId: "s5", paperId: "dp1", marks: 68, sectionMarks: { Algebra: 18, Geometry: 16, Trigonometry: 18, Statistics: 16 } },
        { id: "cm5", studentId: "s6", paperId: "dp1", marks: 95, sectionMarks: { Algebra: 25, Geometry: 24, Trigonometry: 24, Statistics: 22 } },
        // Paper 4
        { id: "cm6", studentId: "s2", paperId: "dp4", marks: 65, sectionMarks: { Algebra: 18, Geometry: 15, Trigonometry: 16, Statistics: 16 } },
        { id: "cm7", studentId: "s3", paperId: "dp4", marks: 80, sectionMarks: { Algebra: 22, Geometry: 19, Trigonometry: 20, Statistics: 19 } },
        { id: "cm8", studentId: "s4", paperId: "dp4", marks: 82, sectionMarks: { Algebra: 23, Geometry: 18, Trigonometry: 21, Statistics: 20 } },
        { id: "cm9", studentId: "s5", paperId: "dp4", marks: 74, sectionMarks: { Algebra: 20, Geometry: 17, Trigonometry: 19, Statistics: 18 } },
        { id: "cm10", studentId: "s6", paperId: "dp4", marks: 98, sectionMarks: { Algebra: 25, Geometry: 25, Trigonometry: 24, Statistics: 24 } },
      ],
      papers: [
        {
          id: "dp1",
          title: "Paper 01 - Diagnostic & Foundations",
          grade: 10,
          paperDate: "2026-01-15",
          totalMarks: 100,
          sections: [
            { name: "Algebra", max: 25 },
            { name: "Geometry", max: 25 },
            { name: "Trigonometry", max: 25 },
            { name: "Statistics", max: 25 },
          ],
        },
        {
          id: "dp2",
          title: "Paper 02 - Mid-Term Assessment",
          grade: 10,
          paperDate: "2026-02-10",
          totalMarks: 100,
          sections: [
            { name: "Algebra", max: 25 },
            { name: "Geometry", max: 25 },
            { name: "Trigonometry", max: 25 },
            { name: "Statistics", max: 25 },
          ],
        },
        {
          id: "dp3",
          title: "Paper 03 - Monthly Speed Test",
          grade: 10,
          paperDate: "2026-03-05",
          totalMarks: 100,
          sections: [
            { name: "Algebra", max: 25 },
            { name: "Geometry", max: 25 },
            { name: "Trigonometry", max: 25 },
            { name: "Statistics", max: 25 },
          ],
        },
        {
          id: "dp4",
          title: "Paper 04 - Comprehensive Review",
          grade: 10,
          paperDate: "2026-04-01",
          totalMarks: 100,
          sections: [
            { name: "Algebra", max: 25 },
            { name: "Geometry", max: 25 },
            { name: "Trigonometry", max: 25 },
            { name: "Statistics", max: 25 },
          ],
        },
      ],
    });

    return {
      locked: false,
      hideResults: false,
      student: {
        id: "demo-id",
        uniqueId: "MCG10TP1001",
        fullName: "Kamal Perera (Demo Preview)",
        grade: 10,
        classType: "TP",
        reportPending: true,
        parentWaVerified: true,
      },
      metrics: demoMetrics,
    };
  }

  // Parental lock verification
  const admin = createAdminClient();
  const { data: parentalSettings } = await admin
    .from("parental_settings")
    .select("locked, lock_until, lock_schedule, hide_results")
    .eq("student_id", studentRecord.id)
    .maybeSingle();

  let isLocked = false;
  let lockReason: "manual" | "schedule" | "temporary" | undefined = undefined;

  if (parentalSettings) {
    if (parentalSettings.locked) {
      isLocked = true;
      lockReason = "manual";
    } else if (
      parentalSettings.lock_until &&
      new Date(parentalSettings.lock_until).getTime() > Date.now()
    ) {
      isLocked = true;
      lockReason = "temporary";
    } else if (parentalSettings.lock_schedule?.enabled) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [startH, startM] = (parentalSettings.lock_schedule.start || "22:00")
        .split(":")
        .map(Number);
      const [endH, endM] = (parentalSettings.lock_schedule.end || "06:00")
        .split(":")
        .map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;

      if (startMin > endMin) {
        if (currentMinutes >= startMin || currentMinutes <= endMin) {
          isLocked = true;
          lockReason = "schedule";
        }
      } else {
        if (currentMinutes >= startMin && currentMinutes <= endMin) {
          isLocked = true;
          lockReason = "schedule";
        }
      }
    }
  }

  const hideResults = parentalSettings?.hide_results || false;

  // Retrieve metrics
  const metrics = await getStudentAnalysis(studentRecord.id);

  return {
    locked: isLocked,
    lockUntil: parentalSettings?.lock_until,
    lockReason,
    hideResults,
    student: {
      id: studentRecord.id,
      uniqueId: studentRecord.unique_id,
      fullName: studentRecord.full_name,
      grade: studentRecord.grade,
      classType: studentRecord.class_type,
      reportPending: studentRecord.report_pending,
      parentWaVerified: studentRecord.parent_wa_verified,
    },
    metrics: metrics || ({} as AnalysisMetrics),
  };
}

/**
 * Server action to manually trigger fresh recalculation
 */
export async function triggerAnalysisRecompute(studentId: string) {
  return recomputeStudentAnalysis(studentId);
}
