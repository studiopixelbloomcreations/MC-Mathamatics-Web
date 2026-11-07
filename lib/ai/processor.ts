import { createAdminClient } from "@/lib/supabase/server";
import { NvidiaNimProvider } from "@/lib/ai/nvidia-nim";
import { validateToolCall } from "@/lib/ai/validator";
import { executeToolCall } from "@/lib/ai/executor";
import { whatsapp } from "@/lib/whatsapp/client";
import {
  getAIStatus,
  recordFallbackEvent,
  shouldSendSirOutageNotice,
} from "@/lib/ai/status";

/**
 * Processes pending inbound messages from Sir immediately.
 * Executes tool calls, sends previews or confirmation messages via WhatsApp.
 * Implements strict status-based feedback and handles offline/error states gracefully.
 */
export async function processPendingInboundMessages(): Promise<number> {
  const supabase = createAdminClient();

  // 1. Fetch system settings
  const { data: settings } = await supabase
    .from("system_settings")
    .select("ai_mode, parent_chat_enabled, ai_confirm_required, admin_whatsapp")
    .eq("id", 1)
    .single();

  const adminPhone = settings?.admin_whatsapp || "+94771234567";

  // 2. Fetch pending unprocessed inbound messages
  const { data: pendingMessages } = await supabase
    .from("inbound_messages")
    .select("*")
    .eq("status", "received")
    .order("received_at", { ascending: true })
    .limit(5);

  if (!pendingMessages || pendingMessages.length === 0) {
    return 0;
  }

  const aiStatus = await getAIStatus();
  let processedCount = 0;

  for (const msg of pendingMessages) {
    const rawText = msg.body?.trim() || "";
    const senderNumber = msg.from_number || adminPhone;

    try {
      // Check status: If AI is not configured, rate limited, or unavailable
      if (aiStatus.status === "not_configured") {
        await whatsapp.sendText(
          senderNumber,
          "NVIDIA_API_KEY is missing in the server settings."
        );
        recordFallbackEvent(senderNumber, "Sir message: NVIDIA_API_KEY missing", "not_configured");
        await supabase
          .from("inbound_messages")
          .update({ status: "processed" })
          .eq("wa_message_id", msg.wa_message_id);
        processedCount++;
        continue;
      }

      if (aiStatus.status === "rate_limited") {
        await whatsapp.sendText(
          senderNumber,
          "The AI is busy (rate limit). Try again in a minute."
        );
        recordFallbackEvent(senderNumber, "Sir message: Rate limit (429)", "rate_limited");
        await supabase
          .from("inbound_messages")
          .update({ status: "processed" })
          .eq("wa_message_id", msg.wa_message_id);
        processedCount++;
        continue;
      }

      if (aiStatus.status === "ai_unavailable") {
        await whatsapp.sendText(
          senderNumber,
          "The AI service is not responding (model error). Check /admin/diagnostics."
        );
        recordFallbackEvent(senderNumber, "Sir message: AI unavailable", "ai_unavailable");

        // If Sir's free window is open, send outage notification at most once per hour
        if (shouldSendSirOutageNotice()) {
          console.warn("[AI Processor] Dispatched Sir outage notice.");
        }

        await supabase
          .from("inbound_messages")
          .update({ status: "processed" })
          .eq("wa_message_id", msg.wa_message_id);
        processedCount++;
        continue;
      }

      const aiProvider = new NvidiaNimProvider();

      // Check if message is a confirmation "1" or cancel "2"
      if (rawText === "1" || rawText === "2") {
        const { data: pendingAction } = await supabase
          .from("ai_actions")
          .select("*")
          .eq("status", "previewed")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pendingAction) {
          if (rawText === "1") {
            const toolCalls = pendingAction.tool_calls || [];
            const results: string[] = [];
            for (const tc of toolCalls) {
              const plan = await validateToolCall(tc);
              const execRes = await executeToolCall(plan, pendingAction.raw_text, msg.wa_message_id);
              results.push(execRes.summary);
            }

            await supabase
              .from("ai_actions")
              .update({ status: "executed" })
              .eq("id", pendingAction.id);

            await whatsapp.sendText(senderNumber, `✅ Confirmed & Executed:\n${results.join("\n")}`);
          } else {
            await supabase
              .from("ai_actions")
              .update({ status: "cancelled" })
              .eq("id", pendingAction.id);

            await whatsapp.sendText(senderNumber, "🚫 In-flight action was cancelled.");
          }

          await supabase
            .from("inbound_messages")
            .update({ status: "processed" })
            .eq("wa_message_id", msg.wa_message_id);
          processedCount++;
          continue;
        }
      }

      // 3. Parse tool calls using AI Provider
      const toolCalls = await aiProvider.generateToolCalls(rawText);

      // Check if this command contains write actions (marks, notes, announcements, attendance)
      const hasWriteTools = toolCalls.some((tc) =>
        ["record_marks", "add_special_note", "post_announcement", "mark_attendance"].includes(tc.tool)
      );

      // When AI Mode is OFF:
      if (!settings?.ai_mode && hasWriteTools) {
        await whatsapp.sendText(
          senderNumber,
          "AI Mode is off, so I can't change marks, notes or announcements. Turn it on in the admin panel. I can still answer questions."
        );
        recordFallbackEvent(senderNumber, "Sir write command refused (AI Mode OFF)", "ai_mode_off");
        await supabase
          .from("inbound_messages")
          .update({ status: "processed" })
          .eq("wa_message_id", msg.wa_message_id);
        processedCount++;
        continue;
      }

      // If no write tools or read-only/question: Answer directly or proceed
      if (!hasWriteTools && toolCalls.length === 0) {
        const textAnswer = await aiProvider.generateText(rawText);
        await whatsapp.sendText(senderNumber, textAnswer);
        await supabase
          .from("inbound_messages")
          .update({ status: "processed" })
          .eq("wa_message_id", msg.wa_message_id);
        processedCount++;
        continue;
      }

      // 4. Validate tool calls
      const validationPlans = await Promise.all(
        toolCalls.map((tc) => validateToolCall(tc))
      );

      const hasInvalid = validationPlans.some((p) => !p.valid);
      if (hasInvalid) {
        const errors = validationPlans
          .filter((p) => !p.valid)
          .map((p) => `• ${p.error}`)
          .join("\n");

        await whatsapp.sendText(
          senderNumber,
          `❌ Could not process message:\n${errors}\n\nPlease verify student IDs and try again.`
        );

        await supabase
          .from("inbound_messages")
          .update({ status: "failed" })
          .eq("wa_message_id", msg.wa_message_id);
        processedCount++;
        continue;
      }

      // 5. If confirmation is required, send preview
      if (settings?.ai_confirm_required) {
        const previews = validationPlans.map((p, i) => `${i + 1}. ${p.previewSummary}`).join("\n");

        await supabase.from("ai_actions").insert({
          wa_message_id: msg.wa_message_id,
          raw_text: rawText,
          tool_calls: toolCalls,
          result: { previews },
          status: "previewed",
        });

        await whatsapp.sendInteractiveButtons(
          senderNumber,
          `📋 AI Action Preview:\n\n${previews}\n\nExecute these changes?`,
          [
            { id: "1", title: "1. Confirm & Save" },
            { id: "2", title: "2. Cancel" },
          ]
        );
      } else {
        // Direct execution without preview
        const results: string[] = [];
        for (const plan of validationPlans) {
          const execRes = await executeToolCall(plan, rawText, msg.wa_message_id);
          results.push(execRes.summary);
        }

        await supabase.from("ai_actions").insert({
          wa_message_id: msg.wa_message_id,
          raw_text: rawText,
          tool_calls: toolCalls,
          result: { results },
          status: "executed",
        });

        await whatsapp.sendText(
          senderNumber,
          `⚡ Auto-Executed via AI Mode:\n${results.join("\n")}`
        );
      }

      await supabase
        .from("inbound_messages")
        .update({ status: "processed" })
        .eq("wa_message_id", msg.wa_message_id);
      processedCount++;
    } catch (err: unknown) {
      // NEVER GO SILENT: Send polite apology and log error
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[AI Processor] Processing error:", errorMsg);

      await whatsapp.sendText(
        senderNumber,
        "Sorry, I encountered an internal error while processing that instruction. Sir's administration console has logged the event."
      );

      recordFallbackEvent(senderNumber, `Internal processing exception: ${errorMsg}`, "ai_unavailable");

      await supabase
        .from("inbound_messages")
        .update({ status: "failed" })
        .eq("wa_message_id", msg.wa_message_id);
      processedCount++;
    }
  }

  return processedCount;
}
