"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAdminPapers,
  getAdminStudents,
  enterStudentMark,
  bulkEnterStudentMarks,
} from "@/app/actions/admin";
import { GraduationCap, CheckCircle2, AlertCircle, Save, Layers } from "lucide-react";

interface StudentItem {
  id: string;
  unique_id: string;
  full_name: string;
  grade: number;
}

interface PaperItem {
  id: string;
  title: string;
  grade: number;
  total_marks: number;
  sections?: Array<{ name: string; max: number }>;
}

export default function AdminMarksPage() {
  const [grade, setGrade] = useState("10");
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Single entry form
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [singleMark, setSingleMark] = useState("");
  const [sectionMarks, setSectionMarks] = useState<Record<string, number>>({});

  // Bulk entry form
  const [bulkMarks, setBulkMarks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [papersData, studentsData] = await Promise.all([
          getAdminPapers(Number(grade)),
          getAdminStudents("", Number(grade)),
        ]);
        setPapers(papersData as PaperItem[]);
        setStudents(studentsData as StudentItem[]);
        if (papersData && papersData.length > 0) {
          setSelectedPaperId(papersData[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [grade]);

  const selectedPaper = papers.find((p) => p.id === selectedPaperId);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedPaperId || singleMark === "") return;
    setLoading(true);
    setMessage(null);

    try {
      await enterStudentMark({
        studentId: selectedStudentId,
        paperId: selectedPaperId,
        marks: Number(singleMark),
        sectionMarks,
      });

      setMessage({
        text: "Mark recorded and student analysis recomputed successfully!",
        type: "success",
      });
      setSingleMark("");
      setSectionMarks({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record mark";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!selectedPaperId) return;
    setLoading(true);
    setMessage(null);

    try {
      const entries: Array<{ studentId: string; marks: number }> = [];
      for (const [studentId, markVal] of Object.entries(bulkMarks)) {
        if (markVal !== "" && !isNaN(Number(markVal))) {
          entries.push({ studentId, marks: Number(markVal) });
        }
      }

      if (entries.length === 0) {
        setMessage({ text: "No marks entered in the class table.", type: "error" });
        setLoading(false);
        return;
      }

      await bulkEnterStudentMarks(selectedPaperId, entries);
      setMessage({
        text: `Successfully entered marks for ${entries.length} students with analyses recomputed!`,
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to enter marks";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Mark Entry & Auto-Analysis</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Enter paper marks individually or class-wide. Recomputes analysis engine and triggers realtime dashboard update.
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

      {/* Grade and Paper Selector */}
      <GlassCard className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Filter Grade
            </label>
            <select
              className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-sm text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Select Paper
            </label>
            <select
              className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-sm text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
            >
              {papers.length === 0 ? (
                <option value="">No papers available for Grade {grade}</option>
              ) : (
                papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (Max: {p.total_marks} marks)
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Single Student Mark Entry */}
        <GlassCard className="p-6 space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-foreground">Single Student Entry</h3>
          </div>

          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Student
              </label>
              <select
                className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-xs text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.unique_id} — {s.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Total Marks (out of {selectedPaper?.total_marks || 100})
              </label>
              <Input
                type="number"
                placeholder="e.g. 78"
                value={singleMark}
                onChange={(e) => setSingleMark(e.target.value)}
                required
                className="mt-1 font-mono text-sm"
              />
            </div>

            {/* Optional Section Breakdown */}
            {selectedPaper?.sections && selectedPaper.sections.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  Section Marks
                </span>
                {selectedPaper.sections.map((sec) => (
                  <div key={sec.name} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {sec.name} (max {sec.max})
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={sectionMarks[sec.name] ?? ""}
                      onChange={(e) =>
                        setSectionMarks({
                          ...sectionMarks,
                          [sec.name]: Number(e.target.value),
                        })
                      }
                      className="h-8 w-20 text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !selectedStudentId || !selectedPaperId}
              className="w-full bg-blue-600 hover:bg-blue-500 text-black font-bold text-xs h-9 mt-2"
            >
              {loading ? "Recording..." : "Save & Recompute"}
            </Button>
          </form>
        </GlassCard>

        {/* Bulk Class Mark Entry Table */}
        <GlassCard className="p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-foreground">Class Bulk Entry Table</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBulkSubmit}
              disabled={loading || students.length === 0}
              className="h-8 text-xs gap-1.5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Save className="w-3.5 h-3.5" />
              Save All Marks
            </Button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                  <th className="py-2 px-3">Unique ID</th>
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3 text-right">Marks (/{selectedPaper?.total_marks || 100})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted-foreground">
                      No students enrolled in Grade {grade}.
                    </td>
                  </tr>
                ) : (
                  students.map((st) => (
                    <tr key={st.id} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 text-blue-500 font-bold">{st.unique_id}</td>
                      <td className="py-2 px-3 font-sans font-medium text-foreground">
                        {st.full_name}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          placeholder="—"
                          className="w-20 h-8 px-2 rounded bg-zinc-900 border border-white/15 text-xs text-right font-mono text-foreground focus:ring-1 focus:ring-blue-500 outline-none"
                          value={bulkMarks[st.id] ?? ""}
                          onChange={(e) =>
                            setBulkMarks({
                              ...bulkMarks,
                              [st.id]: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
