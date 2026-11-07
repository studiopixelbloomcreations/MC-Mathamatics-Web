import {
  AnalysisMetrics,
  FocusArea,
  PaperHistoryItem,
  RawMarkRecord,
  RawPaperRecord,
  RuleBasedInsights,
} from "./types";

/**
 * Topic specific actionable tips for Sri Lankan curriculum (O/L and A/L).
 */
const TOPIC_TIPS: Record<string, string> = {
  algebra: "Drill quadratic factorization, indices laws, and simultaneous equation elimination.",
  geometry: "Review circle angle theorems, tangent properties, and formal geometric riders with step-by-step reasons.",
  trigonometry: "Memorize sin/cos/tan special angles and practice 3D elevation and bearing diagrams.",
  statistics: "Practice grouped frequency tables, cumulative frequency curves (ogives), and interquartile range.",
  probability: "Use tree diagrams for dependent vs independent events and double-check complementary probability.",
  arithmetic: "Work on compound interest, taxation slabs, and commercial arithmetic percentages.",
  matrices: "Revisit 2x2 determinants, inverse matrix formulas, and matrix multiplication row-by-column rules.",
  calculus: "Practice chain rule differentiation and definite integrals with geometric area interpretations.",
  vectors: "Verify position vectors vs displacement vectors and scalar dot product orthogonality rules.",
  sets: "Draw 3-circle Venn diagrams and verify shaded regions for De Morgan's laws.",
  functions: "Review domain/range restrictions and composite function transformations.",
  mensuration: "Memorize volume and curved surface area formulas for cones, spheres, and frustums.",
};

export function getTopicTip(topic: string): string {
  const normalized = topic.toLowerCase().trim();
  for (const [key, tip] of Object.entries(TOPIC_TIPS)) {
    if (normalized.includes(key)) {
      return tip;
    }
  }
  return `Focus on foundational textbook worked examples and timed past paper questions for ${topic}.`;
}

export function round(value: number, decimals = 1): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calculateMean(values: number[]): number {
  if (!values.length) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return round(sum / values.length, 1);
}

export function calculateMedian(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return round((sorted[mid - 1] + sorted[mid]) / 2, 1);
  }
  return round(sorted[mid], 1);
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  return round(Math.sqrt(variance), 1);
}

export function calculatePercentileBand(
  studentScore: number,
  allScores: number[]
): string {
  if (!allScores.length) return "Core Band";
  if (allScores.length < 5) return "Class < 5";

  // Calculate percentage of peers whose score is <= student's score
  const countBelowOrEqual = allScores.filter((s) => s <= studentScore).length;
  const percentile = (countBelowOrEqual / allScores.length) * 100;

  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 50) return "Top 50%";
  return "Core Band";
}

export function calculateLinearSlope(yValues: number[]): number {
  const n = yValues.length;
  if (n <= 1) return 0;

  const xMean = (n - 1) / 2;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = i - xMean;
    numerator += xDiff * (yValues[i] - yMean);
    denominator += xDiff * xDiff;
  }

  if (denominator === 0) return 0;
  return round(numerator / denominator, 2);
}

export function calculateConsistency(percentages: number[]): {
  score: number;
  rating: AnalysisMetrics["consistencyRating"];
  stdDev: number;
} {
  if (percentages.length === 0) {
    return { score: 100, rating: "Baseline Established", stdDev: 0 };
  }
  if (percentages.length === 1) {
    return { score: 100, rating: "Baseline Established", stdDev: 0 };
  }

  const stdDev = calculateStandardDeviation(percentages);
  // StdDev of 0 -> 100, StdDev of 20 -> ~56, StdDev of 35 -> ~23
  const rawScore = 100 - stdDev * 2.2;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let rating: AnalysisMetrics["consistencyRating"] = "Consistent";
  if (score >= 90) rating = "Exceptionally Stable";
  else if (score >= 75) rating = "Consistent";
  else if (score >= 55) rating = "Moderate Variance";
  else rating = "Volatile";

  return { score, rating, stdDev };
}

/**
 * Pure, deterministic Analysis Engine.
 * Evaluates student progress against class benchmarks, topics, drops, and trends.
 */
export function computeStudentAnalysis(params: {
  studentId?: string;
  studentMarks: RawMarkRecord[];
  allMarks: RawMarkRecord[];
  papers: RawPaperRecord[];
}): AnalysisMetrics {
  const { studentMarks, allMarks, papers } = params;

  // Map papers by ID for fast lookup
  const paperMap = new Map<string, RawPaperRecord>();
  for (const p of papers) {
    paperMap.set(p.id, p);
  }

  // Group all marks by paperId
  const marksByPaper = new Map<string, RawMarkRecord[]>();
  for (const m of allMarks) {
    const list = marksByPaper.get(m.paperId) || [];
    list.push(m);
    marksByPaper.set(m.paperId, list);
  }

  // Filter student's marks and attach paper info
  interface EnrichedStudentPaper {
    markRecord: RawMarkRecord;
    paper: RawPaperRecord;
    percentage: number;
    date: string;
  }

  const studentPapers: EnrichedStudentPaper[] = [];
  for (const sm of studentMarks) {
    const p = paperMap.get(sm.paperId);
    if (!p) continue;
    const total = p.totalMarks || 100;
    const percentage = round((sm.marks / total) * 100, 1);
    const date = p.paperDate || sm.enteredAt || new Date().toISOString();
    studentPapers.push({
      markRecord: sm,
      paper: p,
      percentage,
      date,
    });
  }

  // Sort student papers chronologically (oldest to newest)
  studentPapers.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const paperCount = studentPapers.length;

  // Handle empty state gracefully
  if (paperCount === 0) {
    return {
      percentage: 0,
      paperCount: 0,
      latestScore: 0,
      latestPercentage: 0,
      classAverage: 0,
      classMedian: 0,
      topperScore: 0,
      standardDeviation: 0,
      percentileBand: "No papers",
      isSmallClass: false,
      trend: {
        lastThreeAverage: 0,
        previousThreeAverage: null,
        slope: 0,
        direction: "steady",
      },
      consistencyScore: 100,
      consistencyRating: "Baseline Established",
      weakestTopics: [],
      focusAreas: [],
      strongestTopics: [],
      biggestDrop: null,
      biggestImprovement: null,
      sectionAverages: {},
      radarData: [],
      paperHistory: [],
      insights: {
        strengthsSummary: "No papers have been marked yet.",
        weaknessesSummary: "Take your first paper to discover strengths and areas of growth.",
        trajectoryNote: "Performance projections will appear once initial results are published.",
        actionSteps: [
          "Review upcoming paper topics on the syllabus.",
          "Check special notes from Sir for recommended practice exercises.",
          "Sit for the next scheduled paper to establish your baseline.",
        ],
      },
    };
  }

  // Calculate overall student percentage (mean of paper percentages)
  const allStudentPercentages = studentPapers.map((sp) => sp.percentage);
  const overallPercentage = calculateMean(allStudentPercentages);

  // Latest paper data
  const latestPaper = studentPapers[studentPapers.length - 1];
  const latestScore = latestPaper.markRecord.marks;
  const latestPercentage = latestPaper.percentage;

  // Class benchmarks for the latest paper
  const classMarksForLatest = marksByPaper.get(latestPaper.paper.id) || [];
  const classScoresLatest = classMarksForLatest.map((m) => {
    const total = latestPaper.paper.totalMarks || 100;
    return round((m.marks / total) * 100, 1);
  });

  const isSmallClass = classScoresLatest.length < 5;
  const classAverage = isSmallClass ? 0 : calculateMean(classScoresLatest);
  const classMedian = isSmallClass ? 0 : calculateMedian(classScoresLatest);
  const topperScore = classScoresLatest.length ? Math.max(...classScoresLatest) : latestPercentage;
  const classStdDev = isSmallClass ? 0 : calculateStandardDeviation(classScoresLatest);
  const percentileBand = calculatePercentileBand(latestPercentage, classScoresLatest);

  // Paper history generation
  const paperHistory: PaperHistoryItem[] = studentPapers.map((sp) => {
    const paperScores = (marksByPaper.get(sp.paper.id) || []).map((m) =>
      round((m.marks / (sp.paper.totalMarks || 100)) * 100, 1)
    );
    const paperClassAvg = paperScores.length >= 5 ? calculateMean(paperScores) : 0;
    const paperTopper = paperScores.length ? Math.max(...paperScores) : sp.percentage;
    const band = calculatePercentileBand(sp.percentage, paperScores);

    return {
      paperId: sp.paper.id,
      paperTitle: sp.paper.title,
      date: sp.date,
      marksScored: sp.markRecord.marks,
      totalMarks: sp.paper.totalMarks || 100,
      studentPercentage: sp.percentage,
      classAveragePercentage: paperClassAvg,
      topperPercentage: paperTopper,
      percentileBand: band,
      sectionMarks: sp.markRecord.sectionMarks || undefined,
    };
  });

  // Calculate sequential drops and improvements
  let biggestDrop: AnalysisMetrics["biggestDrop"] = null;
  let biggestImprovement: AnalysisMetrics["biggestImprovement"] = null;

  for (let i = 1; i < studentPapers.length; i++) {
    const prev = studentPapers[i - 1];
    const curr = studentPapers[i];
    const diff = round(curr.percentage - prev.percentage, 1);

    if (diff < 0) {
      const dropAmount = Math.abs(diff);
      if (!biggestDrop || dropAmount > biggestDrop.dropPercentage) {
        biggestDrop = {
          paperTitle: curr.paper.title,
          dropPercentage: dropAmount,
          fromScore: prev.percentage,
          toScore: curr.percentage,
        };
      }
    } else if (diff > 0) {
      if (!biggestImprovement || diff > biggestImprovement.gainPercentage) {
        biggestImprovement = {
          paperTitle: curr.paper.title,
          gainPercentage: diff,
          fromScore: prev.percentage,
          toScore: curr.percentage,
        };
      }
    }
  }

  // Calculate trends (last 3 vs previous 3, and slope)
  let lastThreeAverage = latestPercentage;
  let previousThreeAverage: number | null = null;

  if (paperCount >= 3) {
    const last3 = allStudentPercentages.slice(-3);
    lastThreeAverage = calculateMean(last3);

    if (paperCount >= 6) {
      const prev3 = allStudentPercentages.slice(-6, -3);
      previousThreeAverage = calculateMean(prev3);
    } else if (paperCount > 3) {
      const prevRest = allStudentPercentages.slice(0, paperCount - 3);
      previousThreeAverage = calculateMean(prevRest);
    }
  } else {
    lastThreeAverage = calculateMean(allStudentPercentages);
  }

  const slope = calculateLinearSlope(allStudentPercentages);
  let direction: "improving" | "declining" | "steady" = "steady";
  if (slope > 0.8) direction = "improving";
  else if (slope < -0.8) direction = "declining";

  // Consistency
  const consistency = calculateConsistency(allStudentPercentages);

  // Section / Topic analysis
  // Collect all section scores across papers
  interface TopicAccumulator {
    studentScored: number;
    studentMax: number;
    classScored: number;
    classMax: number;
    topperScored: number;
    topperMax: number;
  }
  const topicMap = new Map<string, TopicAccumulator>();

  for (const sp of studentPapers) {
    const sectionsDef = sp.paper.sections || [];
    const secMaxMap = new Map<string, number>();
    for (const sec of sectionsDef) {
      secMaxMap.set(sec.name.toLowerCase().trim(), sec.max);
    }

    const studentSecMarks = sp.markRecord.sectionMarks || {};
    const classMarksForPaper = marksByPaper.get(sp.paper.id) || [];

    for (const [secName, studentScore] of Object.entries(studentSecMarks)) {
      const normKey = secName.toLowerCase().trim();
      const maxMarks = secMaxMap.get(normKey) || 25; // default fallback if max omitted

      const acc = topicMap.get(normKey) || {
        studentScored: 0,
        studentMax: 0,
        classScored: 0,
        classMax: 0,
        topperScored: 0,
        topperMax: 0,
      };

      acc.studentScored += Number(studentScore);
      acc.studentMax += maxMarks;

      // Class section aggregate
      let paperMaxTopicScore = Number(studentScore);
      for (const cm of classMarksForPaper) {
        const cmSec = cm.sectionMarks || {};
        if (normKey in cmSec) {
          const score = Number(cmSec[normKey]);
          acc.classScored += score;
          acc.classMax += maxMarks;
          if (score > paperMaxTopicScore) {
            paperMaxTopicScore = score;
          }
        }
      }

      acc.topperScored += paperMaxTopicScore;
      acc.topperMax += maxMarks;

      topicMap.set(normKey, acc);
    }
  }

  const radarData: AnalysisMetrics["radarData"] = [];
  const sectionAverages: NonNullable<AnalysisMetrics["sectionAverages"]> = {};
  const topicPercentages: { topic: string; percentage: number }[] = [];

  for (const [topicKey, acc] of topicMap.entries()) {
    const studentPerc = acc.studentMax > 0 ? round((acc.studentScored / acc.studentMax) * 100, 1) : 0;
    const classAvgPerc = acc.classMax > 0 ? round((acc.classScored / acc.classMax) * 100, 1) : 0;
    const topperPerc = acc.topperMax > 0 ? round((acc.topperScored / acc.topperMax) * 100, 1) : studentPerc;

    // Capitalize topic for display
    const formattedTopic = topicKey.charAt(0).toUpperCase() + topicKey.slice(1);

    radarData.push({
      topic: formattedTopic,
      student: studentPerc,
      classAvg: isSmallClass ? 0 : classAvgPerc,
      topper: topperPerc,
    });

    sectionAverages[formattedTopic] = {
      student: studentPerc,
      classAvg: isSmallClass ? 0 : classAvgPerc,
      topper: topperPerc,
    };

    topicPercentages.push({
      topic: formattedTopic,
      percentage: studentPerc,
    });
  }

  // Sort topics by score
  topicPercentages.sort((a, b) => a.percentage - b.percentage);

  const weakestTopicsList = topicPercentages.slice(0, 3);
  const strongestTopicsList = [...topicPercentages].reverse().slice(0, 3);

  const focusAreas: FocusArea[] = weakestTopicsList.map((t) => ({
    topic: t.topic,
    percentage: t.percentage,
    tip: getTopicTip(t.topic),
  }));

  // Fallback focus areas if no section marks entered on papers yet
  if (focusAreas.length === 0) {
    focusAreas.push({
      topic: "Core Fundamentals",
      percentage: overallPercentage,
      tip: "Ask Sir to include section breakdowns on upcoming papers for granular diagnostic tips.",
    });
  }

  // Rule-based insights generation
  const insights = generateInsights({
    overallPercentage,
    paperCount,
    latestPercentage,
    slope,
    direction,
    consistency,
    strongestTopics: strongestTopicsList.map((t) => t.topic),
    weakestTopics: weakestTopicsList.map((t) => t.topic),
    focusAreas,
    biggestDrop,
    biggestImprovement,
    percentileBand,
    isSmallClass,
  });

  return {
    percentage: overallPercentage,
    paperCount,
    latestScore,
    latestPercentage,
    classAverage,
    classMedian,
    topperScore,
    standardDeviation: classStdDev,
    percentileBand,
    isSmallClass,
    trend: {
      lastThreeAverage,
      previousThreeAverage,
      slope,
      direction,
    },
    consistencyScore: consistency.score,
    consistencyRating: consistency.rating,
    weakestTopics: weakestTopicsList.map((t) => t.topic),
    focusAreas,
    strongestTopics: strongestTopicsList.map((t) => t.topic),
    biggestDrop,
    biggestImprovement,
    sectionAverages,
    radarData,
    paperHistory,
    insights,
  };
}

interface InsightsParam {
  overallPercentage: number;
  paperCount: number;
  latestPercentage: number;
  slope: number;
  direction: "improving" | "declining" | "steady";
  consistency: { score: number; rating: string };
  strongestTopics: string[];
  weakestTopics: string[];
  focusAreas: FocusArea[];
  biggestDrop?: AnalysisMetrics["biggestDrop"];
  biggestImprovement?: AnalysisMetrics["biggestImprovement"];
  percentileBand: string;
  isSmallClass: boolean;
}

function generateInsights(params: InsightsParam): RuleBasedInsights {
  const {
    overallPercentage,
    latestPercentage,
    direction,
    consistency,
    strongestTopics,
    weakestTopics,
    focusAreas,
    biggestDrop,
    biggestImprovement,
    percentileBand,
  } = params;

  // Strengths summary
  let strengthsSummary = "";
  if (strongestTopics.length > 0) {
    strengthsSummary = `Demonstrates solid mastery in ${strongestTopics.join(
      ", "
    )} with consistent high returns. Overall scoring average stands at ${overallPercentage}%.`;
  } else if (overallPercentage >= 75) {
    strengthsSummary = `Demonstrating strong overall competence with an average of ${overallPercentage}%, placing in the ${percentileBand} bracket.`;
  } else {
    strengthsSummary = `Demonstrating consistent effort across sessions with foundational grasp at ${overallPercentage}%.`;
  }

  // Weaknesses summary
  let weaknessesSummary = "";
  if (weakestTopics.length > 0) {
    weaknessesSummary = `Primary growth opportunities are concentrated in ${weakestTopics.join(
      ", "
    )}. Focused revision in these sections will yield the quickest grade jump.`;
  } else if (latestPercentage < overallPercentage) {
    weaknessesSummary = `The latest paper (${latestPercentage}%) was below the historical average (${overallPercentage}%). Review recent questions to patch conceptual slips.`;
  } else {
    weaknessesSummary =
      "Maintain active practice to prevent erosion on tricky speed and accuracy test papers.";
  }

  // Trajectory note
  let trajectoryNote = "";
  const projectedEstimate = round(latestPercentage + params.slope * 2, 0);
  const boundedProjected = Math.max(10, Math.min(100, projectedEstimate));

  if (direction === "improving") {
    trajectoryNote = `Ascending performance trajectory (+${params.slope}%/paper). At current pace, projected benchmark for the upcoming paper is ~${boundedProjected}%. (Estimated projection)`;
  } else if (direction === "declining") {
    trajectoryNote = `Performance has softened by ${Math.abs(params.slope)}%/paper over recent tests. Quick remediation in focus areas will arrest this trend. (Estimated projection)`;
  } else {
    trajectoryNote = `Maintaining a steady benchmark (~${overallPercentage}%). Consistency rating is ${consistency.rating}. Target +5% on the next paper. (Estimated projection)`;
  }

  // 3 Concrete action steps
  const actionSteps: [string, string, string] = [
    focusAreas[0]?.tip ||
      "Complete 5 timed textbook questions under exam conditions before each class.",
    focusAreas[1]?.tip ||
      "Review mistakes from the latest paper marking scheme and redo incorrect steps.",
    "Clarify unclear steps with Sir during the live session or post-paper review.",
  ];

  // Drop or gain alert note
  let dropOrGainAlert: string | undefined = undefined;
  if (biggestImprovement && biggestImprovement.gainPercentage >= 10) {
    dropOrGainAlert = `Notable breakthrough: +${biggestImprovement.gainPercentage}% jump recorded on ${biggestImprovement.paperTitle}!`;
  } else if (biggestDrop && biggestDrop.dropPercentage >= 12) {
    dropOrGainAlert = `Watch out: -${biggestDrop.dropPercentage}% drop experienced on ${biggestDrop.paperTitle}. Revisit the difficult sections of that paper.`;
  }

  return {
    strengthsSummary,
    weaknessesSummary,
    trajectoryNote,
    actionSteps,
    dropOrGainAlert,
  };
}
