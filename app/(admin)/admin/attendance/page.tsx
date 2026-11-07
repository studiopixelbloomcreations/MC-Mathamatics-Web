"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminStudents, recordClassAttendance } from "@/app/actions/admin";
import { CalendarCheck, CheckCircle2, AlertCircle, Save } from "lucide-react";

interface StudentItem {
  id: string;
  unique_id: string;
  full_name: string;
  grade: number;
}

export default function AdminAttendancePage() {
  const [grade, setGrade] = useState("10");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [session, setSession] = useState("Morning Theory");
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent" | "late" | "excused">>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAdminStudents("", Number(grade));
        setStudents(data as StudentItem[]);
        // default all students to present
        const initial: Record<string, "present" | "absent" | "late" | "excused"> = {};
        data.forEach((s) => {
          initial[s.id] = "present";
        });
        setAttendanceMap(initial);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [grade]);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = async () => {
    if (students.length === 0) return;
    setLoading(true);
    setMessage(null);

    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: attendanceMap[s.id] || "present",
      }));

      await recordClassAttendance({
        date,
        session,
        records,
      });

      setMessage({
        text: `Attendance recorded for ${records.length} students on ${date}!`,
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record attendance";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Class Attendance Roll Call</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Mark session attendance for students across grades. Updates attendance percentage and calendars in realtime.
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

      {/* Control Strip */}
      <GlassCard className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Grade</label>
            <select
              className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-sm text-foreground focus:ring-2 focus:ring-amber-500 outline-none"
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
            <label className="text-xs font-semibold text-muted-foreground uppercase">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Session</label>
            <Input
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mt-1 text-sm"
              placeholder="e.g. Saturday Morning Theory"
            />
          </div>
        </div>
      </GlassCard>

      {/* Students Roll Call Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-foreground">
              Grade {grade} Roll Call ({students.length} students)
            </h3>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading || students.length === 0}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs h-8 px-4 gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Attendance
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 px-3">Unique ID</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted-foreground font-sans">
                    No students found for Grade {grade}.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const currentStatus = attendanceMap[st.id] || "present";
                  return (
                    <tr key={st.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 text-amber-400 font-bold">{st.unique_id}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-foreground">
                        {st.full_name}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex rounded-lg border border-white/10 p-0.5 bg-zinc-900">
                          {(["present", "absent", "late", "excused"] as const).map((stat) => (
                            <button
                              key={stat}
                              type="button"
                              onClick={() => handleStatusChange(st.id, stat)}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded capitalize transition-all ${
                                currentStatus === stat
                                  ? stat === "present"
                                    ? "bg-emerald-500 text-black font-bold shadow"
                                    : stat === "absent"
                                    ? "bg-rose-500 text-white font-bold shadow"
                                    : stat === "late"
                                    ? "bg-amber-500 text-black font-bold shadow"
                                    : "bg-sky-500 text-black font-bold shadow"
                                  : "text-muted-foreground hover:text-white"
                              }`}
                            >
                              {stat}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
