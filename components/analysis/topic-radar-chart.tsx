"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";

interface TopicRadarProps {
  data: Array<{
    topic: string;
    student: number;
    classAvg: number;
    topper: number;
  }>;
  isSmallClass?: boolean;
}

export function TopicRadarChart({ data, isSmallClass }: TopicRadarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 sm:h-72 w-full animate-pulse bg-white/5 rounded-xl" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
        <p className="text-sm font-semibold text-foreground">Section Breakdown Pending</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Topic data unlocks when Sir records marks with section breakdowns on upcoming papers.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.12)" />
          <PolarAngleAxis
            dataKey="topic"
            stroke="rgba(255, 255, 255, 0.7)"
            fontSize={11}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="rgba(255, 255, 255, 0.2)"
            fontSize={10}
            tick={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-neutral-900/95 border border-blue-500/30 backdrop-blur-md p-3 rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-bold text-blue-500">{item.topic}</p>
                    <p className="text-emerald-400 font-semibold">
                      Your Score: {item.student}%
                    </p>
                    {!isSmallClass && item.classAvg > 0 && (
                      <p className="text-sky-400">Class Avg: {item.classAvg}%</p>
                    )}
                    <p className="text-blue-400">Topper (Top 1): {item.topper}%</p>
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
            wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
          />
          <Radar
            name="Your Mastery"
            dataKey="student"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
            animationDuration={1300}
          />
          {!isSmallClass && (
            <Radar
              name="Class Avg"
              dataKey="classAvg"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.2}
              animationDuration={1500}
            />
          )}
          <Radar
            name="Class Topper"
            dataKey="topper"
            stroke="#fbbf24"
            fill="#fbbf24"
            fillOpacity={0.15}
            animationDuration={1700}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
