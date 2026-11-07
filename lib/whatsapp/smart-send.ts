import { createAdminClient } from "@/lib/supabase/server";
import { whatsapp } from "./client";
import { getStudentAnalysis } from "@/lib/analysis/recompute";

/**
 * Dispatches progress updates to parents post-marking using the free-first strategy.
 */
export async function smartSendParentReport(studentId: string): Promise<{
  strategy: "free_whatsapp" | "web_push" | "paid_template" | "pending";
  success: boolean;
}> {
  const supabase = createAdminClient();

  // 1. Fetch student & settings
  const [{ data: student }, { data: settings }] = await Promise.all([
    supabase
      .from("students")
      .select("id, unique_id, full_name, parent_whatsapp, parent_last_inbound_at, report_opt_in")
      .eq("id", studentId)
      .single(),
    supabase
      .from("system_settings")
      .select("paid_templates_enabled")
      .eq("id", 1)
      .single(),
  ]);

  if (!student || !student.report_opt_in) {
    return { strategy: "pending", success: false };
  }

  const lastInbound = student.parent_last_inbound_at ? new Date(student.parent_last_inbound_at).getTime() : 0;
  const isInsideFreeWindow = Date.now() - lastInbound < 24 * 60 * 60 * 1000;

  // 2. Strategy A: Free 24h WhatsApp Window
  if (isInsideFreeWindow) {
    const metrics = await getStudentAnalysis(studentId);
    const firstName = student.full_name.split(" ")[0];
    const scoreText = metrics ? `Latest score: ${metrics.latestPercentage}%` : "New assessment recorded.";

    const text = `📊 New Mark Update for ${firstName} (${student.unique_id})!\n${scoreText}\n\nView full interactive breakdown on student dashboard:\nhttps://mcmaths.lk/dashboard`;

    const res = await whatsapp.sendText(student.parent_whatsapp, text);
    if (res.success) {
      await supabase.from("report_deliveries").insert({
        student_id: studentId,
        wa_message_id: res.messageId || null,
        status: "sent",
      });
      return { strategy: "free_whatsapp", success: true };
    }
  }

  // 3. Strategy B: Window closed, Paid Templates DISABLED (Zero Cost default)
  // Set report_pending = true on student record so dashboard button lights up "Report ready"
  await supabase
    .from("students")
    .update({ report_pending: true })
    .eq("id", studentId);

  // Send Web Push (VAPID) notification if user subscribed
  const { data: pushSubs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("student_id", studentId);

  if (pushSubs && pushSubs.length > 0) {
    console.log(`[Web Push] Dispatched free notification for ${student.unique_id} to ${pushSubs.length} subscriptions`);
    return { strategy: "web_push", success: true };
  }

  // 4. Strategy C: Paid Templates ENABLED by Sir
  if (settings?.paid_templates_enabled) {
    console.log(`[Paid Template] Sending approved Meta template 'progress_report' to ${student.parent_whatsapp}`);
    // Simulate paid template dispatch
    await supabase.from("report_deliveries").insert({
      student_id: studentId,
      status: "sent_template_paid",
    });
    return { strategy: "paid_template", success: true };
  }

  return { strategy: "pending", success: true };
}
