import { createAdminClient } from "@/lib/supabase/server";
import { normalizeSriLankanPhone } from "./phone";
import { whatsapp } from "./client";
import { AnalysisMetrics } from "@/lib/analysis/types";
import { getStudentAnalysis } from "@/lib/analysis/recompute";

export interface ParentBotResult {
  handled: boolean;
  replySent: boolean;
  logStatus: string;
}

/**
 * Pure rule-based parent bot. Zero AI tokens consumed.
 * Strictly verifies sender against registered parent WhatsApp numbers.
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
    .select("id, unique_id, full_name, grade, class_type, parent_whatsapp, report_pending")
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
  if (matchedStudents.length > 1 && !text.toUpperCase().includes("MCG") && !text.startsWith("REPORT:")) {
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

  // 3. Resolve the targeted student
  let targetStudent = matchedStudents[0];
  const idMatch = text.match(/MCG?\d+[A-Z0-9]+/i);
  if (idMatch) {
    const found = matchedStudents.find((s) => s.unique_id.toUpperCase() === idMatch[0].toUpperCase());
    if (found) targetStudent = found;
  } else if (text.startsWith("REPORT:")) {
    const uuid = text.replace("REPORT:", "").trim();
    const found = matchedStudents.find((s) => s.id === uuid);
    if (found) targetStudent = found;
  }

  // Always update parent_last_inbound_at on any message from registered parent (refreshes 24h free window)
  await supabase
    .from("students")
    .update({ parent_last_inbound_at: new Date().toISOString() })
    .eq("id", targetStudent.id);

  const upper = text.toUpperCase();

  // COMMAND 1: START <ID> (from sign-up button or welcome link)
  if (upper.startsWith("START")) {
    await supabase
      .from("students")
      .update({
        parent_wa_verified: true,
        report_opt_in: true,
      })
      .eq("id", targetStudent.id);

    const welcomeMsg = `👋 Welcome to MC Mathematics!\nYou are now connected to ${targetStudent.full_name}'s progress updates (${targetStudent.unique_id}).\n\n📊 Open ${targetStudent.full_name.split(" ")[0]}'s dashboard:\nhttps://mc-mathamatics-web.vercel.app/dashboard\n\nTap below to receive the latest analytical progress report 👇`;

    await whatsapp.sendInteractiveButtons(normalizedFrom, welcomeMsg, [
      { id: `REPORT:${targetStudent.id}`, title: "📄 Get Full Report" },
    ]);

    return { handled: true, replySent: true, logStatus: "verified_start" };
  }

  // COMMAND 2: REPORT <ID> or tap on [Get Full Report]
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
    const reportText = formatWhatsAppReport(targetStudent, metrics);

    const sendRes = await whatsapp.sendText(normalizedFrom, reportText);

    // Record delivery
    await supabase.from("report_deliveries").insert({
      student_id: targetStudent.id,
      wa_message_id: sendRes.messageId || null,
      status: sendRes.success ? "delivered" : "failed",
    });

    return { handled: true, replySent: true, logStatus: "report_delivered" };
  }

  // COMMAND 3: PIN <ID> (Forgot PIN assistance inside free window)
  if (upper.startsWith("PIN")) {
    // Log request
    await supabase.from("pin_reset_requests").insert({
      student_id: targetStudent.id,
      unique_id: targetStudent.unique_id,
      status: "pending",
    });

    await whatsapp.sendText(
      normalizedFrom,
      `🔑 MC Mathematics PIN Assistance:\n\nA password reset request was received for ${targetStudent.full_name} (${targetStudent.unique_id}).\nSir's administration has been notified. You can also view credentials directly in your dashboard Parental Controls.\n\nDashboard: https://mc-mathamatics-web.vercel.app/dashboard`
    );

    return { handled: true, replySent: true, logStatus: "pin_requested" };
  }

  // COMMAND 4: STOP (Opt-out)
  if (upper === "STOP") {
    await supabase
      .from("students")
      .update({ report_opt_in: false })
      .eq("id", targetStudent.id);

    await whatsapp.sendText(
      normalizedFrom,
      "You have opted out of WhatsApp progress reports from MC Mathematics. You will no longer receive test score alerts. Send START anytime to resume."
    );

    return { handled: true, replySent: true, logStatus: "opted_out" };
  }

  // Default Fallback Menu
  await whatsapp.sendText(
    normalizedFrom,
    `Hello! MC Mathematics automated parent service for ${targetStudent.full_name} (${targetStudent.unique_id}).\n\nCommands:\n• Send REPORT to view latest results\n• Send STOP to pause notifications\n• Or open dashboard: https://mc-mathamatics-web.vercel.app/dashboard`
  );

  return { handled: true, replySent: true, logStatus: "menu_dispatched" };
}

/**
 * Formats report message matching Blueprint A6 specifications.
 */
function formatWhatsAppReport(
  student: { unique_id: string; full_name: string; grade: number; class_type: string },
  metrics: AnalysisMetrics | null
): string {
  if (!metrics || metrics.paperCount === 0) {
    return `📊 MC MATHEMATICS — PROGRESS REPORT\nStudent: ${student.full_name} (${student.unique_id})\nGrade ${student.grade} · ${
      student.class_type === "TP" ? "Theory + Paper" : "Theory Only"
    }\n\nStatus: Registered for upcoming paper assessments.\nNo marked papers recorded yet.\n\nOpen student dashboard:\nhttps://mc-mathamatics-web.vercel.app/dashboard`;
  }

  const latestPaper = metrics.paperHistory[metrics.paperHistory.length - 1];
  const strengthsStr = metrics.strongestTopics.length > 0 ? metrics.strongestTopics.join(", ") : "Core Fundamentals";
  const weaknessesStr = metrics.weakestTopics.length > 0 ? metrics.weakestTopics.join(", ") : "Upcoming Topics";

  const action1 = metrics.insights.actionSteps[0] || "Review latest paper marking scheme";
  const action2 = metrics.insights.actionSteps[1] || "Practice recommended textbook problems";

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
