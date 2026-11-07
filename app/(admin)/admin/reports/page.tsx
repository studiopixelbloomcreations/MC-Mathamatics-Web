"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { getAiModeStatus, setPaidTemplatesEnabled, getAdminReportDeliveries } from "@/app/actions/admin";
import { Send, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface DeliveryItem {
  id: string;
  student_id: string;
  wa_message_id: string | null;
  status: string;
  error: string | null;
  created_at: string;
  students?: { full_name: string; unique_id: string; parent_whatsapp: string };
}

export default function AdminReportsPage() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [paidTemplates, setPaidTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    try {
      const [status, deliveryData] = await Promise.all([
        getAiModeStatus(),
        getAdminReportDeliveries(),
      ]);
      setPaidTemplates(status.paidTemplatesEnabled);
      setDeliveries(deliveryData as unknown as DeliveryItem[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePaidTemplates = async () => {
    const nextVal = !paidTemplates;
    setLoading(true);
    setMessage(null);

    try {
      await setPaidTemplatesEnabled(nextVal);
      setPaidTemplates(nextVal);
      setMessage({
        text: nextVal
          ? "Paid template messaging is now ENABLED. Note: Out-of-window messages incur Meta charges."
          : "Paid template messaging is now DISABLED. All parent communications are strictly zero-cost (inside 24h free window).",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle template setting";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Parent WhatsApp Reports Engine</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Monitor parent report deliveries, inbound 24-hour free windows, and Meta paid message authorization.
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
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Paid Templates Authorization Setting */}
      <GlassCard className="p-6 border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Cost Guardrail Settings
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Meta Paid WhatsApp Business Templates
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              When OFF, reports are dispatched <strong>strictly inside the 24-hour free window</strong> triggered when parents click &quot;Send me the report&quot; or message the bot. If OFF and window is closed, system dispatches a free Web Push notification instead of incurring Meta costs.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleTogglePaidTemplates}
              disabled={loading}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                paidTemplates ? "bg-amber-500" : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  paidTemplates ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs font-mono font-bold text-foreground">
              {paidTemplates ? "ENABLED (Paid)" : "DISABLED (Zero Cost)"}
            </span>
          </div>
        </div>

        {paidTemplates && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Warning: Out-of-window messages will now be charged according to Meta WhatsApp Cloud API marketing/utility pricing.
            </span>
          </div>
        )}
      </GlassCard>

      {/* Delivery Audit Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-foreground">Report Delivery Audit</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="h-8 text-xs gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Parent WhatsApp</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Message ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground font-sans">
                    No report deliveries recorded yet.
                  </td>
                </tr>
              ) : (
                deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 text-foreground font-sans">
                      <span className="font-mono text-amber-400 font-bold mr-1.5">
                        {d.students?.unique_id}
                      </span>
                      {d.students?.full_name}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {d.students?.parent_whatsapp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === "delivered" || d.status === "sent"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                      {d.wa_message_id || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                      {new Date(d.created_at).toLocaleString()}
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
