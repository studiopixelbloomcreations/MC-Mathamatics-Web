import { describe, expect, it } from "vitest";
import { normalizeSriLankanPhone, isValidSriLankanPhone } from "../lib/whatsapp/phone";

describe("Phase 8: Parent Bot - Sri Lankan E.164 Phone Normalizer", () => {
  it("normalizes standard Sri Lankan formats to E.164 (+94...)", () => {
    expect(normalizeSriLankanPhone("0771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("+94 77 123 4567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("0094771234567")).toBe("+94771234567");
    expect(normalizeSriLankanPhone("94771234567")).toBe("+94771234567");
  });

  it("rejects invalid, short, or foreign numbers", () => {
    expect(normalizeSriLankanPhone("")).toBeNull();
    expect(normalizeSriLankanPhone("12345")).toBeNull();
    expect(normalizeSriLankanPhone("+14155552671")).toBeNull();
    expect(isValidSriLankanPhone("0771234567")).toBe(true);
    expect(isValidSriLankanPhone("invalid")).toBe(false);
  });
});

describe("Phase 8: Free-First Parent Bot Rules & Window Management", () => {
  // Free 24h window calculation
  function isFreeWindowActive(lastInboundTimestamp: string | null, now = Date.now()): boolean {
    if (!lastInboundTimestamp) return false;
    const lastInbound = new Date(lastInboundTimestamp).getTime();
    return now - lastInbound < 24 * 60 * 60 * 1000;
  }

  it("identifies active 24-hour free messaging window", () => {
    // 2 hours ago -> active
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(isFreeWindowActive(twoHoursAgo)).toBe(true);

    // 23 hours ago -> active
    const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
    expect(isFreeWindowActive(twentyThreeHoursAgo)).toBe(true);

    // 25 hours ago -> expired
    const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    expect(isFreeWindowActive(twentyFiveHoursAgo)).toBe(false);

    // never inbound -> inactive
    expect(isFreeWindowActive(null)).toBe(false);
  });

  it("parses parent bot inbound intent commands", () => {
    function parseParentIntent(message: string): "start" | "report" | "pin" | "stop" | "menu" {
      const trimmed = message.trim().toUpperCase();
      if (trimmed.startsWith("START")) return "start";
      if (trimmed.startsWith("REPORT") || trimmed.startsWith("REPORT:")) return "report";
      if (trimmed.startsWith("PIN")) return "pin";
      if (trimmed === "STOP") return "stop";
      return "menu";
    }

    expect(parseParentIntent("START MCG10TP1001")).toBe("start");
    expect(parseParentIntent("REPORT MCG10TP1001")).toBe("report");
    expect(parseParentIntent("REPORT:1234-uuid")).toBe("report");
    expect(parseParentIntent("PIN MCG10TP1001")).toBe("pin");
    expect(parseParentIntent("STOP")).toBe("stop");
    expect(parseParentIntent("Hello please send marks")).toBe("menu");
  });
});
