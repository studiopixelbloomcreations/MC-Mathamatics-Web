"use client";

import React, { useState, useEffect } from "react";
import { Glass } from "@/components/ui/glass";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  runDiagnosticsAction,
  DiagnosticsReport,
  DiagnosticItem,
} from "@/app/actions/diagnostics";
import {
  CheckCircle,
  XCircle,
  ArrowClockwise,
  Database,
  Robot,
  WhatsappLogo,
  Copy,
  Check,
  Pulse,
} from "@phosphor-icons/react";

export default function DiagnosticsPage() {
  const [report, setReport] = useState<DiagnosticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const data = await runDiagnosticsAction();
      setReport(data);
    } catch (err) {
      console.error("Diagnostics check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderStatusCard = (
    item: DiagnosticItem,
    icon: React.ReactNode,
    category: string
  ) => {
    const isOk = item.status === "ok";

    return (
      <Glass
        tint="subtle"
        className={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 transition-all duration-300 ${
          isOk
            ? "border-emerald-500/20 shadow-[0_12px_28px_-10px_rgba(16,185,129,0.15)]"
            : "border-rose-500/30 shadow-[0_12px_28px_-10px_rgba(244,63,94,0.15)]"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl border ${
                  isOk
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
              >
                {icon}
              </div>
              <div>
                <span className="text-[11px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                  {category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text)]">
                  {item.name}
                </h3>
              </div>
            </div>

            {/* Green or Red Tick */}
            <div className="flex items-center gap-2">
              {isOk ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle size={16} weight="fill" />
                  <span>WORKING</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  <XCircle size={16} weight="fill" />
                  <span>OFFLINE</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-[var(--text)]">
              {item.summary}
            </p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              {item.details}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--muted)] [font-feature-settings:'tnum'_1]">
          <span>Latency: {item.latencyMs} ms</span>
          <span>Checked: {item.lastChecked}</span>
        </div>
      </Glass>
    );
  };

  const fakeStudentCredentials = [
    { grade: 9, id: "MCG09TP1001", name: "Nethmi Wickramasinghe", type: "TP", pin: "123456", parent: "+94776665544" },
    { grade: 9, id: "MCG09TP1002", name: "Tharindu Jayasundara", type: "TP", pin: "123456", parent: "+94776665545" },
    { grade: 9, id: "MCG09T1001", name: "Dinuka Bandara", type: "T", pin: "123456", parent: "+94776665546" },
    { grade: 9, id: "MCG09T1002", name: "Rashmi Alwis", type: "T", pin: "123456", parent: "+94776665547" },
    { grade: 10, id: "MCG10TP1001", name: "Kavindu Perera", type: "TP", pin: "123456", parent: "+94779998877" },
    { grade: 10, id: "MCG10T1002", name: "Senuri Jayasinghe", type: "T", pin: "123456", parent: "+94778887766" },
    { grade: 10, id: "MCG10TP1003", name: "Akila Dissanayake", type: "TP", pin: "123456", parent: "+94778887767" },
    { grade: 10, id: "MCG10TP1004", name: "Oshadhi Senaratne", type: "TP", pin: "123456", parent: "+94778887768" },
    { grade: 11, id: "MCG11TP1001", name: "Dulitha Bandara", type: "TP", pin: "123456", parent: "+94777776655" },
    { grade: 11, id: "MCG11TP1002", name: "Hiruni Ranasinghe", type: "TP", pin: "123456", parent: "+94777776656" },
    { grade: 11, id: "MCG11T1001", name: "Pathum Fernando", type: "T", pin: "123456", parent: "+94777776657" },
    { grade: 11, id: "MCG11TP1003", name: "Sandunika Rajapaksha", type: "TP", pin: "123456", parent: "+94777776658" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* 1. Top Header */}
      <Glass
        tint="subtle"
        className="p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--brand)] font-semibold">
              System Telemetry &amp; Health Gate
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            Diagnostics
          </h1>
          <p className="text-xs text-[var(--muted)] font-mono">
            Live readiness check for Database, AI Autonomous Engine, and WhatsApp Webhook.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={fetchDiagnostics}
            disabled={loading}
            className="gap-2 text-xs"
          >
            <ArrowClockwise
              size={16}
              weight="bold"
              className={loading ? "animate-spin text-[var(--brand)]" : ""}
            />
            <span>Re-run Diagnostics</span>
          </Button>
        </div>
      </Glass>

      {/* 2. Core 3 Systems Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {report ? (
          <>
            {renderStatusCard(
              report.database,
              <Database size={24} weight="regular" />,
              "Primary Storage"
            )}
            {renderStatusCard(
              report.ai,
              <Robot size={24} weight="regular" />,
              "Autonomous AI Engine"
            )}
            {renderStatusCard(
              report.whatsapp,
              <WhatsappLogo size={24} weight="fill" />,
              "Parent & Sir Gateway"
            )}
          </>
        ) : (
          <div className="lg:col-span-3 py-16 text-center text-xs text-[var(--muted)]">
            Testing subsystems...
          </div>
        )}
      </div>

      {/* 3. WhatsApp Immediate Webhook Integration Info */}
      <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Pulse size={20} weight="regular" className="text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text)]">
              Webhook Configuration &amp; Meta Settings
            </h3>
          </div>
          <Badge variant="good" dot>
            Immediate In-Process Execution Active
          </Badge>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          The inbound WhatsApp webhook (<code className="text-[var(--brand)] font-mono">/api/whatsapp/webhook</code>) executes parent bot responses and Sir&apos;s AI autonomous actions immediately on arrival, eliminating serverless timeout drops.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">
                Meta Callback URL
              </span>
              <span className="text-xs font-mono text-[var(--text)] block truncate max-w-xs">
                https://mcmaths.lk/api/whatsapp/webhook
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  "https://mcmaths.lk/api/whatsapp/webhook",
                  "webhook-url"
                )
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors"
            >
              {copiedKey === "webhook-url" ? (
                <Check size={16} weight="bold" className="text-emerald-400" />
              ) : (
                <Copy size={16} weight="regular" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">
                Meta Verify Token
              </span>
              <span className="text-xs font-mono text-[var(--text)] block">
                mc_maths_verify_token
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard("mc_maths_verify_token", "verify-token")
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors"
            >
              {copiedKey === "verify-token" ? (
                <Check size={16} weight="bold" className="text-emerald-400" />
              ) : (
                <Copy size={16} weight="regular" />
              )}
            </button>
          </div>
        </div>
      </Glass>
    </div>
  );
}
