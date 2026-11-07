import { describe, it, expect } from "vitest";
import { formatStudentId, parseStudentId } from "@/lib/ids/generator";

describe("Student ID Generator & Parser", () => {
  it("formats IDs properly according to specification", () => {
    expect(formatStudentId(10, "TP", 1001)).toBe("MCG10TP1001");
    expect(formatStudentId(11, "T", 1002)).toBe("MCG11T1002");
  });

  it("parses valid student IDs correctly", () => {
    const parsed = parseStudentId("MCG10TP1001");
    expect(parsed.valid).toBe(true);
    expect(parsed.grade).toBe(10);
    expect(parsed.classType).toBe("TP");
    expect(parsed.serial).toBe(1001);
  });

  it("rejects invalid IDs", () => {
    expect(parseStudentId("INVALID").valid).toBe(false);
    expect(parseStudentId("MCG5T1001").valid).toBe(false); // Grade 5 not in 6-13
  });
});
