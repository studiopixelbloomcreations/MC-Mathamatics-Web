"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, Sparkles } from "lucide-react";
import { markSpecialNoteAsReadAction } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";

interface SpecialNote {
  id: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface SpecialNotesViewProps {
  notes: SpecialNote[];
}

export function SpecialNotesView({ notes: initialNotes }: SpecialNotesViewProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);

  const handleMarkAsRead = async (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markSpecialNoteAsReadAction(id);
    router.refresh();
  };

  if (notes.length === 0) {
    return (
      <GlassCard className="p-12 text-center space-y-3">
        <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
        <h3 className="font-bold text-lg text-foreground">
          No Private Notes Yet
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          When Sir observes specific strengths or downfalls in your paper submissions, personal feedback and encouragement notes will appear here.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <GlassCard
          key={note.id}
          className={`p-6 border-white/10 transition-all ${
            !note.isRead
              ? "border-amber-500/40 bg-amber-500/5 shadow-md shadow-amber-500/5"
              : "opacity-85"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-foreground">
                  Malinga C Dissanayake
                </span>
                <span className="text-[11px] text-muted-foreground block font-mono">
                  Personal Teacher Feedback
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(note.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              {!note.isRead ? (
                <Badge variant="accent">New Feedback</Badge>
              ) : (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Read
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              &ldquo;{note.body}&rdquo;
            </p>

            {!note.isRead && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAsRead(note.id)}
                  className="text-xs gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as read</span>
                </Button>
              </div>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
