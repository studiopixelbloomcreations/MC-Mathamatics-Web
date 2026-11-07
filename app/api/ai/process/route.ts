import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NvidiaNimProvider } from "@/lib/ai/nvidia-nim";
import { validateToolCall } from "@/lib/ai/validator";
import { executeToolCall } from "@/lib/ai/executor";
import { whatsapp } from "@/lib/whatsapp/client";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  const expectedSecret = process.env.INTERNAL_PROCESS_SECRET || "internal_secret_key";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 1. Fetch system settings
  const { data: settings } = await supabase
    .from("system_settings")
    .select("ai_mode, ai_confirm_required, admin_whatsapp")
    .eq("id", 1)
    .single();

  const adminPhone = settings?.admin_whatsapp || "+94771234567";

  // 2. Fetch pending unprocessed inbound messages from Sir
  const { data: pendingMessages } = await supabase
    .from("inbound_messages")
    .select("*")
    .eq("status", "received")
    .order("received_at", { ascending: true })
    .limit(5);

  if (!pendingMessages || pendingMessages.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const aiProvider = new NvidiaNimProvider();

  for (const msg of pendingMessages) {
    const rawText = msg.body?.trim() || "";

    // If AI Mode is OFF
    if (!settings?.ai_mode) {
      await whatsapp.sendText(
        adminPhone,
        "⚠️ AI Mode is currently OFF. Turn it on in the admin panel to use WhatsApp autonomous control."
      );
      await supabase
        .from("inbound_messages")
        .update({ status: "processed" })
        .eq("wa_message_id", msg.wa_message_id);
      continue;
    }

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
          // Confirm & execute
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

          await whatsapp.sendText(adminPhone, `✅ Confirmed & Executed:\n${results.join("\n")}`);
        } else {
          // Cancel
          await supabase
            .from("ai_actions")
            .update({ status: "cancelled" })
            .eq("id", pendingAction.id);

          await whatsapp.sendText(adminPhone, "🚫 In-flight action was cancelled.");
        }

        await supabase
          .from("inbound_messages")
          .update({ status: "processed" })
          .eq("wa_message_id", msg.wa_message_id);
        continue;
      }
    }

    // 3. Parse tool calls using AI Provider
    const toolCalls = await aiProvider.generateToolCalls(rawText);

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
        adminPhone,
        `❌ Could not process message:\n${errors}\n\nPlease verify student IDs and try again.`
      );

      await supabase
        .from("inbound_messages")
        .update({ status: "failed" })
        .eq("wa_message_id", msg.wa_message_id);
      continue;
    }

    // 5. If confirmation is required, send preview
    if (settings.ai_confirm_required) {
      const previews = validationPlans.map((p, i) => `${i + 1}. ${p.previewSummary}`).join("\n");

      // Save previewed state in ai_actions
      await supabase.from("ai_actions").insert({
        wa_message_id: msg.wa_message_id,
        raw_text: rawText,
        tool_calls: toolCalls,
        result: { previews },
        status: "previewed",
      });

      await whatsapp.sendInteractiveButtons(
        adminPhone,
        `📋 AI Action Preview:\n\n${previews}\n\nExecute these changes?`,
        [
          { id: "1", title: "1. Confirm & Save" },
          { id: "2", title: "2. Cancel" },
        ]
      );
    } else {
      // Auto-confirm & execute immediately
      const summaries: string[] = [];
      for (const plan of validationPlans) {
        const res = await executeToolCall(plan, rawText, msg.wa_message_id);
        summaries.push(res.summary);
      }

      await whatsapp.sendText(
        adminPhone,
        `🤖 AI Mode Executed:\n${summaries.join("\n")}`
      );
    }

    await supabase
      .from("inbound_messages")
      .update({ status: "processed" })
      .eq("wa_message_id", msg.wa_message_id);
  }

  return NextResponse.json({ processed: pendingMessages.length });
}
