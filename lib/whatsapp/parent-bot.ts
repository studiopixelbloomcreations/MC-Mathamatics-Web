import { createAdminClient } from "@/lib/supabase/server";
import { normalizeSriLankanPhone } from "./phone";
import { whatsapp } from "./client";
import { AnalysisMetrics } from "@/lib/analysis/types";
import { getStudentAnalysis } from "@/lib/analysis/recompute";
import {
  getAIStatus,
  isParentAutoReplyThrottled,
  recordFallbackEvent,
} from "@/lib/ai/status";

export interface ParentBotResult {
  handled: boolean;
  replySent: boolean;
  logStatus: string;
}

/**
 * Pure rule-based parent bot with intelligent offline fallback.
 * Strictly verifies sender against registered parent WhatsApp numbers.
 * Works even when AI is unavailable or turned off.
 */
export async function handleParentMessage(
  fromRaw: string,
  messageText: string
): Promise<ParentBotResult> {
  const supabase = createAdminClient();
  const normalizedFrom = normalizeSriLankanPhone(fromRaw);
  if (!normalizedFrom) {
    return {
      handled: true,
      replySent: false,
      logStatus: "invalid_phone_format",
    };
  }
  const text = messageText.trim();

  // 1. Find all students registered with this parent WhatsApp number
  const { data: matchedStudents, error: studentError } = await supabase
    .from("students")
    .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_pending, report_language")
    .eq("parent_whatsapp", normalizedFrom);

  if (studentError || !matchedStudents || matchedStudents.length === 0) {
    // Unregistered phone number: Polite refusal with zero student data leaked
    console.warn(`[Parent Bot] Rejected unregistered inbound from: ${normalizedFrom}`);
    await whatsapp.sendText(
      normalizedFrom,
      "Welcome to MC Mathematics. This WhatsApp number is not registered for any active student. If your child recently joined, please register at https://mc-mathamatics-web.vercel.app/signup or contact Sir's administration."
    );

    return {
      handled: true,
      replySent: true,
      logStatus: "blocked_unregistered",
    };
  }

  // 2. Handle Multi-Student Siblings (Ambiguous Student selection)
  if (matchedStudents.length > 1 && !text.toUpperCase().includes("MCG") && !text.startsWith("REPORT:") && !text.startsWith("MARKS:")) {
    const listSections = [
      {
        title: "Your Children",
        rows: matchedStudents.map((s) => ({
          id: `REPORT:${s.id}`,
          title: s.full_name.slice(0, 20),
          description: `${s.unique_id} • Grade ${s.grade}`,
        })),
      },
    ];

    await whatsapp.sendList(
      normalizedFrom,
      "You have multiple students enrolled at MC Mathematics. Which student's progress report would you like to view?",
      "Choose Student",
      listSections
    );

    return { handled: true, replySent: true, logStatus: "prompted_sibling_list" };
  }

  // 3. Resolve targeted student
  let targetStudent = matchedStudents[0];
  const idMatch = text.match(/MCG?\d+[A-Z0-9]+/i);
  if (idMatch) {
    const found = matchedStudents.find((s) => s.unique_id.toUpperCase() === idMatch[0].toUpperCase());
    if (found) targetStudent = found;
  } else if (text.startsWith("REPORT:") || text.startsWith("MARKS:")) {
    const uuid = text.replace("REPORT:", "").replace("MARKS:", "").trim();
    const found = matchedStudents.find((s) => s.id === uuid);
    if (found) targetStudent = found;
  }

  const isSinhala = targetStudent.report_language === "si";

  // Always update parent_last_inbound_at on any message from registered parent (refreshes 24h free window)
  await supabase
    .from("students")
    .update({ parent_last_inbound_at: new Date().toISOString() })
    .eq("id", targetStudent.id);

  const upper = text.toUpperCase();

  // COMMAND 1: START <ID> (Always works; never requires AI)
  if (upper.startsWith("START")) {
    await supabase
      .from("students")
      .update({
        parent_wa_verified: true,
        report_opt_in: true,
      })
      .eq("id", targetStudent.id);

    // Check AI status to append offline notice if needed
    const aiStatus = await getAIStatus();
    let offlineNotice = "";
    if (aiStatus.status !== "ok") {
      offlineNotice = isSinhala
        ? "\n\n(සටහන: AI සහායකයා මේ වන විට ක්‍රියාවිරහිතයි. නමුත් පහත බොත්තම් මඟින් වාර්තා ලබාගත හැක.)"
        : "\n\n(Note: The AI assistant is offline right now, but your progress buttons work as usual.)";
    }

    const welcomeMsg = isSinhala
      ? `👋 MC Mathematics වෙත සාදරයෙන් පිළිගනිමු!\nඔබ දැන් ${targetStudent.full_name} (${targetStudent.unique_id}) සිසුවාගේ ප්‍රගති වාර්තා සමඟ සම්බන්ධ වී ඇත.${offlineNotice}\n\n📊 ශිෂ්‍ය පුවරුව:\nhttps://mc-mathamatics-web.vercel.app/dashboard\n\nප්‍රගති වාර්තාව ලබා ගැනීමට පහත බොත්තම ඔබන්න 👇`
      : `👋 Welcome to MC Mathematics!\nYou are now connected to ${targetStudent.full_name}'s progress updates (${targetStudent.unique_id}).${offlineNotice}\n\n📊 Student Dashboard:\nhttps://mc-mathamatics-web.vercel.app/dashboard\n\nTap below to receive the latest analytical progress report 👇`;

    await whatsapp.sendInteractiveButtons(normalizedFrom, welcomeMsg, [
      { id: `REPORT:${targetStudent.id}`, title: isSinhala ? "📄 සම්පූර්ණ වාර්තාව" : "📄 Full Report" },
      { id: `MARKS:${targetStudent.id}`, title: isSinhala ? "📈 නවතම ලකුණු" : "📈 Latest Marks" },
    ]);

    return { handled: true, replySent: true, logStatus: "verified_start" };
  }

  // COMMAND 2: BUTTON [Latest Marks] or tap on MARKS:<ID> (Stored data, zero AI)
  if (upper.startsWith("MARKS") || text.startsWith("MARKS:")) {
    const metrics = await getStudentAnalysis(targetStudent.id);
    const marksText = isSinhala
      ? `📈 ${targetStudent.full_name} (${targetStudent.unique_id}) - නවතම ලකුණු:\n${
          metrics?.latestPercentage ? `ලකුණු: ${metrics.latestPercentage}%` : "තවමත් ලකුණු ඇතුළත් කර නොමැත."
        }\nසාමාන්‍යය: ${metrics?.percentage || 0}%\n\nශිෂ්‍ය පුවරුව: https://mc-mathamatics-web.vercel.app/dashboard`
      : `📈 ${targetStudent.full_name} (${targetStudent.unique_id}) - Latest Marks:\n${
          metrics?.latestPercentage ? `Score: ${metrics.latestPercentage}%` : "No marked papers recorded yet."
        }\nCumulative Average: ${metrics?.percentage || 0}%\n\nStudent Dashboard: https://mc-mathamatics-web.vercel.app/dashboard`;

    await whatsapp.sendText(normalizedFrom, marksText);
    return { handled: true, replySent: true, logStatus: "marks_delivered" };
  }

  // COMMAND 3: BUTTON [Full Report] or tap on REPORT:<ID> (Stored data, zero AI)
  if (upper.startsWith("REPORT") || text.startsWith("REPORT:")) {
    // Log report request
    await supabase.from("report_requests").insert({
      student_id: targetStudent.id,
    });

    // Clear report pending
    await supabase
      .from("students")
      .update({ report_pending: false })
      .eq("id", targetStudent.id);

    // Fetch analytical metrics
    const metrics = await getStudentAnalysis(targetStudent.id);
    const reportText = formatWhatsAppReport(targetStudent, metrics, isSinhala);

    const sendRes = await whatsapp.sendText(normalizedFrom, reportText);

    // Record delivery
    await supabase.from("report_deliveries").insert({
      student_id: targetStudent.id,
      wa_message_id: sendRes.messageId || null,
      status: sendRes.success ? "delivered" : "failed",
    });

    return { handled: true, replySent: true, logStatus: "report_delivered" };
  }

  // COMMAND 4: PIN <ID> (Forgot PIN assistance)
  if (upper.startsWith("PIN")) {
    await supabase.from("pin_reset_requests").insert({
      student_id: targetStudent.id,
      unique_id: targetStudent.unique_id,
      status: "pending",
    });

    const pinMsg = isSinhala
      ? `🔑 MC Mathematics PIN සහාය:\n\n${targetStudent.full_name} (${targetStudent.unique_id}) වෙනුවෙන් මුරපද ඉල්ලීමක් ලැබී ඇත. ගුරුතුමාගේ කාර්යාලය දැනුවත් කරන ලදී.\n\nපුවරුව: https://mc-mathamatics-web.vercel.app/dashboard`
      : `🔑 MC Mathematics PIN Assistance:\n\nA password reset request was received for ${targetStudent.full_name} (${targetStudent.unique_id}).\nSir's administration has been notified. You can also view credentials directly in your dashboard Parental Controls.\n\nDashboard: https://mc-mathamatics-web.vercel.app/dashboard`;

    await whatsapp.sendText(normalizedFrom, pinMsg);
    return { handled: true, replySent: true, logStatus: "pin_requested" };
  }

  // COMMAND 5: STOP (Opt-out)
  if (upper === "STOP") {
    await supabase
      .from("students")
      .update({ report_opt_in: false })
      .eq("id", targetStudent.id);

    const stopMsg = isSinhala
      ? "ඔබ MC Mathematics WhatsApp ප්‍රගති වාර්තා සේවාවෙන් ඉවත් විය. නැවත ආරම්භ කිරීමට ඕනෑම මොහොතක START එවන්න."
      : "You have opted out of WhatsApp progress reports from MC Mathematics. You will no longer receive test score alerts. Send START anytime to resume.";

    await whatsapp.sendText(normalizedFrom, stopMsg);
    return { handled: true, replySent: true, logStatus: "opted_out" };
  }

  // 4. FREE-TEXT HANDLING (AI Status Check & Throttled Fallback)
  const aiStatus = await getAIStatus();

  // If AI is NOT ok OR parent chat is disabled:
  if (aiStatus.status !== "ok") {
    // Record fallback event in diagnostics audit
    recordFallbackEvent(normalizedFrom, `Parent text fallback (${aiStatus.status})`, aiStatus.status);

    // Throttle check: send at most once every 30 minutes per parent phone
    const isThrottled = isParentAutoReplyThrottled(normalizedFrom);
    if (isThrottled) {
      console.log(`[Parent Bot] Auto-reply throttled for ${normalizedFrom}`);
      return { handled: true, replySent: false, logStatus: "fallback_throttled" };
    }

    let offlineText: string;
    if (aiStatus.status === "parent_chat_disabled") {
      offlineText = isSinhala
        ? "AI සහායකයා මේ වන විට නවතා ඇත. ඔබගේ දරුවාගේ නවතම ලකුණු හෝ සම්පූර්ණ වාර්තාව ලබා ගැනීමට පහත බොත්තමක් ඔබන්න, නැතහොත් ශිෂ්‍ය පුවරුවට පිවිසෙන්න: https://mc-mathamatics-web.vercel.app/dashboard"
        : "The AI assistant is paused for now. You can still tap a button below to get your child's latest marks or the full report, or open the dashboard: https://mc-mathamatics-web.vercel.app/dashboard";
    } else {
      offlineText = isSinhala
        ? "AI සහායකයා මේ වන විට ක්‍රියාවිරහිතයි. ඔබගේ දරුවාගේ නවතම ලකුණු හෝ සම්පූර්ණ වාර්තාව ලබා ගැනීමට පහත බොත්තමක් ඔබන්න, නැතහොත් ශිෂ්‍ය පුවරුවට පිවිසෙන්න: https://mc-mathamatics-web.vercel.app/dashboard"
        : "The AI assistant is offline right now. You can still tap a button below to get your child's latest marks or the full report, or open the dashboard: https://mc-mathamatics-web.vercel.app/dashboard";
    }

    await whatsapp.sendInteractiveButtons(normalizedFrom, offlineText, [
      { id: `MARKS:${targetStudent.id}`, title: isSinhala ? "📈 නවතම ලකුණු" : "📈 Latest Marks" },
      { id: `REPORT:${targetStudent.id}`, title: isSinhala ? "📄 සම්පූර්ණ වාර්තාව" : "📄 Full Report" },
    ]);

    return { handled: true, replySent: true, logStatus: `fallback_dispatched_${aiStatus.status}` };
  }

  // AI is OK: Delegate to conversational handler (Handled by webhook processor)
  return { handled: false, replySent: false, logStatus: "forwarded_to_ai" };
}

/**
 * Formats report message matching Blueprint A6 specifications.
 */
function formatWhatsAppReport(
  student: { unique_id: string; full_name: string; grade: number; class_type: string },
  metrics: AnalysisMetrics | null,
  isSinhala: boolean = false
): string {
  if (!metrics || metrics.paperCount === 0) {
    if (isSinhala) {
      return `📊 MC MATHEMATICS — ප්‍රගති වාර්තාව\nශිෂ්‍යයා: ${student.full_name} (${student.unique_id})\nශ්‍රේණිය ${student.grade} · ${
        student.class_type === "TP" ? "සිද්ධාන්ත + ප්‍රශ්න පත්‍ර" : "සිද්ධාන්ත පමණි"
      }\n\nතත්වය: ඉදිරි ප්‍රශ්න පත්‍ර සඳහා ලියාපදිංචි වී ඇත.\nතවමත් ලකුණු වාර්තා වී නොමැත.\n\nශිෂ්‍ය පුවරුව:\nhttps://mc-mathamatics-web.vercel.app/dashboard`;
    }
    return `📊 MC MATHEMATICS — PROGRESS REPORT\nStudent: ${student.full_name} (${student.unique_id})\nGrade ${student.grade} · ${
      student.class_type === "TP" ? "Theory + Paper" : "Theory Only"
    }\n\nStatus: Registered for upcoming paper assessments.\nNo marked papers recorded yet.\n\nOpen student dashboard:\nhttps://mc-mathamatics-web.vercel.app/dashboard`;
  }

  const latestPaper = metrics.paperHistory[metrics.paperHistory.length - 1];
  const strengthsStr = metrics.strongestTopics.length > 0 ? metrics.strongestTopics.join(", ") : (isSinhala ? "මූලික සංකල්ප" : "Core Fundamentals");
  const weaknessesStr = metrics.weakestTopics.length > 0 ? metrics.weakestTopics.join(", ") : (isSinhala ? "ඉදිරි පාඩම්" : "Upcoming Topics");

  const action1 = metrics.insights.actionSteps[0] || (isSinhala ? "ප්‍රශ්න පත්‍ර ලකුණු කිරීම සමාලෝචනය කරන්න" : "Review latest paper marking scheme");
  const action2 = metrics.insights.actionSteps[1] || (isSinhala ? "නිර්දේශිත පෙළපොත් ගැටලු විසඳන්න" : "Practice recommended textbook problems");

  if (isSinhala) {
    return `📊 MC MATHEMATICS — ප්‍රගති වාර්තාව
ශිෂ්‍යයා: ${student.full_name} (${student.unique_id})
ශ්‍රේණිය ${student.grade} · ${student.class_type === "TP" ? "සිද්ධාන්ත + ප්‍රශ්න පත්‍ර" : "සිද්ධාන්ත පමණි"}

නවතම: ${latestPaper ? latestPaper.paperTitle : "මෑත පරීක්ෂණය"} (${metrics.latestPercentage}%)
${!metrics.isSmallClass && metrics.classAverage > 0 ? `පන්ති සාමාන්‍යය: ${metrics.classAverage}% · ඉහළම ලකුණු: ${metrics.topperScore}%\nස්ථානය: ${metrics.percentileBand}` : `ඉහළම ලකුණු: ${metrics.topperScore}%`}

සමස්ත සාමාන්‍යය: ${metrics.percentage}%
ස්ථාවරත්වය: ${metrics.consistencyRating} (ලකුණු: ${metrics.consistencyScore}/100)

දක්ෂතා: ${strengthsStr}
වැඩිදියුණු විය යුතු: ${weaknessesStr}

ගුරුතුමාගේ අවධානය:
1. ${action1}
2. ${action2}

සම්පූර්ණ ප්‍රස්තාර සහ පසුගිය ප්‍රශ්න පත්‍ර:
https://mc-mathamatics-web.vercel.app/dashboard`;
  }

  return `📊 MC MATHEMATICS — PROGRESS REPORT
Student: ${student.full_name} (${student.unique_id})
Grade ${student.grade} · ${student.class_type === "TP" ? "Theory + Paper" : "Theory Only"}

Latest: ${latestPaper ? latestPaper.paperTitle : "Recent Test"} (${metrics.latestPercentage}%)
${!metrics.isSmallClass && metrics.classAverage > 0 ? `Class average: ${metrics.classAverage}% · Topper: ${metrics.topperScore}%\nPosition: ${metrics.percentileBand}` : `Topper benchmark: ${metrics.topperScore}%`}

Cumulative average: ${metrics.percentage}%
Consistency: ${metrics.consistencyRating} (Score: ${metrics.consistencyScore}/100)

Strengths: ${strengthsStr}
Needs work: ${weaknessesStr}

Sir's recommended focus:
1. ${action1}
2. ${action2}

Full interactive charts and past papers:
https://mc-mathamatics-web.vercel.app/dashboard`;
}
