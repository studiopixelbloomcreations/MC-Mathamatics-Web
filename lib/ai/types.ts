import { z } from "zod";

export interface AIProvider {
  name: string;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateToolCalls(
    message: string,
    context?: Record<string, unknown>
  ): Promise<ParsedToolCall[]>;
}

export type ToolName =
  | "record_marks"
  | "add_special_note"
  | "post_announcement"
  | "mark_attendance"
  | "run_analysis"
  | "send_parent_report"
  | "publish_paper"
  | "broadcast_reports"
  | "reset_pin"
  | "ask_clarification";

export interface ParsedToolCall {
  tool: ToolName;
  args: Record<string, unknown>;
}

export const BroadcastReportsSchema = z.object({
  grade: z.number().min(6).max(13).optional(),
  class_type: z.enum(["T", "TP", "both"]).default("both"),
  paper_title: z.string().optional(),
});

export const PublishPaperSchema = z.object({
  title: z.string().min(1, "Paper title is required"),
  grade: z.number().min(6).max(13),
  class_type: z.enum(["T", "TP", "both"]).default("both"),
  total_marks: z.number().default(100),
  target_student: z.string().optional(),
});

export const ResetPinSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  new_pin: z.string().optional(),
});

export const RecordMarksSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  paper_ref: z.string().min(1, "Paper reference or title is required"),
  marks: z.number().min(0, "Marks cannot be negative"),
  section_marks: z.record(z.string(), z.number()).optional(),
});

export const AddSpecialNoteSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  text: z.string().min(1, "Note text cannot be empty"),
});

export const PostAnnouncementSchema = z.object({
  text: z.string().min(1, "Announcement text cannot be empty"),
  target: z.string().default("all"),
  pinned: z.boolean().default(false),
});

export const MarkAttendanceSchema = z.object({
  date: z.string(),
  session: z.string().default("Regular Session"),
  present_ids: z.array(z.string()).default([]),
  absent_ids: z.array(z.string()).default([]),
  late_ids: z.array(z.string()).default([]),
});

export const RunAnalysisSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
});

export const SendParentReportSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
});

export const AskClarificationSchema = z.object({
  question: z.string().min(1, "Clarification question is required"),
});
