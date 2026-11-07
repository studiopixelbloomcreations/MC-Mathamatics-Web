import { describe, it, expect } from "vitest";

/**
 * Deterministic RLS Policy Logic Verification Test Suite
 * Validates the exact logic enforced by supabase/migrations/20261107000000_full_schema.sql
 */

type UserContext = {
  uid: string;
  role: "authenticated" | "anon";
  app_metadata: { role?: "admin" | "student" };
};

type StudentRecord = {
  id: string;
  unique_id: string;
  full_name: string;
  grade: number;
  class_type: "T" | "TP";
};

type PaperRecord = {
  id: string;
  title: string;
  grade: number;
  class_type: "T" | "TP" | null;
};

type MarkRecord = {
  id: string;
  student_id: string;
  paper_id: string;
  marks: number;
};

type AttendanceRecord = {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent" | "late";
};

// RLS Policy evaluator functions matching SQL definitions
function is_admin(ctx: UserContext): boolean {
  return ctx.app_metadata.role === "admin";
}

// SQL: students for select using (id = auth.uid() or is_admin())
function canSelectStudent(ctx: UserContext, targetStudent: StudentRecord): boolean {
  return is_admin(ctx) || targetStudent.id === ctx.uid;
}

// SQL: papers for select using (is_admin() or (exists (select 1 from students s where s.id = auth.uid() and s.grade = papers.grade and (papers.class_type is null or papers.class_type = s.class_type))))
function canSelectPaper(ctx: UserContext, paper: PaperRecord, student: StudentRecord | null): boolean {
  if (is_admin(ctx)) return true;
  if (!student || student.id !== ctx.uid) return false;
  const gradeMatches = student.grade === paper.grade;
  const classTypeMatches = paper.class_type === null || paper.class_type === student.class_type;
  return gradeMatches && classTypeMatches;
}

// SQL: marks for select using (student_id = auth.uid() or is_admin())
function canSelectMark(ctx: UserContext, mark: MarkRecord): boolean {
  return is_admin(ctx) || mark.student_id === ctx.uid;
}

// SQL: marks for all using (is_admin())
function canWriteMark(ctx: UserContext): boolean {
  return is_admin(ctx);
}

// SQL: attendance for select using (student_id = auth.uid() or is_admin())
function canSelectAttendance(ctx: UserContext, att: AttendanceRecord): boolean {
  return is_admin(ctx) || att.student_id === ctx.uid;
}

describe("Supabase RLS Policy Verification Suite", () => {
  const studentA_User: UserContext = {
    uid: "student-a-uuid",
    role: "authenticated",
    app_metadata: { role: "student" },
  };

  const studentB_User: UserContext = {
    uid: "student-b-uuid",
    role: "authenticated",
    app_metadata: { role: "student" },
  };

  const admin_User: UserContext = {
    uid: "admin-uuid",
    role: "authenticated",
    app_metadata: { role: "admin" },
  };

  const studentA_Profile: StudentRecord = {
    id: "student-a-uuid",
    unique_id: "MCG10TP1001",
    full_name: "Kavindu Perera",
    grade: 10,
    class_type: "TP",
  };

  const studentB_Profile: StudentRecord = {
    id: "student-b-uuid",
    unique_id: "MCG10T1002",
    full_name: "Senuri Jayasinghe",
    grade: 10,
    class_type: "T",
  };

  describe("1. Student Profile Privacy Policy", () => {
    it("allows student A to read student A's own profile", () => {
      expect(canSelectStudent(studentA_User, studentA_Profile)).toBe(true);
    });

    it("STRICTLY BLOCKS student A from reading student B's profile", () => {
      expect(canSelectStudent(studentA_User, studentB_Profile)).toBe(false);
    });

    it("allows admin to read any student profile", () => {
      expect(canSelectStudent(admin_User, studentA_Profile)).toBe(true);
      expect(canSelectStudent(admin_User, studentB_Profile)).toBe(true);
    });
  });

  describe("2. Marks & Academic Performance Isolation Policy", () => {
    const markStudentA: MarkRecord = {
      id: "mark-1",
      student_id: "student-a-uuid",
      paper_id: "paper-1",
      marks: 92.5,
    };

    const markStudentB: MarkRecord = {
      id: "mark-2",
      student_id: "student-b-uuid",
      paper_id: "paper-1",
      marks: 74.0,
    };

    it("allows student A to read only their own marks", () => {
      expect(canSelectMark(studentA_User, markStudentA)).toBe(true);
      expect(canSelectMark(studentA_User, markStudentB)).toBe(false);
    });

    it("allows student B to read only their own marks", () => {
      expect(canSelectMark(studentB_User, markStudentB)).toBe(true);
      expect(canSelectMark(studentB_User, markStudentA)).toBe(false);
    });

    it("STRICTLY BLOCKS students from inserting or modifying marks (Admin only)", () => {
      expect(canWriteMark(studentA_User)).toBe(false);
      expect(canWriteMark(studentB_User)).toBe(false);
      expect(canWriteMark(admin_User)).toBe(true);
    });
  });

  describe("3. Attendance Record Privacy Policy", () => {
    const attA: AttendanceRecord = {
      id: "att-1",
      student_id: "student-a-uuid",
      date: "2026-11-07",
      status: "present",
    };

    const attB: AttendanceRecord = {
      id: "att-2",
      student_id: "student-b-uuid",
      date: "2026-11-07",
      status: "late",
    };

    it("allows students to view only their own attendance records", () => {
      expect(canSelectAttendance(studentA_User, attA)).toBe(true);
      expect(canSelectAttendance(studentA_User, attB)).toBe(false);
    });
  });

  describe("4. Paper Access by Grade and Class Type Isolation Policy", () => {
    const grade10BothPaper: PaperRecord = {
      id: "paper-g10-both",
      title: "Grade 10 Algebra & Numbers",
      grade: 10,
      class_type: null, // applies to both T and TP
    };

    const grade10TPOnlyPaper: PaperRecord = {
      id: "paper-g10-tp",
      title: "Grade 10 Advanced Paper Drill",
      grade: 10,
      class_type: "TP", // only for TP students
    };

    const grade11Paper: PaperRecord = {
      id: "paper-g11",
      title: "Grade 11 O/L Model Paper",
      grade: 11,
      class_type: null,
    };

    it("allows Grade 10 TP student to view Grade 10 general papers and TP papers", () => {
      expect(canSelectPaper(studentA_User, grade10BothPaper, studentA_Profile)).toBe(true);
      expect(canSelectPaper(studentA_User, grade10TPOnlyPaper, studentA_Profile)).toBe(true);
    });

    it("blocks Grade 10 Theory-Only student from viewing Theory+Paper restricted papers", () => {
      // studentB is class_type: "T"
      expect(canSelectPaper(studentB_User, grade10BothPaper, studentB_Profile)).toBe(true);
      expect(canSelectPaper(studentB_User, grade10TPOnlyPaper, studentB_Profile)).toBe(false);
    });

    it("blocks Grade 10 student from viewing Grade 11 papers", () => {
      expect(canSelectPaper(studentA_User, grade11Paper, studentA_Profile)).toBe(false);
      expect(canSelectPaper(studentB_User, grade11Paper, studentB_Profile)).toBe(false);
    });

    it("grants admin full access to view all papers regardless of grade or class type", () => {
      expect(canSelectPaper(admin_User, grade10BothPaper, null)).toBe(true);
      expect(canSelectPaper(admin_User, grade10TPOnlyPaper, null)).toBe(true);
      expect(canSelectPaper(admin_User, grade11Paper, null)).toBe(true);
    });
  });
});
