import { createAdminClient } from "@/lib/supabase/server";
import { recomputeStudentAnalysis } from "@/lib/analysis/recompute";
import { ValidatedExecutionPlan } from "./validator";

export interface ExecutionResult {
  success: boolean;
  actionId: string;
  summary: string;
  undoAvailable: boolean;
}

/**
 * Executes a validated AI tool call with service role privileges.
 * Stores action snapshot in ai_actions table with undo_data.
 */
export async function executeToolCall(
  plan: ValidatedExecutionPlan,
  rawMessageText: string,
  waMessageId?: string
): Promise<ExecutionResult> {
  const supabase = createAdminClient();

  if (!plan.valid) {
    // Log failed attempt
    const { data: failedAction } = await supabase
      .from("ai_actions")
      .insert({
        wa_message_id: waMessageId || null,
        raw_text: rawMessageText,
        tool_calls: [{ tool: plan.tool, args: plan.args }],
        result: { error: plan.error },
        status: "failed",
      })
      .select("id")
      .single();

    return {
      success: false,
      actionId: failedAction?.id || "",
      summary: plan.error || "Validation failed",
      undoAvailable: false,
    };
  }

  const undoData: Record<string, unknown> = {};

  try {
    switch (plan.tool) {
      case "record_marks": {
        const studentId = plan.studentDbId!;
        const paperId = plan.paperDbId!;
        const marks = Number(plan.args.marks);
        const sectionMarks = plan.args.section_marks as Record<string, number> | undefined;

        const { data: mark, error } = await supabase
          .from("marks")
          .upsert(
            {
              student_id: studentId,
              paper_id: paperId,
              marks,
              section_marks: sectionMarks || {},
              source: "ai",
              entered_at: new Date().toISOString(),
            },
            { onConflict: "student_id, paper_id" }
          )
          .select("id")
          .single();

        if (error) throw new Error(error.message);
        undoData.createdMarkIds = [mark.id];

        // Recompute analysis
        await recomputeStudentAnalysis(studentId);
        break;
      }

      case "add_special_note": {
        const studentId = plan.studentDbId!;
        const text = String(plan.args.text);

        const { data: note, error } = await supabase
          .from("special_notes")
          .insert({
            student_id: studentId,
            body: text,
          })
          .select("id")
          .single();

        if (error) throw new Error(error.message);
        undoData.createdNoteIds = [note.id];
        break;
      }

      case "post_announcement": {
        const text = String(plan.args.text);
        const target = String(plan.args.target || "all");
        const pinned = Boolean(plan.args.pinned);

        const { data: announcement, error } = await supabase
          .from("announcements")
          .insert({
            title: "Announcement from Sir",
            body: text,
            target,
            pinned,
          })
          .select("id")
          .single();

        if (error) throw new Error(error.message);
        undoData.createdAnnouncementIds = [announcement.id];
        break;
      }

      case "mark_attendance": {
        const date = String(plan.args.date);
        const session = String(plan.args.session);
        const presentIds = (plan.args.present_ids as string[]) || [];
        const absentIds = (plan.args.absent_ids as string[]) || [];

        // Look up student DB IDs
        const allUniqueIds = [...presentIds, ...absentIds];
        const { data: students } = await supabase
          .from("students")
          .select("id, unique_id")
          .in("unique_id", allUniqueIds);

        const studentMap = new Map<string, string>();
        students?.forEach((s) => studentMap.set(s.unique_id.toUpperCase(), s.id));

        for (const uid of presentIds) {
          const dbId = studentMap.get(uid.toUpperCase());
          if (dbId) {
            await supabase.from("attendance").upsert({
              student_id: dbId,
              date,
              session,
              status: "present",
            });
          }
        }

        for (const uid of absentIds) {
          const dbId = studentMap.get(uid.toUpperCase());
          if (dbId) {
            await supabase.from("attendance").upsert({
              student_id: dbId,
              date,
              session,
              status: "absent",
            });
          }
        }
        break;
      }

      case "run_analysis": {
        await recomputeStudentAnalysis(plan.studentDbId!);
        break;
      }

      case "publish_paper": {
        const { title, grade, class_type, total_marks } = plan.args as any;
        const { data: paper } = await supabase
          .from("papers")
          .insert({
            title: title || "New Mathematics Paper",
            grade: Number(grade) || 10,
            class_type: class_type === "both" ? null : class_type,
            total_marks: Number(total_marks) || 100,
            status: "ongoing",
          })
          .select("id")
          .single();

        if (paper) {
          undoData.createdPaperId = paper.id;
        }
        break;
      }

      case "reset_pin": {
        const studentId = plan.studentDbId!;
        const newPin = (plan.args.new_pin as string) || "123456";
        const { resetStudentPin } = await import("@/app/actions/admin");
        await resetStudentPin(studentId, newPin);
        break;
      }

      case "ask_clarification": {
        // No DB mutation needed
        break;
      }
    }

    // Record executed action in ai_actions
    const { data: action } = await supabase
      .from("ai_actions")
      .insert({
        wa_message_id: waMessageId || null,
        raw_text: rawMessageText,
        tool_calls: [{ tool: plan.tool, args: plan.args }],
        result: { status: "success", summary: plan.previewSummary },
        status: "executed",
        undo_data: undoData,
      })
      .select("id")
      .single();

    return {
      success: true,
      actionId: action?.id || "",
      summary: `✅ Success: ${plan.previewSummary}`,
      undoAvailable: Object.keys(undoData).length > 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Execution error";
    return {
      success: false,
      actionId: "",
      summary: `❌ Execution Failed: ${errorMsg}`,
      undoAvailable: false,
    };
  }
}
