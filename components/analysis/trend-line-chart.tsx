"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PaperHistoryItem } from "@/lib/analysis/types";

interface TrendLineChartProps {
  data: PaperHistoryItem[];
  isSmallClass?: boolean;
}

export function TrendLineChart({ data, isSmallClass }: TrendLineChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 sm:h-72 w-full animate-pulse bg-white/5 rounded-xl" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
        <p className="text-sm text-muted-foreground">No paper history available yet.</p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.paperTitle.length > 14 ? `P${index + 1}` : item.paperTitle,
    fullTitle: item.paperTitle,
    date: item.date,
    studentScore: item.studentPercentage,
    classAverage: isSmallClass || item.classAveragePercentage === 0 ? undefined : item.classAveragePercentage,
  }));

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="rgba(255, 255, 255, 0.4)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
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
                    <p className="font-bold text-amber-400">{item.fullTitle}</p>
                    <p className="text-muted-foreground">Date: {item.date}</p>
                    <p className="font-semibold text-emerald-400">
                      Your Score: {item.studentScore}%
                    </p>
                    {item.classAverage !== undefined && (
                      <p className="text-sky-400">
                        Class Avg: {item.classAverage}%
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
          />
          <Line
            type="monotone"
            dataKey="studentScore"
            name="Your Performance (%)"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#022c22" }}
            activeDot={{ r: 7, fill: "#34d399" }}
            animationDuration={1200}
          />
          {!isSmallClass && (
            <Line
              type="monotone"
              dataKey="classAverage"
              name="Class Average (%)"
              stroke="#38bdf8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              animationDuration={1500}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
