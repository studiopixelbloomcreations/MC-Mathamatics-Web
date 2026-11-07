"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { getAdminLoginLogs } from "@/app/actions/admin";
import { ShieldCheck } from "lucide-react";

interface LoginLogItem {
  id: string;
  student_id: string | null;
  action: string;
  success: boolean;
  failure_reason: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LoginLogItem[]>([]);
  const [filterSuccess, setFilterSuccess] = useState<"all" | "success" | "fail">("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAdminLoginLogs({ limit: 100 });
        setLogs(data as LoginLogItem[]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterSuccess === "success") return log.success;
    if (filterSuccess === "fail") return !log.success;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Authentication & Security Audit Log</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Immutable audit record of student logins, failed PIN attempts, lockouts, and IP hashes.
        </p>
      </div>

      {/* Filter Strip */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-foreground">Filter Records</span>
        </div>

        <div className="flex items-center gap-2">
          {(["all", "success", "fail"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterSuccess(filter)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
                filterSuccess === filter
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {filter === "all" ? "All Attempts" : filter === "success" ? "Successful" : "Failed / Locked"}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Logs Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Student UUID</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Failure Reason</th>
                <th className="py-2.5 px-3">IP Hash</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground font-sans">
                    No login attempts recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.success
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-foreground">
                      {log.student_id ? log.student_id.slice(0, 13) : "—"}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-rose-300">
                      {log.failure_reason || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {log.ip_hash || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
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
