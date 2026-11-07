import { createAdminClient } from "@/lib/supabase/server";
import { computeStudentAnalysis } from "./engine";
import { AnalysisMetrics, RawMarkRecord, RawPaperRecord } from "./types";

/**
 * Recomputes the full analytical profile for a student based on current marks and peer benchmarks.
 * Saves results to `analyses` table and sets `report_pending = true` on the student record.
 */
export async function recomputeStudentAnalysis(studentId: string): Promise<AnalysisMetrics | null> {
  const supabase = createAdminClient();

  // 1. Fetch student info
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, grade, class_type, full_name")
    .eq("id", studentId)
    .single();

  if (studentError || !student) {
    console.error("[Analysis Recompute] Student not found:", studentId, studentError);
    return null;
  }

  // 2. Fetch all marks for this student
  const { data: rawStudentMarks, error: marksError } = await supabase
    .from("marks")
    .select("id, student_id, paper_id, marks, section_marks, entered_at")
    .eq("student_id", studentId);

  if (marksError) {
    console.error("[Analysis Recompute] Error fetching student marks:", marksError);
    return null;
  }

  const studentMarks: RawMarkRecord[] = (rawStudentMarks || []).map((m) => ({
    id: m.id,
    studentId: m.student_id,
    paperId: m.paper_id,
    marks: Number(m.marks),
    sectionMarks: m.section_marks as Record<string, number> | undefined,
    enteredAt: m.entered_at,
  }));

  // 3. Fetch papers for this student's grade
  const { data: rawPapers, error: papersError } = await supabase
    .from("papers")
    .select("id, title, grade, paper_date, total_marks, sections")
    .eq("grade", student.grade);

  if (papersError) {
    console.error("[Analysis Recompute] Error fetching papers:", papersError);
    return null;
  }

  const papers: RawPaperRecord[] = (rawPapers || []).map((p) => ({
    id: p.id,
    title: p.title,
    grade: p.grade,
    paperDate: p.paper_date,
    totalMarks: Number(p.total_marks || 100),
    sections: p.sections as Array<{ name: string; max: number }> | null,
  }));

  const paperIds = papers.map((p) => p.id);

  // 4. Fetch all marks from peers for these papers
  let allMarks: RawMarkRecord[] = [];
  if (paperIds.length > 0) {
    const { data: rawClassMarks, error: classMarksError } = await supabase
      .from("marks")
      .select("id, student_id, paper_id, marks, section_marks, entered_at")
      .in("paper_id", paperIds);

    if (!classMarksError && rawClassMarks) {
      allMarks = rawClassMarks.map((m) => ({
        id: m.id,
        studentId: m.student_id,
        paperId: m.paper_id,
        marks: Number(m.marks),
        sectionMarks: m.section_marks as Record<string, number> | undefined,
        enteredAt: m.entered_at,
      }));
    }
  }

  // 5. Compute deterministic analysis
  const metrics = computeStudentAnalysis({
    studentId,
    studentMarks,
    allMarks,
    papers,
  });

  // Latest paper ID
  const latestPaperItem = metrics.paperHistory[metrics.paperHistory.length - 1];
  const latestPaperId = latestPaperItem?.paperId || null;

  // 6. Save to `analyses` table
  const { error: insertError } = await supabase.from("analyses").insert({
    student_id: studentId,
    paper_id: latestPaperId,
    metrics: metrics as unknown as Record<string, unknown>,
  });

  if (insertError) {
    console.error("[Analysis Recompute] Error saving analysis:", insertError);
  }

  // 7. Flag student as `report_pending = true` so the "Send me the report" button shows "Report ready"
  await supabase
    .from("students")
    .update({ report_pending: true })
    .eq("id", studentId);

  return metrics;
}

/**
 * Retrieves the latest stored analysis or computes on the fly if not yet generated.
 */
export async function getStudentAnalysis(studentId: string): Promise<AnalysisMetrics | null> {
  const supabase = createAdminClient();

  const { data: stored, error } = await supabase
    .from("analyses")
    .select("metrics, created_at")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!error && stored?.metrics) {
    return stored.metrics as unknown as AnalysisMetrics;
  }

  // If not stored yet, recompute now
  return recomputeStudentAnalysis(studentId);
}
