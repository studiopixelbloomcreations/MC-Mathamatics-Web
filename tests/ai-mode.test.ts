import { describe, expect, it } from "vitest";
import { NvidiaNimProvider } from "../lib/ai/nvidia-nim";
import {
  RecordMarksSchema,
  PostAnnouncementSchema,
  AddSpecialNoteSchema,
  MarkAttendanceSchema,
} from "../lib/ai/types";

describe("Phase 7: AI Mode - Natural Language Parser & Tool Extraction", () => {
  const provider = new NvidiaNimProvider();

  it("extracts single student mark and paper correctly", async () => {
    const raw = "MCG10TP1001 Paper 14 marks 82";
    const tools = await provider.generateToolCalls(raw);

    expect(tools.length).toBeGreaterThan(0);
    const markTool = tools.find((t) => t.tool === "record_marks");
    expect(markTool).toBeDefined();
    expect(markTool?.args.student_id).toBe("MCG10TP1001");
    expect(markTool?.args.marks).toBe(82);
  });

  it("extracts multi-student mark batch correctly", async () => {
    const raw = `Marks for Paper 14 (Grade 10 TP):
MCG10TP1001 - 82
MCG10TP1002 - 67
MCG10TP1003 - 91`;

    const tools = await provider.generateToolCalls(raw);
    expect(tools.length).toBe(3);
    expect(tools[0].args.student_id).toBe("MCG10TP1001");
    expect(tools[0].args.marks).toBe(82);
    expect(tools[1].args.student_id).toBe("MCG10TP1002");
    expect(tools[1].args.marks).toBe(67);
    expect(tools[2].args.student_id).toBe("MCG10TP1003");
    expect(tools[2].args.marks).toBe(91);
  });

  it("extracts grade-specific announcement bulletin", async () => {
    const raw = "Announcement for Grade 11: Extra class this Saturday 8am";
    const tools = await provider.generateToolCalls(raw);

    expect(tools.length).toBe(1);
    expect(tools[0].tool).toBe("post_announcement");
    expect(tools[0].args.target).toBe("grade:11");
    expect(tools[0].args.text).toContain("Extra class this Saturday 8am");
  });

  it("prompts clarification when message is ambiguous", async () => {
    const raw = "Hello Sir good morning";
    const tools = await provider.generateToolCalls(raw);

    expect(tools.length).toBe(1);
    expect(tools[0].tool).toBe("ask_clarification");
  });
});

describe("Phase 7: AI Mode - Zod Safety Schemas & Bounds Verification", () => {
  it("rejects mark entry when marks are negative", () => {
    const result = RecordMarksSchema.safeParse({
      student_id: "MCG10TP1001",
      paper_ref: "Paper 01",
      marks: -15,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid mark entry with section breakdowns", () => {
    const result = RecordMarksSchema.safeParse({
      student_id: "MCG10TP1001",
      paper_ref: "Paper 01",
      marks: 85,
      section_marks: { Algebra: 24, Geometry: 20 },
    });
    expect(result.success).toBe(true);
  });

  it("validates announcement schema requirements", () => {
    expect(PostAnnouncementSchema.safeParse({ text: "" }).success).toBe(false);
    expect(
      PostAnnouncementSchema.safeParse({
        text: "Special workshop",
        target: "all",
        pinned: true,
      }).success
    ).toBe(true);
  });

  it("validates attendance roll call schema", () => {
    const result = MarkAttendanceSchema.safeParse({
      date: "2026-03-10",
      session: "Morning Theory",
      present_ids: ["MCG10TP1001"],
      absent_ids: ["MCG10TP1002"],
    });
    expect(result.success).toBe(true);
  });

  it("validates special notes schema", () => {
    expect(AddSpecialNoteSchema.safeParse({ student_id: "", text: "Good" }).success).toBe(false);
    expect(
      AddSpecialNoteSchema.safeParse({
        student_id: "MCG10TP1001",
        text: "Great improvement in algebra proofs!",
      }).success
    ).toBe(true);
  });
});
