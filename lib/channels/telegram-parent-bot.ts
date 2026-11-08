// lib/channels/telegram-parent-bot.ts
import { createAdminClient } from "@/lib/supabase/server";
import { telegramAdapter } from "./telegram";
import { getStudentAnalysis } from "@/lib/analysis/recompute";
import { formatWhatsAppReport } from "@/lib/whatsapp/parent-bot";
import { getAIStatus, isParentAutoReplyThrottled, recordFallbackEvent } from "@/lib/ai/status";

export interface TelegramParentBotResult {
  handled: boolean;
  replySent: boolean;
  logStatus: string;
}

/**
 * Handles parent interaction over Telegram.
 * Parents can link using "START <MCG-ID>" or "START <ParentPhone>".
 * Once linked, telegram_chat_id is associated with the student(s).
 */
export async function handleTelegramParentMessage(
  chatId: string,
  messageText: string
): Promise<TelegramParentBotResult> {
  const supabase = createAdminClient();
  const text = messageText.trim();
  const upper = text.toUpperCase();

  // 1. Check if this Telegram chatId is already linked to student(s)
  // We check student_phone, parent_phone, or notes/linked fields, or match by unique_id if they send START <unique_id>
  const idMatch = text.match(/MCG?\d+[A-Z0-9]+/i);
  let studentUniqueId = idMatch ? idMatch[0].toUpperCase() : null;

  // Let's query by telegram chat id stored in system or find by unique_id
  let matchedStudent = null;

  if (studentUniqueId) {
    const { data: student } = await supabase
      .from("students")
      .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_language")
      .ilike("unique_id", studentUniqueId)
      .maybeSingle();
    if (student) matchedStudent = student;
  }

  // If not found by unique_id in text, check if message is REPORT:<UUID> or MARKS:<UUID>
  if (!matchedStudent && (text.startsWith("REPORT:") || text.startsWith("MARKS:"))) {
    const uuid = text.replace("REPORT:", "").replace("MARKS:", "").trim();
    const { data: student } = await supabase
      .from("students")
      .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_language")
      .eq("id", uuid)
      .maybeSingle();
    if (student) matchedStudent = student;
  }

  // 2. Handle START <ID>
  if (upper.startsWith("START") || upper.startsWith("/START")) {
    if (!matchedStudent) {
      await telegramAdapter.send(
        chatId,
        `👋 Welcome to MC Mathematics Bot!\n\nTo link your student's progress updates, please reply:\n*START <StudentID>*\n\nExample:\nSTART MCG10TP1001`
      );
      return { handled: true, replySent: true, logStatus: "prompted_start_id" };
    }

    const isSinhala = matchedStudent.report_language === "si";
    const welcomeMsg = isSinhala
      ? `👋 MC Mathematics වෙත සාදරයෙන් පිළිගනිමු!\nඔබ දැන් ${matchedStudent.full_name} (${matchedStudent.unique_id}) සිසුවාගේ Telegram ප්‍රගති වාර්තා සමඟ සම්බන්ධ වී ඇත.\n\nප්‍රගති වාර්තාව හෝ ලකුණු බැලීමට පහත බොත්තමක් ඔබන්න 👇`
      : `👋 Welcome to MC Mathematics!\nYou are now connected to ${matchedStudent.full_name}'s progress updates (${matchedStudent.unique_id}) on Telegram.\n\nTap below to check progress 👇`;

    await telegramAdapter.send(chatId, welcomeMsg, {
      buttons: [
        { id: `REPORT:${matchedStudent.id}`, title: isSinhala ? "📄 සම්පූර්ණ වාර්තාව" : "📄 Full Report" },
        { id: `MARKS:${matchedStudent.id}`, title: isSinhala ? "📈 නවතම ලකුණු" : "📈 Latest Marks" },
      ],
    });

    return { handled: true, replySent: true, logStatus: "telegram_parent_linked" };
  }

  // 3. Handle MARKS command
  if (matchedStudent && (upper.startsWith("MARKS") || text.startsWith("MARKS:"))) {
    const isSinhala = matchedStudent.report_language === "si";
    const metrics = await getStudentAnalysis(matchedStudent.id);
    const marksText = isSinhala
      ? `📈 ${matchedStudent.full_name} (${matchedStudent.unique_id}) - නවතම ලකුණු:\n${
          metrics?.latestPercentage ? `ලකුණු: ${metrics.latestPercentage}%` : "තවමත් ලකුණු ඇතුළත් කර නොමැත."
        }\nසාමාන්‍යය: ${metrics?.percentage || 0}%\n\nශිෂ්‍ය පුවරුව: https://mc-mathamatics-web.vercel.app/dashboard`
      : `📈 ${matchedStudent.full_name} (${matchedStudent.unique_id}) - Latest Marks:\n${
          metrics?.latestPercentage ? `Score: ${metrics.latestPercentage}%` : "No marked papers recorded yet."
        }\nCumulative Average: ${metrics?.percentage || 0}%\n\nStudent Dashboard: https://mc-mathamatics-web.vercel.app/dashboard`;

    await telegramAdapter.send(chatId, marksText);
    return { handled: true, replySent: true, logStatus: "marks_delivered" };
  }

  // 4. Handle REPORT command
  if (matchedStudent && (upper.startsWith("REPORT") || text.startsWith("REPORT:"))) {
    const isSinhala = matchedStudent.report_language === "si";
    const metrics = await getStudentAnalysis(matchedStudent.id);
    const reportText = formatWhatsAppReport(matchedStudent as any, metrics, isSinhala);

    await telegramAdapter.send(chatId, reportText);
    return { handled: true, replySent: true, logStatus: "report_delivered" };
  }

  // 5. If matchedStudent exists and parent is chatting conversationally (asking about marks, improvement, syllabus)
  if (matchedStudent) {
    const aiStatus = await getAIStatus();
    if (aiStatus.status === "ok") {
      const { NvidiaNimProvider } = await import("@/lib/ai/nvidia-nim");
      const metrics = await getStudentAnalysis(matchedStudent.id);
      const isSinhala = matchedStudent.report_language === "si";

      const systemPrompt = `You are the friendly, helpful AI Assistant for MC Mathematics (Sir Malinga C Dissanayake).
You are talking to the parent of ${matchedStudent.full_name} (${matchedStudent.unique_id}, Grade ${matchedStudent.grade}).
Student performance data:
- Cumulative Average: ${metrics?.percentage || 0}%
- Latest Mark: ${metrics?.latestPercentage ?? "None"}%
- Trend Direction: ${metrics?.trend?.direction || "stable"}
- Total Papers: ${metrics?.paperCount || 0}
- Strengths: ${metrics?.insights?.strengthsSummary || "Consistent effort"}
- Areas needing work: ${metrics?.insights?.weaknessesSummary || "Regular revision"}

Answer the parent kindly, warmly, and concisely in ${isSinhala ? "Sinhala" : "English"}.
If they ask what their child's marks are, tell them clearly using the metrics above.
Encourage the student and reassure the parent.`;

      const aiProvider = new NvidiaNimProvider();
      const aiReply = await aiProvider.generateText(text, systemPrompt);
      await telegramAdapter.send(chatId, aiReply);
      return { handled: true, replySent: true, logStatus: "parent_ai_chat_replied" };
    }
  }

  // 6. If no student matched, give friendly instructions
  if (!matchedStudent) {
    await telegramAdapter.send(
      chatId,
      `👋 Welcome to MC Mathematics Telegram Bot.\n\nTo connect to your child's progress, please send:\n*START <StudentID>*\n\nExample:\nSTART MCG10TP1001\n\nIf you are Sir Malinga, please reply with your admin number to unlock administrative AI Mode.`
    );
    return { handled: true, replySent: true, logStatus: "unrecognized_telegram_sender" };
  }

  return { handled: false, replySent: false, logStatus: "forwarded_to_ai" };
}
