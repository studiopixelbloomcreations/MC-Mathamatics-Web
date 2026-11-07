"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
    return <div className="h-64 sm:h-72 w-full animate-pulse bg-white/5 rounded-2xl" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[var(--border)] rounded-2xl">
        <p className="text-sm text-[var(--muted)]">No paper history available yet.</p>
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
        <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGoldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.22} />
              <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="avgSlateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="var(--muted)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="var(--muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip
            cursor={{ stroke: "var(--brand)", strokeWidth: 1, strokeDasharray: "2 2" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#0c0d10]/95 border border-[var(--brand)]/30 backdrop-blur-md p-3 rounded-xl shadow-2xl text-xs space-y-1 select-none">
                    <p className="font-semibold text-[var(--brand)]">{item.fullTitle}</p>
                    <p className="text-[var(--muted)] [font-feature-settings:'tnum'_1]">Date: {item.date}</p>
                    <p className="font-mono font-bold text-white [font-feature-settings:'tnum'_1]">
                      Your Score: {item.studentScore}%
                    </p>
                    {item.classAverage !== undefined && (
                      <p className="text-zinc-400 font-mono [font-feature-settings:'tnum'_1]">
                        Class Avg: {item.classAverage}%
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="studentScore"
            name="Your Performance (%)"
            stroke="var(--brand)"
            strokeWidth={1.5}
            fill="url(#scoreGoldGradient)"
            animationDuration={800}
          />
          {chartData.some((d) => d.classAverage !== undefined) && (
            <Area
              type="monotone"
              dataKey="classAverage"
              name="Class Average (%)"
              stroke="#94a3b8"
              strokeWidth={1.2}
              strokeDasharray="4 4"
              fill="url(#avgSlateGradient)"
              animationDuration={800}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
