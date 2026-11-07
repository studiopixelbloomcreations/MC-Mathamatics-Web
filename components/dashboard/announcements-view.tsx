"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Bell, Pin, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  targetGrade?: number | null;
  createdAt: string;
}

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

export function AnnouncementsView({
  announcements,
}: AnnouncementsViewProps) {
  if (announcements.length === 0) {
    return (
      <GlassCard className="p-12 text-center space-y-3">
        <Bell className="w-10 h-10 text-muted-foreground mx-auto" />
        <h3 className="font-bold text-lg text-foreground">
          No Announcements Active
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          All class circulars, holiday schedules, and revision seminar alerts will appear here.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((item) => (
        <GlassCard
          key={item.id}
          className={`p-6 border-white/10 transition-all ${
            item.pinned
              ? "border-blue-500/40 bg-blue-500/5 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20"
              : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              {item.pinned && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold font-mono uppercase">
                  <Pin className="w-3 h-3 fill-current" />
                  <span>Pinned</span>
                </div>
              )}

              {item.targetGrade ? (
                <Badge variant="accent" className="text-[10px]">
                  Grade {item.targetGrade} Specific
                </Badge>
              ) : (
                <Badge variant="default" className="text-[10px]">
                  All Grades
                </Badge>
              )}

              <h4 className="font-bold text-base text-foreground">
                {item.title}
              </h4>
            </div>

            <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 self-start sm:self-center">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="pt-4">
            <p className="text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
              {item.body}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
