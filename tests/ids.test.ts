import { describe, it, expect } from "vitest";
import {
  formatStudentId,
  parseStudentId,
  getStudentIdPrefix,
  syntheticEmailFromId,
} from "@/lib/ids/generator";
import { normalizeSriLankanPhone, isValidSriLankanPhone } from "@/lib/whatsapp/phone";

describe("Student ID Generator & Parser", () => {
  it("formats IDs properly according to blueprint specification", () => {
    expect(formatStudentId(10, "TP", 1001)).toBe("MCG10TP1001");
    expect(formatStudentId(11, "T", 1002)).toBe("MCG11T1002");
    expect(formatStudentId(6, "TP", 1005)).toBe("MCG6TP1005");
  });

  it("parses valid student IDs correctly", () => {
    const parsed = parseStudentId("MCG10TP1001");
    expect(parsed.valid).toBe(true);
    expect(parsed.grade).toBe(10);
    expect(parsed.classType).toBe("TP");
    expect(parsed.serial).toBe(1001);

    const parsedGrade9 = parseStudentId("MCG9T1050");
    expect(parsedGrade9.valid).toBe(true);
    expect(parsedGrade9.grade).toBe(9);
    expect(parsedGrade9.classType).toBe("T");
    expect(parsedGrade9.serial).toBe(1050);
  });

  it("generates correct synthetic email for student auth", () => {
    expect(syntheticEmailFromId("MCG10TP1001")).toBe(
      "mcg10tp1001@students.mcmaths.lk"
    );
    expect(syntheticEmailFromId("  mcg11t1050  ")).toBe(
      "mcg11t1050@students.mcmaths.lk"
    );
  });

  it("rejects invalid student IDs", () => {
    expect(parseStudentId("INVALID").valid).toBe(false);
    expect(parseStudentId("MCG5T1001").valid).toBe(false); // Grade 5 not in 6-13
    expect(parseStudentId("MCG14T1001").valid).toBe(false); // Grade 14 not in 6-13
    expect(parseStudentId("MCG10X1001").valid).toBe(false); // X not T or TP
  });

  it("simulates 50 parallel sign-ups producing 50 distinct sequential unique IDs without collision", async () => {
    // Simulating atomic Postgres counter sequence:
    // create table id_counters (prefix text primary key, last_value int);
    // insert into id_counters ... on conflict (prefix) do update set last_value = id_counters.last_value + 1
    class AtomicCounterPool {
      private counters: Map<string, number> = new Map();
      private mutex: Promise<void> = Promise.resolve();

      async getNextId(prefix: string): Promise<string> {
        let releaseMutex: () => void;
        const currentMutex = this.mutex;
        this.mutex = new Promise<void>((resolve) => {
          releaseMutex = resolve;
        });

        await currentMutex;
        try {
          // Atomic update simulation matching Postgres row-lock transaction
          const current = this.counters.get(prefix) ?? 1000;
          const next = current + 1;
          this.counters.set(prefix, next);
          return `${prefix}${next}`;
        } finally {
          releaseMutex!();
        }
      }
    }

    const pool = new AtomicCounterPool();
    const prefix = getStudentIdPrefix(10, "TP");

    // Launch 50 simultaneous parallel sign-up calls
    const parallelRequests = Array.from({ length: 50 }, () =>
      pool.getNextId(prefix)
    );

    const generatedIds = await Promise.all(parallelRequests);

    // 1. All 50 IDs must be unique
    const uniqueSet = new Set(generatedIds);
    expect(uniqueSet.size).toBe(50);

    // 2. IDs must be sequentially contiguous from 1001 to 1050
    const serialNumbers = generatedIds.map(
      (id) => parseStudentId(id).serial!
    ).sort((a, b) => a - b);

    expect(serialNumbers[0]).toBe(1001);
    expect(serialNumbers[49]).toBe(1050);

    for (let i = 0; i < 50; i++) {
      expect(serialNumbers[i]).toBe(1001 + i);
    }
  });
});

describe("Sri Lankan Phone Validator & Normalizer (E.164)", () => {
  it("normalizes various valid Sri Lankan formats to +94 E.164", () => {
    expect(normalizeSriLankanPhone("0771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("077 123 4567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("077-123-4567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("+94771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("94771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("0094771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("771234567")).toBe("+94771234567");
  });

  it("validates valid Sri Lankan phone numbers", () => {
    expect(isValidSriLankanPhone("0771234567")).toBe(true);
    expect(isValidSriLankanPhone("+94718889999")).toBe(true);
    expect(isValidSriLankanPhone("070 333 4444")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidSriLankanPhone("")).toBe(false);
    expect(isValidSriLankanPhone("12345")).toBe(false);
    expect(isValidSriLankanPhone("077123456789")).toBe(false); // Too many digits
    expect(isValidSriLankanPhone("+14155552671")).toBe(false); // US number
    expect(isValidSriLankanPhone("abcdefghij")).toBe(false);
  });
});
