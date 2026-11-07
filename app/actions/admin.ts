"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { recomputeStudentAnalysis } from "@/lib/analysis/recompute";
import { revalidatePath } from "next/cache";

/**
 * Checks whether AI Mode is currently active in system settings.
 */
export async function getAiModeStatus(): Promise<{
  aiMode: boolean;
  parentChatEnabled: boolean;
  aiConfirmRequired: boolean;
  adminWhatsapp: string;
  paidTemplatesEnabled: boolean;
}> {
  const supabase = createAdminClient();

  // Try fetching all columns including parent_chat_enabled
  const { data, error } = await supabase
    .from("system_settings")
    .select("ai_mode, parent_chat_enabled, ai_confirm_required, admin_whatsapp, paid_templates_enabled")
    .eq("id", 1)
    .single();

  if (!error && data) {
    return {
      aiMode: Boolean(data.ai_mode),
      parentChatEnabled: data.parent_chat_enabled !== false,
      aiConfirmRequired: Boolean(data.ai_confirm_required),
      adminWhatsapp: data.admin_whatsapp || "+94771234567",
      paidTemplatesEnabled: Boolean(data.paid_templates_enabled),
    };
  }

  // If column parent_chat_enabled is missing or failed, fall back to base columns
  const { data: fallbackData } = await supabase
    .from("system_settings")
    .select("ai_mode, ai_confirm_required, admin_whatsapp, paid_templates_enabled")
    .eq("id", 1)
    .single();

  if (fallbackData) {
    return {
      aiMode: Boolean(fallbackData.ai_mode),
      parentChatEnabled: true,
      aiConfirmRequired: Boolean(fallbackData.ai_confirm_required),
      adminWhatsapp: fallbackData.admin_whatsapp || "+94771234567",
      paidTemplatesEnabled: Boolean(fallbackData.paid_templates_enabled),
    };
  }

  return {
    aiMode: false,
    parentChatEnabled: true,
    aiConfirmRequired: true,
    adminWhatsapp: "+94771234567",
    paidTemplatesEnabled: false,
  };
}

/**
 * Updates AI Mode toggle in system settings.
 */
export async function setAiMode(enabled: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("system_settings")
    .update({ ai_mode: enabled, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    throw new Error(`Failed to update AI Mode: ${error.message}`);
  }

  revalidatePath("/admin/ai-mode");
  revalidatePath("/admin");
  return { success: true, aiMode: enabled };
}

/**
 * Updates Parent AI Chat toggle in system settings.
 */
export async function setParentChatEnabled(enabled: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("system_settings")
    .update({ parent_chat_enabled: enabled, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    throw new Error(`Failed to update Parent Chat: ${error.message}`);
  }

  revalidatePath("/admin/ai-mode");
  revalidatePath("/admin");
  return { success: true, parentChatEnabled: enabled };
}

/**
 * Updates Paid Templates toggle in system settings.
 */
export async function setPaidTemplatesEnabled(enabled: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("system_settings")
    .update({ paid_templates_enabled: enabled, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    throw new Error(`Failed to update Paid Templates: ${error.message}`);
  }

  revalidatePath("/admin/reports");
  return { success: true, paidTemplatesEnabled: enabled };
}

/**
 * Enforces server-side AI Mode guard.
 * Returns 409 if AI Mode is active to prevent concurrent manual writes.
 */
async function enforceManualWriteAllowed() {
  const status = await getAiModeStatus();
  if (status.aiMode) {
    throw new Error("409 AI_MODE_ACTIVE: Manual editing is disabled while AI Mode is active.");
  }
}

/**
 * Overview summary statistics for Admin dashboard.
 */
export async function getAdminOverviewData() {
  const supabase = createAdminClient();
  const { getAIStatus } = await import("@/lib/ai/status");

  const [
    { count: totalStudents },
    { count: ongoingPapers },
    { count: finishedPapers },
    { count: totalMarksEntered },
    { data: recentLogins },
    systemSettings,
    aiStatus,
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("papers").select("*", { count: "exact", head: true }).eq("status", "ongoing"),
    supabase.from("papers").select("*", { count: "exact", head: true }).eq("status", "finished"),
    supabase.from("marks").select("*", { count: "exact", head: true }),
    supabase
      .from("login_log")
      .select("id, student_id, action, success, failure_reason, user_agent, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    getAiModeStatus(),
    getAIStatus(),
  ]);

  return {
    stats: {
      totalStudents: totalStudents || 0,
      ongoingPapers: ongoingPapers || 0,
      finishedPapers: finishedPapers || 0,
      totalMarksEntered: totalMarksEntered || 0,
    },
    systemSettings,
    aiStatus,
    recentLogins: recentLogins || [],
  };
}

/**
 * Uploads a new paper for a specific grade and optional class type.
 */
export async function createPaper(data: {
  title: string;
  grade: number;
  classType?: "T" | "TP" | null;
  totalMarks: number;
  sections?: Array<{ name: string; max: number }>;
  paperDate?: string;
  dueAt?: string | null;
  status?: "ongoing" | "finished";
  filePath?: string | null;
}) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  if (!data.title || data.title.trim().length === 0) {
    throw new Error("Paper title is required.");
  }
  if (data.grade < 6 || data.grade > 13) {
    throw new Error("Grade must be between 6 and 13.");
  }

  const { data: paper, error } = await supabase
    .from("papers")
    .insert({
      title: data.title.trim(),
      grade: data.grade,
      class_type: data.classType || null,
      total_marks: data.totalMarks || 100,
      sections: data.sections || [],
      paper_date: data.paperDate || new Date().toISOString().split("T")[0],
      due_at: data.dueAt || null,
      status: data.status || "ongoing",
      file_path: data.filePath || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create paper: ${error.message}`);
  }

  revalidatePath("/admin/papers");
  return { success: true, paper };
}

/**
 * Lists all papers with grade and status filtering.
 */
export async function getAdminPapers(grade?: number) {
  const supabase = createAdminClient();
  let query = supabase.from("papers").select("*").order("created_at", { ascending: false });

  if (grade && grade >= 6 && grade <= 13) {
    query = query.eq("grade", grade);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch papers: ${error.message}`);
  }
  return data || [];
}

/**
 * Enters mark for a single student and immediately recomputes analysis.
 */
export async function enterStudentMark(data: {
  studentId: string;
  paperId: string;
  marks: number;
  sectionMarks?: Record<string, number>;
}) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  if (data.marks < 0) {
    throw new Error("Marks cannot be negative.");
  }

  // Validate paper total
  const { data: paper, error: paperError } = await supabase
    .from("papers")
    .select("total_marks, grade")
    .eq("id", data.paperId)
    .single();

  if (paperError || !paper) {
    throw new Error("Selected paper not found.");
  }

  if (data.marks > Number(paper.total_marks)) {
    throw new Error(`Marks (${data.marks}) exceed paper maximum (${paper.total_marks}).`);
  }

  // Upsert mark record
  const { data: mark, error: markError } = await supabase
    .from("marks")
    .upsert(
      {
        student_id: data.studentId,
        paper_id: data.paperId,
        marks: data.marks,
        section_marks: data.sectionMarks || {},
        source: "manual",
        entered_at: new Date().toISOString(),
      },
      { onConflict: "student_id, paper_id" }
    )
    .select()
    .single();

  if (markError) {
    throw new Error(`Failed to save mark: ${markError.message}`);
  }

  // Automatically trigger deterministic recompute
  await recomputeStudentAnalysis(data.studentId);

  revalidatePath("/admin/marks");
  revalidatePath("/dashboard");
  return { success: true, mark };
}

/**
 * Bulk enters marks for an entire class roster.
 */
export async function bulkEnterStudentMarks(
  paperId: string,
  entries: Array<{
    studentId: string;
    marks: number;
    sectionMarks?: Record<string, number>;
  }>
) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  for (const entry of entries) {
    await supabase.from("marks").upsert(
      {
        student_id: entry.studentId,
        paper_id: paperId,
        marks: entry.marks,
        section_marks: entry.sectionMarks || {},
        source: "manual",
        entered_at: new Date().toISOString(),
      },
      { onConflict: "student_id, paper_id" }
    );

    // Recompute analysis for student
    await recomputeStudentAnalysis(entry.studentId);
  }

  revalidatePath("/admin/marks");
  revalidatePath("/dashboard");
  return { success: true, count: entries.length };
}

/**
 * Records attendance for a date and session across class students.
 */
export async function recordClassAttendance(data: {
  date: string;
  session: string;
  records: Array<{
    studentId: string;
    status: "present" | "absent" | "late" | "excused";
  }>;
}) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  for (const rec of data.records) {
    await supabase.from("attendance").upsert(
      {
        student_id: rec.studentId,
        date: data.date,
        session: data.session,
        status: rec.status,
      },
      { onConflict: "student_id, date, session" }
    );
  }

  revalidatePath("/admin/attendance");
  revalidatePath("/dashboard/attendance");
  return { success: true, count: data.records.length };
}

/**
 * Announcements CRUD.
 */
export async function createAdminAnnouncement(data: {
  title: string;
  body: string;
  target: string; // 'all', 'grade:10', or student uniqueId
  pinned?: boolean;
}) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  const { data: announcement, error } = await supabase
    .from("announcements")
    .insert({
      title: data.title.trim(),
      body: data.body.trim(),
      target: data.target,
      pinned: data.pinned || false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create announcement: ${error.message}`);
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard/announcements");
  return { success: true, announcement };
}

export async function deleteAdminAnnouncement(id: string) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete announcement: ${error.message}`);
  }

  revalidatePath("/admin/announcements");
  return { success: true };
}

/**
 * Creates special note for a specific student.
 */
export async function createStudentSpecialNote(data: {
  studentId: string;
  note: string;
}) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  const { data: note, error } = await supabase
    .from("special_notes")
    .insert({
      student_id: data.studentId,
      body: data.note.trim(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create note: ${error.message}`);
  }

  revalidatePath("/admin/notes");
  revalidatePath("/dashboard/special-notes");
  return { success: true, note };
}

/**
 * Student roster management.
 */
export async function getAdminStudents(search?: string, grade?: number) {
  const supabase = createAdminClient();
  let query = supabase.from("students").select("*").order("unique_id", { ascending: true });

  if (grade && grade >= 6 && grade <= 13) {
    query = query.eq("grade", grade);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch students: ${error.message}`);
  }

  let list = data || [];
  if (search && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.unique_id.toLowerCase().includes(q) ||
        s.full_name.toLowerCase().includes(q) ||
        s.parent_whatsapp.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Resets student PIN or deactivates student.
 */
export async function resetStudentPin(studentId: string, newPin: string) {
  await enforceManualWriteAllowed();
  const supabase = createAdminClient();

  if (!/^\d{6}$/.test(newPin)) {
    throw new Error("PIN must be exactly 6 digits.");
  }

  // Update synthetic email auth password in Supabase auth
  const { data: student } = await supabase
    .from("students")
    .select("user_id, unique_id")
    .eq("id", studentId)
    .single();

  if (student && student.user_id) {
    await supabase.auth.admin.updateUserById(student.user_id, {
      password: `mc_${student.unique_id.toLowerCase()}_${newPin}`,
    });
  }

  // Mark any pending PIN reset requests as resolved
  await supabase
    .from("pin_reset_requests")
    .update({ status: "resolved" })
    .eq("student_id", studentId);

  revalidatePath("/admin/students");
  return { success: true };
}

/**
 * Fetches login logs for security auditing.
 */
export async function getAdminLoginLogs(filters?: { studentId?: string; limit?: number }) {
  const supabase = createAdminClient();
  let query = supabase
    .from("login_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters?.limit || 50);

  if (filters?.studentId) {
    query = query.eq("student_id", filters.studentId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch login logs: ${error.message}`);
  }
  return data || [];
}

/**
 * Fetches pending PIN reset requests.
 */
export async function getAdminPinResetRequests() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pin_reset_requests")
    .select("*, students(full_name, grade, parent_whatsapp)")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }
  return data || [];
}

/**
 * Fetches AI actions history for admin audit and undo.
 */
export async function getAdminAiActions() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ai_actions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return [];
  }
  return data || [];
}

/**
 * Reverts an AI action using its stored undo_data snapshot within 24 hours.
 */
export async function undoAiAction(actionId: string) {
  const supabase = createAdminClient();

  const { data: action, error } = await supabase
    .from("ai_actions")
    .select("*")
    .eq("id", actionId)
    .single();

  if (error || !action) {
    throw new Error("AI action not found.");
  }

  // Check 24 hour window
  const createdAt = new Date(action.created_at).getTime();
  if (Date.now() - createdAt > 24 * 60 * 60 * 1000) {
    throw new Error("Undo window expired (actions can only be reverted within 24 hours).");
  }

  const undoData = action.undo_data;
  if (!undoData) {
    throw new Error("No undo snapshot available for this action.");
  }

  // Revert marks if undoData specifies mark IDs
  if (undoData.createdMarkIds && Array.isArray(undoData.createdMarkIds)) {
    await supabase.from("marks").delete().in("id", undoData.createdMarkIds);
  }

  if (undoData.createdAnnouncementIds && Array.isArray(undoData.createdAnnouncementIds)) {
    await supabase.from("announcements").delete().in("id", undoData.createdAnnouncementIds);
  }

  if (undoData.createdNoteIds && Array.isArray(undoData.createdNoteIds)) {
    await supabase.from("special_notes").delete().in("id", undoData.createdNoteIds);
  }

  // Update status to undone
  await supabase
    .from("ai_actions")
    .update({ status: "undone" })
    .eq("id", actionId);

  revalidatePath("/admin/ai-mode");
  return { success: true };
}

export async function getAdminReportDeliveries() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("report_deliveries")
    .select("*, students(full_name, unique_id, parent_whatsapp)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return [];
  }
  return data || [];
}
