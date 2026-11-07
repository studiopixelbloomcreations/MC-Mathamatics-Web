"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { AnalysisMetrics } from "@/lib/analysis/types";

interface ComparisonBarChartProps {
  metrics: AnalysisMetrics;
}

export function ComparisonBarChart({ metrics }: ComparisonBarChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 sm:h-72 w-full animate-pulse bg-white/5 rounded-xl" />;
  }

  const {
    latestPercentage,
    trend,
    classAverage,
    topperScore,
    isSmallClass,
  } = metrics;

  const previousPaperScore =
    metrics.paperHistory.length >= 2
      ? metrics.paperHistory[metrics.paperHistory.length - 2].studentPercentage
      : null;

  const barData: Array<{ category: string; score: number; color: string; desc: string }> = [
    {
      category: "Latest Paper",
      score: latestPercentage,
      color: "#10b981",
      desc: "Your latest score",
    },
  ];

  if (previousPaperScore !== null) {
    barData.push({
      category: "Previous Paper",
      score: previousPaperScore,
      color: "#6366f1",
      desc: "Score on preceding test",
    });
  }

  if (trend.lastThreeAverage > 0) {
    barData.push({
      category: "Last 3 Avg",
      score: trend.lastThreeAverage,
      color: "#8b5cf6",
      desc: "Average across last 3 papers",
    });
  }

  if (!isSmallClass && classAverage > 0) {
    barData.push({
      category: "Class Average",
      score: classAverage,
      color: "#38bdf8",
      desc: "Grade benchmark",
    });
  }

  if (topperScore > 0) {
    barData.push({
      category: "Class Topper",
      score: topperScore,
      color: "#f59e0b",
      desc: "Top score recorded (anonymous)",
    });
  }

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
          <XAxis
            dataKey="category"
            stroke="rgba(255, 255, 255, 0.6)"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="rgba(255, 255, 255, 0.4)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-neutral-900/95 border border-amber-500/30 backdrop-blur-md p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-bold text-amber-400">{item.category}</p>
                    <p className="text-white font-semibold">{item.score}%</p>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} animationDuration={1200}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
