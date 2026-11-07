"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { getAdminStudents, createStudentSpecialNote } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

interface StudentItem {
  id: string;
  unique_id: string;
  full_name: string;
  grade: number;
}

interface SpecialNoteItem {
  id: string;
  student_id: string;
  note: string;
  read: boolean;
  created_at: string;
  students?: { unique_id: string; full_name: string };
}

export default function AdminSpecialNotesPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [notes, setNotes] = useState<SpecialNoteItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    try {
      const studentData = await getAdminStudents();
      setStudents(studentData as StudentItem[]);

      const supabase = createClient();
      const { data } = await supabase
        .from("special_notes")
        .select("*, students(unique_id, full_name)")
        .order("created_at", { ascending: false });
      if (data) setNotes(data as unknown as SpecialNoteItem[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !noteText.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      await createStudentSpecialNote({
        studentId: selectedStudentId,
        note: noteText,
      });

      setMessage({ text: "Special note dispatched to student feed!", type: "success" });
      setNoteText("");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send note";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Special Notes to Students</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Private diagnostic notes and personalized praise/guidance sent directly from Sir to student portals.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Note Composition Box */}
      <GlassCard className="p-6">
        <form onSubmit={handleSendNote} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Select Recipient Student
            </label>
            <select
              className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-xs text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
            >
              <option value="">Select Student by ID or Name</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.unique_id} — {s.full_name} (Grade {s.grade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Sir&apos;s Note Content
            </label>
            <textarea
              className="w-full mt-1 p-3 rounded-lg bg-zinc-900 border border-white/15 text-xs text-foreground focus:ring-2 focus:ring-blue-500 outline-none h-28"
              placeholder="e.g. Excellent progress in yesterday&apos;s paper, especially quadratic questions! Keep revising circle theorems for this Saturday."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !selectedStudentId}
              className="bg-blue-600 hover:bg-blue-500 text-black font-bold text-xs h-9 px-6 gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? "Dispatching..." : "Send Private Note"}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Dispatched Notes Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground">Dispatched Special Notes</h3>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground text-xs">
              No special notes recorded yet.
            </GlassCard>
          ) : (
            notes.map((n) => (
              <GlassCard key={n.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-500 font-bold">
                      {n.students?.unique_id || "Student"}
                    </span>
                    <span className="text-muted-foreground">• {n.students?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        n.read
                          ? "bg-white/10 text-muted-foreground"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {n.read ? "Read by student" : "Unread"}
                    </span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {n.note}
                </p>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
