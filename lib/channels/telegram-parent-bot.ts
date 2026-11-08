// lib/channels/telegram-parent-bot.ts
import { createAdminClient } from "@/lib/supabase/server";
import { telegramAdapter } from "./telegram";
import { getStudentAnalysis } from "@/lib/analysis/recompute";
import { formatWhatsAppReport } from "@/lib/whatsapp/parent-bot";
import { getAIStatus } from "@/lib/ai/status";
import { getOrCreateSession, saveSession } from "./session";
import { NvidiaNimProvider } from "@/lib/ai/nvidia-nim";

export interface TelegramParentBotResult {
  handled: boolean;
  replySent: boolean;
  logStatus: string;
}

/**
 * Handles parent interaction over Telegram as a full conversational chatbot.
 * Features:
 * - Persistent memory per Telegram Chat ID (never forgets student ID).
 * - Singlish -> Sinhala response conversion with Sinhala unicode script.
 * - Cheerful, friendly, human tone (zero robotic templates).
 */
export async function handleTelegramParentMessage(
  chatId: string,
  messageText: string
): Promise<TelegramParentBotResult> {
  const supabase = createAdminClient();
  const text = messageText.trim();
  const upper = text.toUpperCase();

  // 1. Fetch persistent chat session for this parent
  const session = await getOrCreateSession("telegram", chatId);

  // 2. Detect student ID in message or deep-link parameter
  // Handles: "START MCG10TP1002", "START_MCG10TP1002", "/start START_MCG10TP1002", "MCG10TP1002"
  const idMatch = text.match(/MCG?\d+[A-Z0-9]+/i);
  if (idMatch) {
    const rawId = idMatch[0].toUpperCase();
    const { data: foundStudent } = await supabase
      .from("students")
      .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_language")
      .ilike("unique_id", rawId)
      .maybeSingle();

    if (foundStudent) {
      session.student_id = foundStudent.id;
      session.student_unique_id = foundStudent.unique_id;
      await saveSession(session);
    }
  }

  // 3. If session still doesn't have student_id, try to fetch student by linked parent phone or session
  let currentStudent: any = null;
  if (session.student_id) {
    const { data: student } = await supabase
      .from("students")
      .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_language")
      .eq("id", session.student_id)
      .maybeSingle();
    currentStudent = student;
  }

  // Check if button command REPORT: or MARKS:
  if (!currentStudent && (text.startsWith("REPORT:") || text.startsWith("MARKS:"))) {
    const uuid = text.replace("REPORT:", "").replace("MARKS:", "").trim();
    const { data: student } = await supabase
      .from("students")
      .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_language")
      .eq("id", uuid)
      .maybeSingle();
    if (student) {
      currentStudent = student;
      session.student_id = student.id;
      session.student_unique_id = student.unique_id;
      await saveSession(session);
    }
  }

  // 4. Quick Action: Explicit Report or Marks button tap
  if (currentStudent && (text.startsWith("REPORT:") || text.startsWith("MARKS:"))) {
    const isSinhala = currentStudent.report_language === "si";
    const metrics = await getStudentAnalysis(currentStudent.id);

    if (text.startsWith("MARKS:")) {
      const marksText = isSinhala
        ? `📈 ${currentStudent.full_name} (${currentStudent.unique_id}) - නවතම ලකුණු:\n${
            metrics?.latestPercentage ? `ලකුණු: ${metrics.latestPercentage}%` : "තවමත් ලකුණු ඇතුළත් කර නොමැත."
          }\nසාමාන්‍යය: ${metrics?.percentage || 0}%\n\nශිෂ්‍ය පුවරුව: https://mc-mathamatics-web.vercel.app/dashboard`
        : `📈 ${currentStudent.full_name} (${currentStudent.unique_id}) - Latest Marks:\n${
            metrics?.latestPercentage ? `Score: ${metrics.latestPercentage}%` : "No marked papers recorded yet."
          }\nCumulative Average: ${metrics?.percentage || 0}%\n\nStudent Dashboard: https://mc-mathamatics-web.vercel.app/dashboard`;

      await telegramAdapter.send(chatId, marksText);
      await saveSession(session, { role: "assistant", content: marksText });
      return { handled: true, replySent: true, logStatus: "marks_delivered" };
    } else {
      const reportText = formatWhatsAppReport(currentStudent, metrics, isSinhala);
      await telegramAdapter.send(chatId, reportText);
      await saveSession(session, { role: "assistant", content: reportText });
      return { handled: true, replySent: true, logStatus: "report_delivered" };
    }
  }

  // 5. Intelligent Conversational Chatbot (Powered by NVIDIA NIM Nemotron)
  const aiStatus = await getAIStatus();
  if (aiStatus.status === "ok") {
    const aiProvider = new NvidiaNimProvider();
    let studentContext = "No student is linked to this chat yet.";

    if (currentStudent) {
      const metrics = await getStudentAnalysis(currentStudent.id);
      studentContext = `Linked Student Details:
- Student Name: ${currentStudent.full_name}
- Student Index/ID: ${currentStudent.unique_id}
- Grade: ${currentStudent.grade} (${currentStudent.class_type === "TP" ? "Theory + Paper" : "Theory"})
- Cumulative Average: ${metrics?.percentage || 0}%
- Latest Score: ${metrics?.latestPercentage ?? "Not graded yet"}%
- Trend: ${metrics?.trend?.direction || "steady"}
- Papers completed: ${metrics?.paperCount || 0}
- Strong topics: ${metrics?.insights?.strengthsSummary || "Solid baseline"}
- Focus areas: ${metrics?.insights?.weaknessesSummary || "Continued practice"}`;
    }

    const conversationalSystemPrompt = `You are the lively, cheerful, warm, and helpful AI Assistant for MC Mathematics (taught by Sir Malinga C Dissanayake).
You are having a real-time chat with a parent or student on Telegram.

CRITICAL RULES:
1. Speak naturally, warmly, and cheerfully like a real teacher's assistant. NEVER repeat generic canned bullet-point templates ("Please let me know if you need help with...").
2. SINGLISH / SINHALA RULE: If the user writes in Singlish (Sinhala written in English letters like "kohomada", "lamayage marks kiyada", "mata report eka ona") or in Sinhala script, YOU MUST REPLY IN BEAUTIFUL, NATURAL SINHALA (සිංහල අකුරින්).
3. If they write in pure English, reply in cheerful English.
4. If a student is linked (see below), remember it throughout the conversation! Never ask them for their index number again if it is already known. You can warmly mention: "මම බැලුවා, ${currentStudent?.full_name || "ඔබේ දරුවාගේ"} (${currentStudent?.unique_id || ""}) ලකුණු විස්තර මෙන්න..."
5. If NO student is linked yet, kindly and casually ask: "ආයුබෝවන්! සාදරයෙන් පිළිගනිමු 😊 මට ඔයාගේ හෝ දරුවාගේ Index Number එක (උදා: MCG10TP1002) කියන්න පුළුවන්ද? එතකොට මට ඔක්කොම විස්තර බලාගන්න පුළුවන්!"
6. If the parent asks about marks, weaknesses, class schedule, or progress, answer directly with the data provided below.

${studentContext}`;

    // Build chat message history
    const history = session.messages.slice(-8).map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    // Add current user prompt
    history.push({ role: "user", content: text });

    const messages = [
      { role: "system" as const, content: conversationalSystemPrompt },
      ...history,
    ];

    const reply = await aiProvider.generateChat(messages, 0.6);

    // Save turn into session history
    await saveSession(session, { role: "user", content: text });
    await saveSession(session, { role: "assistant", content: reply });

    // Send reply via Telegram
    if (currentStudent && (upper.includes("START") || text.includes("start"))) {
      // Send inline buttons along with the conversational greeting
      await telegramAdapter.send(chatId, reply, {
        buttons: [
          { id: `REPORT:${currentStudent.id}`, title: "📄 සම්පූර්ණ වාර්තාව (Full Report)" },
          { id: `MARKS:${currentStudent.id}`, title: "📈 නවතම ලකුණු (Latest Marks)" },
        ],
      });
    } else {
      await telegramAdapter.send(chatId, reply);
    }

    return { handled: true, replySent: true, logStatus: "parent_conversational_chat_replied" };
  }

  // Fallback offline message if AI is offline
  await telegramAdapter.send(
    chatId,
    "මම MC Mathematics AI සහායකයා. මේ මොහොතේ මගේ සේවාදායකය යාවත්කාලීන වෙමින් පවතී. කරුණාකර සුළු මොහොතකින් නැවත පණිවිඩයක් එවන්න."
  );
  return { handled: true, replySent: true, logStatus: "ai_offline_fallback" };
}
