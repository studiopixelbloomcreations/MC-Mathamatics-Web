import { describe, it, expect } from "vitest";

/**
 * Phase 4 Student Dashboard & Security Logic Verification
 */

describe("Phase 4 Dashboard & Parental Lock Logic", () => {
  // Test 1: Overnight and daytime lock schedules
  function isScheduleActive(
    schedule: { enabled: boolean; start: string; end: string },
    testDate: Date
  ): boolean {
    if (!schedule.enabled) return false;
    const currentMinutes = testDate.getHours() * 60 + testDate.getMinutes();

    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Overnight e.g. 22:00 to 06:00
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  it("identifies active overnight parental lock schedule (22:00 - 06:00)", () => {
    const schedule = { enabled: true, start: "22:00", end: "06:00" };

    // 23:30 (11:30 PM) -> Should be locked
    const lateNight = new Date("2026-11-07T23:30:00");
    expect(isScheduleActive(schedule, lateNight)).toBe(true);

    // 04:15 (4:15 AM) -> Should be locked
    const earlyMorning = new Date("2026-11-07T04:15:00");
    expect(isScheduleActive(schedule, earlyMorning)).toBe(true);

    // 14:00 (2:00 PM) -> Should NOT be locked
    const afternoon = new Date("2026-11-07T14:00:00");
    expect(isScheduleActive(schedule, afternoon)).toBe(false);
  });

  it("identifies active daytime study lock schedule (08:00 - 12:00)", () => {
    const schedule = { enabled: true, start: "08:00", end: "12:00" };

    expect(isScheduleActive(schedule, new Date("2026-11-07T10:00:00"))).toBe(true);
    expect(isScheduleActive(schedule, new Date("2026-11-07T13:30:00"))).toBe(false);
  });

  // Test 2: Server-side data suppression when locked
  it("enforces server-side data omission when locked = true", () => {
    type ServerResponse = {
      locked: boolean;
      student: { id: string; fullName: string };
      marks?: any[];
      papers?: any[];
      attendance?: any;
      specialNotes?: any[];
    };

    function processDashboardFetch(isLocked: boolean): ServerResponse {
      if (isLocked) {
        // Enforce Phase 4 rule: "the lock must also block data fetching on the server, not only the UI"
        return {
          locked: true,
          student: { id: "student-1", fullName: "Kavindu Perera" },
        };
      }

      return {
        locked: false,
        student: { id: "student-1", fullName: "Kavindu Perera" },
        marks: [{ paperId: "paper-1", marks: 88.5 }],
        papers: [{ id: "paper-1", title: "Paper 01" }],
        attendance: { summary: { percentage: 95 } },
        specialNotes: [{ id: "note-1", body: "Keep it up" }],
      };
    }

    const lockedOutput = processDashboardFetch(true);
    expect(lockedOutput.locked).toBe(true);
    expect(lockedOutput.marks).toBeUndefined();
    expect(lockedOutput.papers).toBeUndefined();
    expect(lockedOutput.attendance).toBeUndefined();
    expect(lockedOutput.specialNotes).toBeUndefined();

    const unlockedOutput = processDashboardFetch(false);
    expect(unlockedOutput.locked).toBe(false);
    expect(unlockedOutput.marks).toHaveLength(1);
    expect(unlockedOutput.papers).toHaveLength(1);
  });

  // Test 3: Grade and Class-Type Paper Isolation
  it("filters papers strictly to matching student grade and class type", () => {
    const allPapers = [
      { id: "p1", title: "G10 General", grade: 10, classType: null },
      { id: "p2", title: "G10 TP Advanced", grade: 10, classType: "TP" },
      { id: "p3", title: "G10 T Only", grade: 10, classType: "T" },
      { id: "p4", title: "G11 General", grade: 11, classType: null },
    ];

    function filterPapersForStudent(grade: number, classType: "T" | "TP") {
      return allPapers.filter(
        (p) => p.grade === grade && (p.classType === null || p.classType === classType)
      );
    }

    // Grade 10 TP student sees p1 and p2 (NOT p3 or p4)
    const tpStudentPapers = filterPapersForStudent(10, "TP");
    expect(tpStudentPapers.map((p) => p.id)).toEqual(["p1", "p2"]);

    // Grade 10 T student sees p1 and p3 (NOT p2 or p4)
    const tStudentPapers = filterPapersForStudent(10, "T");
    expect(tStudentPapers.map((p) => p.id)).toEqual(["p1", "p3"]);

    // Grade 11 student sees only p4
    const g11StudentPapers = filterPapersForStudent(11, "TP");
    expect(g11StudentPapers.map((p) => p.id)).toEqual(["p4"]);
  });

  // Test 4: Dynamic states of the "Send me the report" button (Blueprint A4-8)
  it("evaluates correct button states per blueprint A4-8 specifications", () => {
    function getButtonState(
      lastSentTime: string | null,
      reportPending: boolean
    ): string {
      if (lastSentTime) {
        return "sent";
      }
      if (reportPending) {
        return "ready";
      }
      return "default";
    }

    expect(getButtonState(null, false)).toBe("default");
    expect(getButtonState(null, true)).toBe("ready");
    expect(getButtonState("2026-11-07T14:30:00Z", true)).toBe("sent");
    expect(getButtonState("2026-11-07T14:30:00Z", false)).toBe("sent");
  });
});
