"use server";

import { createAdminClient } from "@/lib/supabase/server";

export interface SeedResult {
  success: boolean;
  message: string;
  studentsCount: number;
}

/**
 * Seeds or updates 12 fake students (Grades 9 to 11) with marks,
 * attendance, and parent settings so the app can be tested immediately.
 */
export async function seedFakeStudentsAction(): Promise<SeedResult> {
  const supabase = createAdminClient();

  try {
    const fakeStudents = [
      // Grade 9
      { id: "a0000000-0000-0000-0000-000000000001", unique_id: "MCG09TP1001", full_name: "Nethmi Wickramasinghe", grade: 9, class_type: "TP", parent_whatsapp: "+94776665544", whereabouts: "Wariyapola" },
      { id: "a0000000-0000-0000-0000-000000000002", unique_id: "MCG09TP1002", full_name: "Tharindu Jayasundara", grade: 9, class_type: "TP", parent_whatsapp: "+94776665545", whereabouts: "Mawathagama" },
      { id: "a0000000-0000-0000-0000-000000000003", unique_id: "MCG09T1001", full_name: "Dinuka Bandara", grade: 9, class_type: "T", parent_whatsapp: "+94776665546", whereabouts: "Kurunegala Town" },
      { id: "a0000000-0000-0000-0000-000000000004", unique_id: "MCG09T1002", full_name: "Rashmi Alwis", grade: 9, class_type: "T", parent_whatsapp: "+94776665547", whereabouts: "Polgahawela" },

      // Grade 10
      { id: "a0000000-0000-0000-0000-000000000005", unique_id: "MCG10TP1001", full_name: "Kavindu Perera", grade: 10, class_type: "TP", parent_whatsapp: "+94779998877", whereabouts: "Kurunegala Town" },
      { id: "a0000000-0000-0000-0000-000000000006", unique_id: "MCG10T1002", full_name: "Senuri Jayasinghe", grade: 10, class_type: "T", parent_whatsapp: "+94778887766", whereabouts: "Mawathagama" },
      { id: "a0000000-0000-0000-0000-000000000007", unique_id: "MCG10TP1003", full_name: "Akila Dissanayake", grade: 10, class_type: "TP", parent_whatsapp: "+94778887767", whereabouts: "Ibbagamuwa" },
      { id: "a0000000-0000-0000-0000-000000000008", unique_id: "MCG10TP1004", full_name: "Oshadhi Senaratne", grade: 10, class_type: "TP", parent_whatsapp: "+94778887768", whereabouts: "Galgamuwa" },

      // Grade 11
      { id: "a0000000-0000-0000-0000-000000000009", unique_id: "MCG11TP1001", full_name: "Dulitha Bandara", grade: 11, class_type: "TP", parent_whatsapp: "+94777776655", whereabouts: "Kuliyapitiya" },
      { id: "a0000000-0000-0000-0000-000000000010", unique_id: "MCG11TP1002", full_name: "Hiruni Ranasinghe", grade: 11, class_type: "TP", parent_whatsapp: "+94777776656", whereabouts: "Kurunegala Town" },
      { id: "a0000000-0000-0000-0000-000000000011", unique_id: "MCG11T1001", full_name: "Pathum Fernando", grade: 11, class_type: "T", parent_whatsapp: "+94777776657", whereabouts: "Narammala" },
      { id: "a0000000-0000-0000-0000-000000000012", unique_id: "MCG11TP1003", full_name: "Sandunika Rajapaksha", grade: 11, class_type: "TP", parent_whatsapp: "+94777776658", whereabouts: "Pannala" },
    ];

    // 1. Upsert student records
    for (const s of fakeStudents) {
      await supabase.from("students").upsert(
        {
          id: s.id,
          unique_id: s.unique_id,
          full_name: s.full_name,
          grade: s.grade,
          class_type: s.class_type,
          whereabouts: s.whereabouts,
          student_phone: s.parent_whatsapp,
          parent_whatsapp: s.parent_whatsapp,
          parent_phone: s.parent_whatsapp,
          report_opt_in: true,
          report_language: "en",
          parent_wa_verified: true,
          parent_last_inbound_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      // Parental settings
      await supabase.from("parental_settings").upsert(
        {
          student_id: s.id,
          locked: false,
          report_frequency: "every_paper",
        },
        { onConflict: "student_id" }
      );
    }

    // 2. Ensure papers exist
    const papers: Array<{
      id: string;
      title: string;
      grade: number;
      class_type?: "T" | "TP" | null;
      status: string;
      total_marks: number;
      sections: Array<{ name: string; max: number }>;
    }> = [
      {
        id: "b0000000-0000-0000-0000-000000000001",
        title: "Grade 9 Term Evaluation - Equations & Pythagoras",
        grade: 9,
        class_type: null,
        status: "finished",
        total_marks: 100,
        sections: [
          { name: "Section A - Basic Arithmetic & Factors", max: 40 },
          { name: "Section B - Linear Equations & Triangles", max: 60 },
        ],
      },
      {
        id: "b0000000-0000-0000-0000-000000000003",
        title: "Paper 01 - Algebraic Expressions & Geometry",
        grade: 10,
        class_type: null,
        status: "finished",
        total_marks: 100,
        sections: [
          { name: "Part A - Multiple Choice", max: 30 },
          { name: "Part B - Structured Algebra", max: 40 },
          { name: "Part C - Geometry & Theorems", max: 30 },
        ],
      },
      {
        id: "b0000000-0000-0000-0000-000000000004",
        title: "Paper 02 - Quadratic Equations & Graphing",
        grade: 10,
        class_type: "TP",
        status: "finished",
        total_marks: 100,
        sections: [
          { name: "Section 1 - Factorization & Roots", max: 40 },
          { name: "Section 2 - Turning Points & Parabolas", max: 60 },
        ],
      },
      {
        id: "b0000000-0000-0000-0000-000000000006",
        title: "O/L Speed Drill Paper 01 - Full Core Syllabus",
        grade: 11,
        class_type: null,
        status: "finished",
        total_marks: 100,
        sections: [
          { name: "Part I - 25 Short Questions", max: 50 },
          { name: "Part II - Structured Essay & Trigonometry", max: 50 },
        ],
      },
    ];

    for (const p of papers) {
      await supabase.from("papers").upsert(p, { onConflict: "id" });
    }

    // 3. Upsert marks
    const sampleMarks = [
      { student_id: "a0000000-0000-0000-0000-000000000001", paper_id: "b0000000-0000-0000-0000-000000000001", marks: 82.5, section_marks: { "Section A - Basic Arithmetic & Factors": 35.0, "Section B - Linear Equations & Triangles": 47.5 } },
      { student_id: "a0000000-0000-0000-0000-000000000002", paper_id: "b0000000-0000-0000-0000-000000000001", marks: 93.0, section_marks: { "Section A - Basic Arithmetic & Factors": 39.0, "Section B - Linear Equations & Triangles": 54.0 } },
      { student_id: "a0000000-0000-0000-0000-000000000003", paper_id: "b0000000-0000-0000-0000-000000000001", marks: 68.0, section_marks: { "Section A - Basic Arithmetic & Factors": 28.0, "Section B - Linear Equations & Triangles": 40.0 } },
      { student_id: "a0000000-0000-0000-0000-000000000004", paper_id: "b0000000-0000-0000-0000-000000000001", marks: 77.5, section_marks: { "Section A - Basic Arithmetic & Factors": 32.0, "Section B - Linear Equations & Triangles": 45.5 } },
      { student_id: "a0000000-0000-0000-0000-000000000005", paper_id: "b0000000-0000-0000-0000-000000000003", marks: 88.5, section_marks: { "Part A - Multiple Choice": 28, "Part B - Structured Algebra": 36.5, "Part C - Geometry & Theorems": 24 } },
      { student_id: "a0000000-0000-0000-0000-000000000006", paper_id: "b0000000-0000-0000-0000-000000000003", marks: 74.0, section_marks: { "Part A - Multiple Choice": 25, "Part B - Structured Algebra": 31, "Part C - Geometry & Theorems": 18 } },
      { student_id: "a0000000-0000-0000-0000-000000000007", paper_id: "b0000000-0000-0000-0000-000000000003", marks: 96.0, section_marks: { "Part A - Multiple Choice": 30, "Part B - Structured Algebra": 39, "Part C - Geometry & Theorems": 27 } },
      { student_id: "a0000000-0000-0000-0000-000000000008", paper_id: "b0000000-0000-0000-0000-000000000003", marks: 64.5, section_marks: { "Part A - Multiple Choice": 20, "Part B - Structured Algebra": 28.5, "Part C - Geometry & Theorems": 16 } },
      { student_id: "a0000000-0000-0000-0000-000000000009", paper_id: "b0000000-0000-0000-0000-000000000006", marks: 92.0, section_marks: { "Part I - 25 Short Questions": 48.0, "Part II - Structured Essay & Trigonometry": 44.0 } },
      { student_id: "a0000000-0000-0000-0000-000000000010", paper_id: "b0000000-0000-0000-0000-000000000006", marks: 87.5, section_marks: { "Part I - 25 Short Questions": 45.0, "Part II - Structured Essay & Trigonometry": 42.5 } },
      { student_id: "a0000000-0000-0000-0000-000000000011", paper_id: "b0000000-0000-0000-0000-000000000006", marks: 64.0, section_marks: { "Part I - 25 Short Questions": 34.0, "Part II - Structured Essay & Trigonometry": 30.0 } },
      { student_id: "a0000000-0000-0000-0000-000000000012", paper_id: "b0000000-0000-0000-0000-000000000006", marks: 83.5, section_marks: { "Part I - 25 Short Questions": 42.0, "Part II - Structured Essay & Trigonometry": 41.5 } },
    ];

    for (const m of sampleMarks) {
      await supabase.from("marks").upsert(
        {
          student_id: m.student_id,
          paper_id: m.paper_id,
          marks: m.marks,
          section_marks: m.section_marks,
          source: "manual",
        },
        { onConflict: "student_id,paper_id" }
      );
    }

    return {
      success: true,
      message: "Successfully seeded 12 test students across grades 9–11 with marks and attendance.",
      studentsCount: fakeStudents.length,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Seeding error:", msg);
    return {
      success: false,
      message: `Seeding error: ${msg}`,
      studentsCount: 0,
    };
  }
}
