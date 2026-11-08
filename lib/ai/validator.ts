import { createAdminClient } from "@/lib/supabase/server";
import {
  ParsedToolCall,
  RecordMarksSchema,
  AddSpecialNoteSchema,
  PostAnnouncementSchema,
  MarkAttendanceSchema,
  RunAnalysisSchema,
  AskClarificationSchema,
  PublishPaperSchema,
  BroadcastReportsSchema,
  ResetPinSchema,
} from "./types";

export interface ValidatedExecutionPlan {
  valid: boolean;
  tool: string;
  args: Record<string, unknown>;
  error?: string;
  previewSummary: string;
  studentDbId?: string;
  paperDbId?: string;
}

/**
 * Validates tool calls emitted by AI against actual PostgreSQL database state and zod schemas.
 */
export async function validateToolCall(
  toolCall: ParsedToolCall
): Promise<ValidatedExecutionPlan> {
  const supabase = createAdminClient();

  switch (toolCall.tool) {
    case "record_marks": {
      const parsed = RecordMarksSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: parsed.error.issues.map((i) => i.message).join(", "),
          previewSummary: "Invalid mark entry arguments",
        };
      }

      // Look up student by unique ID (case-insensitive)
      const cleanId = parsed.data.student_id.trim().toUpperCase();
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, unique_id, full_name, grade")
        .ilike("unique_id", cleanId)
        .maybeSingle();

      if (studentError || !student) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: `Student ID "${cleanId}" not recognized in database.`,
          previewSummary: `Unknown student ID ${cleanId}`,
        };
      }

      // Resolve paper
      const paperRef = parsed.data.paper_ref.trim();
      let paperQuery = supabase.from("papers").select("id, title, total_marks, grade");

      // Attempt matching by title substring or UUID
      if (paperRef.length > 20) {
        paperQuery = paperQuery.eq("id", paperRef);
      } else {
        paperQuery = paperQuery
          .eq("grade", student.grade)
          .ilike("title", `%${paperRef}%`);
      }

      const { data: matchedPapers } = await paperQuery.limit(1);
      const paper = matchedPapers?.[0];

      if (!paper) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: `No paper found matching "${paperRef}" for Grade ${student.grade}.`,
          previewSummary: `Unrecognized paper reference: ${paperRef}`,
        };
      }

      if (parsed.data.marks > Number(paper.total_marks)) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: `Marks (${parsed.data.marks}) exceed paper maximum (${paper.total_marks}).`,
          previewSummary: `Invalid marks: ${parsed.data.marks} > ${paper.total_marks}`,
        };
      }

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        studentDbId: student.id,
        paperDbId: paper.id,
        previewSummary: `Record ${parsed.data.marks}/${paper.total_marks} marks for ${student.full_name} (${student.unique_id}) on "${paper.title}"`,
      };
    }

    case "add_special_note": {
      const parsed = AddSpecialNoteSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: parsed.error.issues.map((i) => i.message).join(", "),
          previewSummary: "Invalid note parameters",
        };
      }

      const cleanId = parsed.data.student_id.trim().toUpperCase();
      const { data: student } = await supabase
        .from("students")
        .select("id, unique_id, full_name")
        .ilike("unique_id", cleanId)
        .maybeSingle();

      if (!student) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: `Student ID "${cleanId}" not recognized.`,
          previewSummary: `Unknown student ID ${cleanId}`,
        };
      }

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        studentDbId: student.id,
        previewSummary: `Send special note to ${student.full_name} (${student.unique_id}): "${parsed.data.text.slice(0, 50)}..."`,
      };
    }

    case "post_announcement": {
      const parsed = PostAnnouncementSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: parsed.error.issues.map((i) => i.message).join(", "),
          previewSummary: "Invalid announcement parameters",
        };
      }

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        previewSummary: `Broadcast announcement to [${parsed.data.target}]: "${parsed.data.text.slice(0, 50)}..."`,
      };
    }

    case "mark_attendance": {
      const parsed = MarkAttendanceSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: parsed.error.issues.map((i) => i.message).join(", "),
          previewSummary: "Invalid attendance parameters",
        };
      }

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        previewSummary: `Mark attendance for ${parsed.data.date} (${parsed.data.session}): ${parsed.data.present_ids.length} present, ${parsed.data.absent_ids.length} absent`,
      };
    }

    case "ask_clarification": {
      const parsed = AskClarificationSchema.safeParse(toolCall.args);
      return {
        valid: true,
        tool: toolCall.tool,
        args: toolCall.args,
        previewSummary: parsed.success
          ? parsed.data.question
          : "Could you please clarify your request?",
      };
    }

    case "run_analysis":
    case "send_parent_report": {
      const parsed = RunAnalysisSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: "Valid student ID is required",
          previewSummary: "Invalid student identifier",
        };
      }

      const cleanId = parsed.data.student_id.trim().toUpperCase();
      const { data: student } = await supabase
        .from("students")
        .select("id, unique_id, full_name")
        .ilike("unique_id", cleanId)
        .maybeSingle();

      if (!student) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: `Student ID "${cleanId}" not found.`,
          previewSummary: `Unknown student ID ${cleanId}`,
        };
      }

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        studentDbId: student.id,
        previewSummary: `${toolCall.tool === "run_analysis" ? "Run diagnostic analysis" : "Send WhatsApp parent report"} for ${student.full_name} (${student.unique_id})`,
      };
    }

    case "publish_paper": {
      const parsed = PublishPaperSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: parsed.error.issues.map((i) => i.message).join(", "),
          previewSummary: "Invalid paper details",
        };
      }

      const target = parsed.data.target_student
        ? `student ${parsed.data.target_student}`
        : `Grade ${parsed.data.grade} (${parsed.data.class_type})`;

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        previewSummary: `Publish paper "${parsed.data.title}" to ${target}`,
      };
    }

    case "broadcast_reports": {
      const parsed = BroadcastReportsSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: "Invalid broadcast parameters",
          previewSummary: "Invalid broadcast parameters",
        };
      }

      const grade = parsed.data.grade || 10;
      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        previewSummary: `Compute analysis, refresh dashboards & dispatch progress reports for all Grade ${grade} students (${parsed.data.class_type})`,
      };
    }

    case "reset_pin": {
      const parsed = ResetPinSchema.safeParse(toolCall.args);
      if (!parsed.success) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: "Valid student ID is required",
          previewSummary: "Invalid PIN reset parameters",
        };
      }

      const cleanId = parsed.data.student_id.trim().toUpperCase();
      const { data: student } = await supabase
        .from("students")
        .select("id, unique_id, full_name")
        .ilike("unique_id", cleanId)
        .maybeSingle();

      if (!student) {
        return {
          valid: false,
          tool: toolCall.tool,
          args: toolCall.args,
          error: `Student ID "${cleanId}" not found.`,
          previewSummary: `Unknown student ID ${cleanId}`,
        };
      }

      return {
        valid: true,
        tool: toolCall.tool,
        args: parsed.data,
        studentDbId: student.id,
        previewSummary: `Reset PIN for ${student.full_name} (${student.unique_id})`,
      };
    }

    default:
      return {
        valid: false,
        tool: toolCall.tool,
        args: toolCall.args,
        error: `Unrecognized tool "${toolCall.tool}".`,
        previewSummary: "Unsupported command",
      };
  }
}
