import { describe, expect, it } from "vitest";
import {
  calculateConsistency,
  calculateLinearSlope,
  calculateMean,
  calculateMedian,
  calculatePercentileBand,
  calculateStandardDeviation,
  computeStudentAnalysis,
  getTopicTip,
  round,
} from "../lib/analysis/engine";
import { RawMarkRecord, RawPaperRecord } from "../lib/analysis/types";

describe("Analysis Engine - Core Math Utilities", () => {
  it("rounds values accurately and handles invalid numbers", () => {
    expect(round(85.456, 1)).toBe(85.5);
    expect(round(85.444, 1)).toBe(85.4);
    expect(round(85.456, 2)).toBe(85.46);
    expect(round(NaN)).toBe(0);
    expect(round(Infinity)).toBe(0);
  });

  it("calculates mean correctly", () => {
    expect(calculateMean([])).toBe(0);
    expect(calculateMean([75])).toBe(75);
    expect(calculateMean([60, 80, 100])).toBe(80);
    expect(calculateMean([70, 72, 75])).toBe(72.3);
  });

  it("calculates median for odd and even length arrays", () => {
    expect(calculateMedian([])).toBe(0);
    expect(calculateMedian([50])).toBe(50);
    expect(calculateMedian([90, 40, 70])).toBe(70); // unsorted 40, 70, 90 -> 70
    expect(calculateMedian([40, 60, 80, 100])).toBe(70); // 60 + 80 / 2 = 70
  });

  it("calculates population standard deviation", () => {
    expect(calculateStandardDeviation([])).toBe(0);
    expect(calculateStandardDeviation([80])).toBe(0);
    expect(calculateStandardDeviation([80, 80, 80])).toBe(0);
    // [10, 20, 30] -> mean 20 -> var (100+0+100)/3 = 66.67 -> sqrt = 8.16
    expect(calculateStandardDeviation([10, 20, 30])).toBe(8.2);
  });

  it("determines percentile bands and respects small classes (<5)", () => {
    expect(calculatePercentileBand(80, [])).toBe("Core Band");
    expect(calculatePercentileBand(80, [60, 70, 80])).toBe("Class < 5");
    expect(calculatePercentileBand(80, [50, 60, 70, 80])).toBe("Class < 5");

    // 10 students: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    const peers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(calculatePercentileBand(95, peers)).toBe("Top 10%"); // 9/10 = 90%
    expect(calculatePercentileBand(80, peers)).toBe("Top 25%"); // 8/10 = 80%
    expect(calculatePercentileBand(60, peers)).toBe("Top 50%"); // 6/10 = 60%
    expect(calculatePercentileBand(30, peers)).toBe("Core Band"); // 3/10 = 30%
  });

  it("calculates linear slope across time series", () => {
    expect(calculateLinearSlope([])).toBe(0);
    expect(calculateLinearSlope([70])).toBe(0);
    expect(calculateLinearSlope([60, 70, 80])).toBe(10); // slope is +10 per step
    expect(calculateLinearSlope([80, 70, 60])).toBe(-10); // slope is -10 per step
    expect(calculateLinearSlope([75, 75, 75])).toBe(0);
  });

  it("calculates consistency score and rating", () => {
    expect(calculateConsistency([]).rating).toBe("Baseline Established");
    expect(calculateConsistency([80]).rating).toBe("Baseline Established");

    // Very steady scores (std dev close to 0)
    const steady = calculateConsistency([82, 83, 82, 84]);
    expect(steady.score).toBeGreaterThanOrEqual(90);
    expect(steady.rating).toBe("Exceptionally Stable");

    // Wildly fluctuating scores
    const volatile = calculateConsistency([20, 95, 30, 90, 15]);
    expect(volatile.score).toBeLessThan(55);
    expect(volatile.rating).toBe("Volatile");
  });

  it("returns specific math tips for topics", () => {
    expect(getTopicTip("Algebra")).toContain("quadratic factorization");
    expect(getTopicTip("Circle Geometry")).toContain("circle angle theorems");
    expect(getTopicTip("Trigonometry")).toContain("sin/cos/tan");
    expect(getTopicTip("Integration & Calculus")).toContain("chain rule");
    expect(getTopicTip("Unknown Custom Topic")).toContain("timed past paper");
  });
});

describe("Analysis Engine - Full Student Analysis", () => {
  const dummyPapers: RawPaperRecord[] = [
    {
      id: "p1",
      title: "Paper 01 - Diagnostic",
      grade: 10,
      paperDate: "2026-01-10",
      totalMarks: 100,
      sections: [
        { name: "Algebra", max: 50 },
        { name: "Geometry", max: 50 },
      ],
    },
    {
      id: "p2",
      title: "Paper 02 - Mid Term",
      grade: 10,
      paperDate: "2026-02-15",
      totalMarks: 100,
      sections: [
        { name: "Algebra", max: 50 },
        { name: "Geometry", max: 50 },
      ],
    },
    {
      id: "p3",
      title: "Paper 03 - Monthly Test",
      grade: 10,
      paperDate: "2026-03-20",
      totalMarks: 100,
      sections: [
        { name: "Algebra", max: 50 },
        { name: "Geometry", max: 50 },
      ],
    },
  ];

  it("handles empty student marks gracefully", () => {
    const result = computeStudentAnalysis({
      studentId: "s1",
      studentMarks: [],
      allMarks: [],
      papers: dummyPapers,
    });

    expect(result.paperCount).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.percentileBand).toBe("No papers");
    expect(result.insights.strengthsSummary).toContain("No papers");
    expect(result.insights.actionSteps.length).toBe(3);
  });

  it("computes single-paper baseline analysis", () => {
    const studentMarks: RawMarkRecord[] = [
      {
        id: "m1",
        studentId: "s1",
        paperId: "p1",
        marks: 85,
        sectionMarks: { Algebra: 45, Geometry: 40 },
      },
    ];

    const result = computeStudentAnalysis({
      studentId: "s1",
      studentMarks,
      allMarks: studentMarks,
      papers: dummyPapers,
    });

    expect(result.paperCount).toBe(1);
    expect(result.latestScore).toBe(85);
    expect(result.percentage).toBe(85);
    expect(result.trend.slope).toBe(0);
    expect(result.trend.lastThreeAverage).toBe(85);
    expect(result.trend.previousThreeAverage).toBeNull();
    expect(result.consistencyRating).toBe("Baseline Established");
    expect(result.isSmallClass).toBe(true); // only 1 student in class for paper 1
    expect(result.radarData.length).toBe(2);
  });

  it("correctly identifies biggest drop, biggest improvement, and class benchmarks", () => {
    const studentMarks: RawMarkRecord[] = [
      {
        id: "m1",
        studentId: "s1",
        paperId: "p1",
        marks: 60, // Paper 1: 60%
        sectionMarks: { Algebra: 30, Geometry: 30 },
      },
      {
        id: "m2",
        studentId: "s1",
        paperId: "p2",
        marks: 90, // Paper 2: 90% (+30% improvement!)
        sectionMarks: { Algebra: 48, Geometry: 42 },
      },
      {
        id: "m3",
        studentId: "s1",
        paperId: "p3",
        marks: 75, // Paper 3: 75% (-15% drop!)
        sectionMarks: { Algebra: 42, Geometry: 33 },
      },
    ];

    // Mock 5 class peers for Paper 3 to test full class comparison
    const allMarks: RawMarkRecord[] = [
      ...studentMarks,
      { id: "cm1", studentId: "s2", paperId: "p3", marks: 50 },
      { id: "cm2", studentId: "s3", paperId: "p3", marks: 65 },
      { id: "cm3", studentId: "s4", paperId: "p3", marks: 70 },
      { id: "cm4", studentId: "s5", paperId: "p3", marks: 95 },
      { id: "cm5", studentId: "s6", paperId: "p3", marks: 80 },
    ];

    const result = computeStudentAnalysis({
      studentId: "s1",
      studentMarks,
      allMarks,
      papers: dummyPapers,
    });

    expect(result.paperCount).toBe(3);
    expect(result.percentage).toBe(75); // (60 + 90 + 75) / 3 = 75%
    expect(result.latestScore).toBe(75);

    // Biggest improvement was from P1 (60) to P2 (90)
    expect(result.biggestImprovement?.gainPercentage).toBe(30);
    expect(result.biggestImprovement?.paperTitle).toBe("Paper 02 - Mid Term");

    // Biggest drop was from P2 (90) to P3 (75)
    expect(result.biggestDrop?.dropPercentage).toBe(15);
    expect(result.biggestDrop?.paperTitle).toBe("Paper 03 - Monthly Test");

    // Class benchmarks (6 students in p3: 75, 50, 65, 70, 95, 80)
    expect(result.isSmallClass).toBe(false);
    expect(result.topperScore).toBe(95);
    expect(result.classAverage).toBe(72.5); // (75+50+65+70+95+80)/6 = 435/6 = 72.5
    expect(result.percentileBand).toBe("Top 50%");

    // Verify topic summaries
    expect(result.radarData.length).toBe(2);
    expect(result.weakestTopics.length).toBeGreaterThan(0);
    expect(result.insights.actionSteps.length).toBe(3);
  });

  it("handles declining slope and generates corresponding trajectory notes", () => {
    const studentMarks: RawMarkRecord[] = [
      { id: "m1", studentId: "s1", paperId: "p1", marks: 95 },
      { id: "m2", studentId: "s1", paperId: "p2", marks: 75 },
      { id: "m3", studentId: "s1", paperId: "p3", marks: 55 },
    ];

    const result = computeStudentAnalysis({
      studentId: "s1",
      studentMarks,
      allMarks: studentMarks,
      papers: dummyPapers,
    });

    expect(result.trend.direction).toBe("declining");
    expect(result.trend.slope).toBeLessThan(-5);
    expect(result.insights.trajectoryNote).toContain("softened");
  });

  it("handles missing section marks without crashing", () => {
    const studentMarks: RawMarkRecord[] = [
      {
        id: "m1",
        studentId: "s1",
        paperId: "p1",
        marks: 70,
        // no sectionMarks provided
      },
    ];

    const result = computeStudentAnalysis({
      studentId: "s1",
      studentMarks,
      allMarks: studentMarks,
      papers: dummyPapers,
    });

    expect(result.radarData).toEqual([]);
    expect(result.focusAreas[0].topic).toBe("Core Fundamentals");
    expect(result.insights.strengthsSummary).toBeDefined();
  });
});
