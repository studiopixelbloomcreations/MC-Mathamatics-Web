"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPaper, getAdminPapers } from "@/app/actions/admin";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface PaperItem {
  id: string;
  title: string;
  grade: number;
  class_type: string | null;
  total_marks: number;
  status: string;
  paper_date: string;
  sections?: Array<{ name: string; max: number }>;
}

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("10");
  const [classType, setClassType] = useState<"TP" | "T" | "both">("both");
  const [totalMarks, setTotalMarks] = useState("100");
  const [paperDate, setPaperDate] = useState(new Date().toISOString().split("T")[0]);
  const [sections, setSections] = useState<Array<{ name: string; max: number }>>([
    { name: "Algebra", max: 25 },
    { name: "Geometry", max: 25 },
    { name: "Trigonometry", max: 25 },
    { name: "Statistics", max: 25 },
  ]);

  const loadPapers = async () => {
    try {
      const data = await getAdminPapers();
      setPapers(data as PaperItem[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const handleAddSection = () => {
    setSections([...sections, { name: "", max: 25 }]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSectionChange = (idx: number, field: "name" | "max", val: string | number) => {
    const updated = [...sections];
    if (field === "name") {
      updated[idx].name = String(val);
    } else {
      updated[idx].max = Number(val);
    }
    setSections(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const filteredSections = sections.filter((s) => s.name.trim().length > 0);
      await createPaper({
        title,
        grade: Number(grade),
        classType: classType === "both" ? null : classType,
        totalMarks: Number(totalMarks),
        sections: filteredSections,
        paperDate,
        status: "ongoing",
      });

      setMessage({ text: "Paper created and published successfully!", type: "success" });
      setTitle("");
      loadPapers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create paper";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Paper Upload & Management</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Upload papers tagged by Grade (6–13), Class Type, and Topic Sections. Enforced by RLS.
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

      {/* Creation Form */}
      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Paper Title
              </label>
              <Input
                placeholder="e.g. Paper 15 — Quadratic Equations & Circle Proofs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Grade (6–13)
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
                Class Type
              </label>
              <select
                className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-sm text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={classType}
                onChange={(e) => setClassType(e.target.value as "TP" | "T" | "both")}
              >
                <option value="both">Both (Theory & Theory+Paper)</option>
                <option value="TP">Theory + Paper Only</option>
                <option value="T">Theory Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Total Marks
              </label>
              <Input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                required
                className="mt-1 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Paper Date
              </label>
              <Input
                type="date"
                value={paperDate}
                onChange={(e) => setPaperDate(e.target.value)}
                required
                className="mt-1 font-mono"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <span>Upload Paper PDF / Document</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMessage({
                      text: `Selected document: ${file.name} (${Math.round(file.size / 1024)} KB). Ready to attach to paper record.`,
                      type: "success",
                    });
                  }
                }}
                className="mt-1 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Topic Sections */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase text-foreground">
                  Topic & Section Breakdown (Optional)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Enables granular diagnostic radar charts & topic heatmaps.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSection}
                className="text-xs h-7 gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Section
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <Input
                    placeholder="Section name"
                    value={sec.name}
                    onChange={(e) => handleSectionChange(idx, "name", e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={sec.max}
                    onChange={(e) => handleSectionChange(idx, "max", Number(e.target.value))}
                    className="h-8 w-16 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-muted-foreground hover:text-rose-400 p-1"
                    title="Remove section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-black font-bold text-xs h-9 px-6"
            >
              {loading ? "Publishing..." : "Publish Paper to Grade"}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Papers Table */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground">Published Papers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Class Type</th>
                <th className="py-2.5 px-3">Total Marks</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {papers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No papers published yet.
                  </td>
                </tr>
              ) : (
                papers.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-sans font-semibold text-foreground">
                      {p.title}
                    </td>
                    <td className="py-2.5 px-3">Grade {p.grade}</td>
                    <td className="py-2.5 px-3">{p.class_type || "Both"}</td>
                    <td className="py-2.5 px-3">{p.total_marks}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{p.paper_date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
