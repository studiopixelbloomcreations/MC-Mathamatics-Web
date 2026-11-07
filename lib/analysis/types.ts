export interface AnalysisMetrics {
  percentage: number;
  classAverage: number;
  classMedian: number;
  topperScore: number;
  standardDeviation: number;
  percentileBand: string;
  trend: {
    lastThreeAverage: number;
    previousThreeAverage: number;
    slope: number;
  };
  sectionAverages?: Record<string, { student: number; classAvg: number }>;
  weakestTopics: string[];
  biggestDrop?: string;
  biggestImprovement?: string;
  consistencyScore: number;
}
