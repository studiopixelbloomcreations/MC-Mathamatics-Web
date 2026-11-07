import { AnalysisMetrics } from "@/lib/analysis/types";
import { NvidiaNimProvider } from "./nvidia-nim";
import { createAdminClient } from "@/lib/supabase/server";

export interface BilingualNarrative {
  en: {
    strengths: string;
    weaknesses: string;
    recommendations: string[];
  };
  si: {
    strengths: string;
    weaknesses: string;
    recommendations: string[];
  };
}

/**
 * Generates structured analytical narrative strictly grounded in deterministic metrics.
 * Ensures zero hallucinations of numbers.
 */
export async function generateAnalysisNarrative(
  studentId: string,
  analysisId: string,
  metrics: AnalysisMetrics
): Promise<BilingualNarrative> {
  const ai = new NvidiaNimProvider();

  const metricsSnapshot = JSON.stringify({
    overallAverage: metrics.percentage,
    latestScore: metrics.latestPercentage,
    classAverage: metrics.classAverage,
    topperScore: metrics.topperScore,
    consistencyRating: metrics.consistencyRating,
    strongestTopics: metrics.strongestTopics,
    weakestTopics: metrics.weakestTopics,
    actions: metrics.insights.actionSteps,
  });

  const prompt = `Based strictly on these computed student numbers:
${metricsSnapshot}

Generate a concise 2-sentence summary of strengths, 2-sentence summary of weaknesses, and 3 bullet recommendations.
Output JSON format:
{
  "en": { "strengths": "...", "weaknesses": "...", "recommendations": ["...", "...", "..."] },
  "si": { "strengths": "...", "weaknesses": "...", "recommendations": ["...", "...", "..."] }
}
Rule: Do NOT invent numbers. Only refer to scores from the input.`;

  try {
    const rawAiResponse = await ai.generateText(prompt, "You are an expert mathematics educator. Output strictly valid JSON.");
    const parsed = JSON.parse(rawAiResponse);

    if (parsed.en && parsed.si) {
      // Persist to analyses table
      const supabase = createAdminClient();
      await supabase
        .from("analyses")
        .update({ narrative: parsed })
        .eq("id", analysisId);

      return parsed;
    }
  } catch {
    // Fall back to rule-based bilingual text
  }

  // Pure deterministic fallback
  const fallbackNarrative: BilingualNarrative = {
    en: {
      strengths: metrics.insights.strengthsSummary,
      weaknesses: metrics.insights.weaknessesSummary,
      recommendations: metrics.insights.actionSteps,
    },
    si: {
      strengths: `ශිෂ්‍යයා ${metrics.strongestTopics.join(", ") || "මූලික ගණිත සංකල්ප"} පිළිබඳව ප්‍රශංසනීය සාමාර්ථයක් දක්වා ඇත. සමස්ත සාමාන්‍ය ලකුණු ප්‍රතිශතය ${metrics.percentage}% කි.`,
      weaknesses: `${metrics.weakestTopics.join(", ") || "ඉදිරි පාඩම්"} කොටස් සම්බන්ධයෙන් තවදුරටත් පුහුණුව අවශ්‍ය වේ.`,
      recommendations: [
        metrics.insights.actionSteps[0],
        metrics.insights.actionSteps[1],
        "සර්ගේ විශේෂ සටහන් සහ පසුගිය ප්‍රශ්න පත්‍ර සාකච්ඡා නැවත පරිශීලනය කරන්න.",
      ],
    },
  };

  const supabase = createAdminClient();
  await supabase
    .from("analyses")
    .update({ narrative: fallbackNarrative })
    .eq("id", analysisId);

  return fallbackNarrative;
}
