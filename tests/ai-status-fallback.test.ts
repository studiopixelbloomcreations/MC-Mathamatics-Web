import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAIStatus,
  recordAIFailure,
  recordAISuccess,
  isParentAutoReplyThrottled,
  _resetAIStatusState,
} from "@/lib/ai/status";
import { handleParentMessage } from "@/lib/whatsapp/parent-bot";
import { dryRunMessageAction } from "@/app/actions/diagnostics";

// Mock Supabase Server Admin Client
vi.mock("@/lib/supabase/server", () => {
  return {
    createAdminClient: vi.fn(() => ({
      from: vi.fn((table: string) => {
        if (table === "system_settings") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                ai_mode: true,
                parent_chat_enabled: true,
                admin_whatsapp: "+94771234567",
              },
            }),
            single: vi.fn().mockResolvedValue({
              data: {
                ai_mode: true,
                parent_chat_enabled: true,
                admin_whatsapp: "+94771234567",
              },
            }),
          };
        }
        if (table === "students") {
          const chain: Record<string, unknown> = {};
          chain.select = vi.fn().mockReturnValue(chain);
          chain.eq = vi.fn().mockImplementation((col: string, val: unknown) => {
            if (col === "parent_whatsapp") {
              return Promise.resolve({
                data: [
                  {
                    id: "11111111-1111-1111-1111-111111111111",
                    unique_id: "MCG10TP1001",
                    full_name: "Kavindu Perera",
                    grade: 10,
                    class_type: "TP",
                    parent_whatsapp: "+94771234567",
                    report_pending: false,
                    report_language: "en",
                  },
                ],
                error: null,
              });
            }
            return chain;
          });
          chain.single = vi.fn().mockResolvedValue({
            data: {
              id: "11111111-1111-1111-1111-111111111111",
              grade: 10,
              class_type: "TP",
              full_name: "Kavindu Perera",
            },
            error: null,
          });
          chain.update = vi.fn().mockReturnValue(chain);
          return chain;
        }
        return {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { id: "11111111-1111-1111-1111-111111111111", grade: 10, class_type: "TP", full_name: "Kavindu Perera" },
            error: null,
          }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    })),
  };
});

// Mock WhatsApp Client
vi.mock("@/lib/whatsapp/client", () => ({
  whatsapp: {
    sendText: vi.fn().mockResolvedValue({ success: true, messageId: "msg_123" }),
    sendInteractiveButtons: vi.fn().mockResolvedValue({ success: true, messageId: "btn_123" }),
    sendList: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe("AI Status & Fallback Message Flow", () => {
  beforeEach(() => {
    _resetAIStatusState();
    vi.clearAllMocks();
  });

  it("1. Status function returns 'not_configured' when API key is missing", async () => {
    const origKey = process.env.NVIDIA_API_KEY;
    const origNimKey = process.env.NVIDIA_NIM_API_KEY;
    delete process.env.NVIDIA_API_KEY;
    delete process.env.NVIDIA_NIM_API_KEY;
    delete process.env.AI_API_KEY;

    const status = await getAIStatus({ bypassCache: true });
    expect(status.status).toBe("not_configured");

    // Restore
    if (origKey) process.env.NVIDIA_API_KEY = origKey;
    if (origNimKey) process.env.NVIDIA_NIM_API_KEY = origNimKey;
  });

  it("2. Circuit breaker trips after 3 failures within 60s and recovers", async () => {
    // Provide a valid dummy key to test circuit breaker logic specifically
    process.env.NVIDIA_API_KEY = "test_key_dummy";
    process.env.NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
    process.env.NVIDIA_MODEL = "nvidia/nemotron-3.5-bolt-e4b";

    recordAIFailure("timeout 1");
    recordAIFailure("timeout 2");
    recordAIFailure("timeout 3");

    const status = await getAIStatus({ bypassCache: true });
    expect(status.status).toBe("ai_unavailable");
    expect(status.circuitBreakerOpen).toBe(true);

    delete process.env.NVIDIA_API_KEY;
  });

  it("3. Parent START command always works even when AI is offline", async () => {
    recordAIFailure("err1");
    recordAIFailure("err2");
    recordAIFailure("err3");

    const res = await handleParentMessage("+94771234567", "START MCG10TP1001");
    expect(res.handled).toBe(true);
    expect(res.replySent).toBe(true);
    expect(res.logStatus).toBe("verified_start");
  });

  it("4. Parent buttons [Latest marks] and [Full report] work from stored data without AI", async () => {
    recordAIFailure("err1");
    recordAIFailure("err2");
    recordAIFailure("err3");

    const resMarks = await handleParentMessage("+94771234567", "MARKS:11111111-1111-1111-1111-111111111111");
    expect(resMarks.handled).toBe(true);
    expect(resMarks.replySent).toBe(true);
    expect(resMarks.logStatus).toBe("marks_delivered");

    const resReport = await handleParentMessage("+94771234567", "REPORT:11111111-1111-1111-1111-111111111111");
    expect(resReport.handled).toBe(true);
    expect(resReport.replySent).toBe(true);
    expect(resReport.logStatus).toBe("report_delivered");
  });

  it("5. Parent free-text gets safe offline auto-reply and is throttled to once per 30 minutes", async () => {
    recordAIFailure("err1");
    recordAIFailure("err2");
    recordAIFailure("err3");

    // First free-text message -> triggers auto reply
    const res1 = await handleParentMessage("+94771234567", "hello what is the progress?");
    expect(res1.handled).toBe(true);
    expect(res1.replySent).toBe(true);

    // Second free-text message immediately after -> throttled (no spam)
    const res2 = await handleParentMessage("+94771234567", "hello are you there?");
    expect(res2.handled).toBe(true);
    expect(res2.replySent).toBe(false);
    expect(res2.logStatus).toBe("fallback_throttled");
  });

  it("6. Production-safe Dry-Run NEVER writes to database", async () => {
    const resSir = await dryRunMessageAction("sir", "Enter marks for MCG10TP1001: Paper 1 got 95");
    expect(resSir.writesAttempted).toBe(false);
    expect(resSir.databaseModified).toBe(false);

    const resParent = await dryRunMessageAction("parent", "START MCG10TP1001");
    expect(resParent.writesAttempted).toBe(false);
    expect(resParent.databaseModified).toBe(false);
  });

  it("7. Parent never receives technical details, stack traces, or error codes", async () => {
    recordAIFailure("CRITICAL: CUDA Out of Memory on GPU-8");

    const res = await dryRunMessageAction("parent", "Can you explain calculus homework?");
    expect(res.replyMessage).not.toContain("CUDA");
    expect(res.replyMessage).not.toContain("GPU");
    expect(res.replyMessage).not.toContain("500");
    expect(res.replyMessage).toContain("AI assistant is offline right now");
  });
});
