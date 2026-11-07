export interface TopicScore {
  name: string;
  studentPercentage: number;
  classAveragePercentage: number;
  topperPercentage: number;
  totalQuestionsOrWeight?: number;
}

export interface FocusArea {
  topic: string;
  percentage: number;
  tip: string;
}

export interface PaperHistoryItem {
  paperId: string;
  paperTitle: string;
  date: string;
  marksScored: number;
  totalMarks: number;
  studentPercentage: number;
  classAveragePercentage: number;
  topperPercentage: number;
  percentileBand: string;
  sectionMarks?: Record<string, number>;
}

export interface RuleBasedInsights {
  strengthsSummary: string;
  weaknessesSummary: string;
  trajectoryNote: string;
  actionSteps: [string, string, string];
  dropOrGainAlert?: string;
}

export interface AnalysisMetrics {
  percentage: number; // overall percentage (weighted or mean)
  paperCount: number;
  latestScore: number;
  latestPercentage: number;
  classAverage: number;
  classMedian: number;
  topperScore: number;
  standardDeviation: number;
  percentileBand: string;
  isSmallClass: boolean; // true if class has < 5 students, class comparisons hidden
  trend: {
    lastThreeAverage: number;
    previousThreeAverage: number | null;
    slope: number;
    direction: "improving" | "declining" | "steady";
  };
  consistencyScore: number; // 0-100
  consistencyRating: "Exceptionally Stable" | "Consistent" | "Moderate Variance" | "Volatile" | "Baseline Established";
  weakestTopics: string[];
  focusAreas: FocusArea[];
  strongestTopics: string[];
  biggestDrop?: {
    paperTitle: string;
    dropPercentage: number;
    fromScore: number;
    toScore: number;
  } | null;
  biggestImprovement?: {
    paperTitle: string;
    gainPercentage: number;
    fromScore: number;
    toScore: number;
  } | null;
  sectionAverages?: Record<string, { student: number; classAvg: number; topper: number }>;
  radarData: { topic: string; student: number; classAvg: number; topper: number }[];
  paperHistory: PaperHistoryItem[];
  insights: RuleBasedInsights;
}

export interface RawMarkRecord {
  id: string;
  studentId: string;
  paperId: string;
  marks: number;
  sectionMarks?: Record<string, number> | null;
  enteredAt?: string;
}

export interface RawPaperRecord {
  id: string;
  title: string;
  grade: number;
  paperDate?: string;
  totalMarks: number;
  sections?: Array<{ name: string; max: number }> | null;
}
