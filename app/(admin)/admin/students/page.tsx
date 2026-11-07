"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminStudents, resetStudentPin, getAdminPinResetRequests } from "@/app/actions/admin";
import { Search, KeyRound, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

interface StudentItem {
  id: string;
  unique_id: string;
  full_name: string;
  grade: number;
  class_type: "T" | "TP";
  parent_whatsapp: string;
  report_pending: boolean;
  parent_wa_verified: boolean;
  created_at: string;
}

interface PinResetItem {
  id: string;
  student_id: string;
  unique_id: string;
  status: string;
  created_at: string;
  students?: { full_name: string; grade: number; parent_whatsapp: string };
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [pinRequests, setPinRequests] = useState<PinResetItem[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const g = gradeFilter === "all" ? undefined : Number(gradeFilter);
      const [studentsData, pinData] = await Promise.all([
        getAdminStudents(search, g),
        getAdminPinResetRequests(),
      ]);
      setStudents(studentsData as StudentItem[]);
      setPinRequests(pinData as unknown as PinResetItem[]);
    } catch (err) {
      console.error(err);
    }
  }, [gradeFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || newPin.length !== 6) return;
    setLoading(true);
    setMessage(null);

    try {
      await resetStudentPin(selectedStudent.id, newPin);
      setMessage({
        text: `PIN reset successfully for ${selectedStudent.unique_id} to ${newPin}!`,
        type: "success",
      });
      setSelectedStudent(null);
      setNewPin("");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset PIN";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Enrolled Students Roster</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Search students by Unique ID, Name, or WhatsApp. Manage credentials and resolve student PIN reset requests.
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

      {/* Pending PIN Reset Requests Banner */}
      {pinRequests.filter((r) => r.status === "pending").length > 0 && (
        <GlassCard className="p-4 border-amber-500/40 bg-amber-500/10 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Pending Forgot-PIN Reset Requests
            </h3>
          </div>
          <div className="divide-y divide-white/5 text-xs">
            {pinRequests
              .filter((r) => r.status === "pending")
              .map((r) => (
                <div key={r.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-300">{r.unique_id}</span>
                    <span className="text-muted-foreground ml-2">
                      {r.students?.full_name} • Parent: {r.students?.parent_whatsapp}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const studentObj = students.find((s) => s.unique_id === r.unique_id);
                      if (studentObj) setSelectedStudent(studentObj);
                    }}
                    className="h-7 text-xs border-amber-500/40 text-amber-300"
                  >
                    Reset PIN
                  </Button>
                </div>
              ))}
          </div>
        </GlassCard>
      )}

      {/* Filter and Search Bar */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by ID (e.g. MCG10TP1001), full name, or parent phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div>
            <select
              className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-xs text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="all">All Grades (6–13)</option>
              {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Students Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Enrolled Students ({students.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 px-3">Unique ID</th>
                <th className="py-2.5 px-3">Full Name</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Class Type</th>
                <th className="py-2.5 px-3">Parent WhatsApp</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground font-sans">
                    No students match search criteria.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 text-amber-400 font-bold">{st.unique_id}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">
                      {st.full_name}
                    </td>
                    <td className="py-2.5 px-3">Grade {st.grade}</td>
                    <td className="py-2.5 px-3">
                      {st.class_type === "TP" ? "Theory + Paper" : "Theory Only"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">{st.parent_whatsapp}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedStudent(st)}
                        className="h-7 text-[11px] gap-1"
                      >
                        <KeyRound className="w-3 h-3" />
                        Reset PIN
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Reset PIN Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-white/15 p-6 space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                Reset PIN for {selectedStudent.unique_id}
              </h3>
              <p className="text-xs text-muted-foreground">{selectedStudent.full_name}</p>
            </div>

            <form onSubmit={handleResetPin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  New 6-digit PIN
                </label>
                <Input
                  type="password"
                  maxLength={6}
                  placeholder="6 digits (e.g. 123456)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  required
                  className="mt-1 font-mono text-center tracking-widest text-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedStudent(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || newPin.length !== 6}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                >
                  {loading ? "Resetting..." : "Confirm Reset"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
