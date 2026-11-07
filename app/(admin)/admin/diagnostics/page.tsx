"use client";

import React, { useState, useEffect } from "react";
import { Glass } from "@/components/ui/glass";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  runDiagnosticsAction,
  dryRunMessageAction,
  sendTestWhatsAppAction,
  DiagnosticsReport,
  DiagnosticItem,
  DryRunResult,
} from "@/app/actions/diagnostics";
import {
  CheckCircle,
  XCircle,
  WarningCircle,
  ArrowClockwise,
  Database,
  Robot,
  WhatsappLogo,
  Copy,
  Check,
  Pulse,
  PaperPlaneTilt,
  TerminalWindow,
  ShieldCheck,
} from "@phosphor-icons/react";

export default function DiagnosticsPage() {
  const [report, setReport] = useState<DiagnosticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dry-Run Simulation States
  const [simSender, setSimSender] = useState<"sir" | "parent">("sir");
  const [simMessage, setSimMessage] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<DryRunResult | null>(null);

  // Real WhatsApp Test Send States
  const [testSending, setTestSending] = useState(false);
  const [testSendResult, setTestSendResult] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleDryRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessage.trim()) return;

    setSimLoading(true);
    setSimResult(null);
    try {
      const res = await dryRunMessageAction(simSender, simMessage);
      setSimResult(res);
    } catch (err) {
      console.error("Dry run failed:", err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleSendTestWhatsApp = async () => {
    setTestSending(true);
    setTestSendResult(null);
    try {
      const res = await sendTestWhatsAppAction();
      setTestSendResult(res);
    } catch (err: unknown) {
      setTestSendResult({
        success: false,
        message: err instanceof Error ? err.message : "Test dispatch failed",
      });
    } finally {
      setTestSending(false);
    }
  };

  const renderStatusCard = (
    item: DiagnosticItem,
    icon: React.ReactNode,
    category: string
  ) => {
    const isOk = item.status === "ok";
    const isWarn = item.status === "warning";

    return (
      <Glass
        tint="subtle"
        className={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 transition-all duration-300 ${
          isOk
            ? "border-blue-500/20 shadow-[0_12px_28px_-10px_rgba(37,99,235,0.15)]"
            : isWarn
            ? "border-blue-400/30"
            : "border-rose-500/30 shadow-[0_12px_28px_-10px_rgba(244,63,94,0.15)]"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl border ${
                  isOk
                    ? "bg-blue-600/15 border-blue-500/30 text-blue-400"
                    : isWarn
                    ? "bg-blue-500/10 border-blue-400/30 text-blue-300"
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

            <div className="flex items-center gap-2">
              {isOk ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                  <CheckCircle size={16} weight="fill" />
                  <span>WORKING</span>
                </div>
              ) : isWarn ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                  <WarningCircle size={16} weight="fill" />
                  <span>WARNING</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  <XCircle size={16} weight="fill" />
                  <span>OFFLINE</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-xs sm:text-sm font-medium text-[var(--text)]">
              {item.summary}
            </p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              {item.details}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-[var(--muted)]">
          <span>Latency: <strong className="text-[var(--text)]">{item.latencyMs}ms</strong></span>
          <span>Checked: {item.lastChecked}</span>
        </div>
      </Glass>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <Glass
        tint="subtle"
        className="p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[var(--brand)] font-semibold">
              Live Systems Pulse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            Diagnostics &amp; Testing Console
          </h1>
          <p className="text-xs text-[var(--muted)] font-mono">
            Readiness check, production-safe AI dry-run simulator, and Meta WhatsApp test utility.
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
            <span>Test the AI &amp; Subsystems</span>
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

      {/* 3. Production-Safe AI Test Console (Dry-Run Simulator) */}
      <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <TerminalWindow size={22} weight="regular" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text)]">
                Production-Safe AI Message Simulator (Dry-Run)
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Simulates natural language parsing and fallback decisions. <strong>Writes are strictly impossible</strong> in this mode.
              </p>
            </div>
          </div>
          <Badge variant="brand" dot>
            Zero DB Writes Guaranteed
          </Badge>
        </div>

        <form onSubmit={handleDryRun} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-[var(--text)]">Simulate Sender:</span>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="radio"
                name="sender"
                value="sir"
                checked={simSender === "sir"}
                onChange={() => setSimSender("sir")}
                className="accent-blue-600"
              />
              <span>Sir Malinga (Admin Commands)</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="radio"
                name="sender"
                value="parent"
                checked={simSender === "parent"}
                onChange={() => setSimSender("parent")}
                className="accent-blue-600"
              />
              <span>Registered Parent</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={simMessage}
              onChange={(e) => setSimMessage(e.target.value)}
              placeholder={
                simSender === "sir"
                  ? "e.g. Enter marks for MCG10TP1001: Paper 1 got 84"
                  : "e.g. START MCG10TP1001, REPORT, or lakunu balanna one"
              }
              className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[var(--text)] outline-none focus:border-blue-500"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={simLoading || !simMessage.trim()}
              className="gap-2 shrink-0 text-xs font-bold"
            >
              <PaperPlaneTilt size={16} weight="bold" />
              <span>{simLoading ? "Parsing..." : "Dry-Run Message"}</span>
            </Button>
          </div>
        </form>

        {/* Dry-Run Result Output */}
        {simResult && (
          <div className="p-5 rounded-2xl bg-black/40 border border-blue-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-blue-400 border-b border-white/5 pb-2">
              <span>Status: {simResult.status}</span>
              <span className="text-emerald-400">Database Modified: {simResult.databaseModified ? "YES" : "NO (Clean)"}</span>
            </div>
            <p className="text-[var(--text)]"><strong className="text-[var(--muted)]">Simulation Verdict:</strong> {simResult.explanation}</p>
            {simResult.parsedToolCalls.length > 0 && (
              <div>
                <span className="text-blue-300 block mb-1">Parsed Tool Calls:</span>
                <pre className="p-3 rounded-lg bg-black/60 overflow-x-auto text-[11px] text-blue-200">
                  {JSON.stringify(simResult.parsedToolCalls, null, 2)}
                </pre>
              </div>
            )}
            <div>
              <span className="text-[var(--muted)] block mb-1">Generated WhatsApp Reply:</span>
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-[var(--text)] whitespace-pre-wrap">
                {simResult.replyMessage}
              </div>
            </div>
          </div>
        )}
      </Glass>

      {/* 4. Real WhatsApp Dispatch to Sir's Number */}
      <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <WhatsappLogo size={20} weight="fill" className="text-blue-400" />
              <h3 className="text-base font-bold text-[var(--text)]">
                Meta WhatsApp Token &amp; Phone Verification
              </h3>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Sends an immediate live text notification to Sir&apos;s verified number using your production Meta token.
            </p>
          </div>

          <Button
            onClick={handleSendTestWhatsApp}
            disabled={testSending}
            variant="outline"
            className="text-xs gap-2 shrink-0 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            <PaperPlaneTilt size={16} weight="bold" />
            <span>{testSending ? "Dispatching..." : "Send Test WhatsApp to Sir"}</span>
          </Button>
        </div>

        {testSendResult && (
          <div
            className={`p-4 rounded-xl text-xs font-mono border ${
              testSendResult.success
                ? "bg-blue-600/10 border-blue-500/30 text-blue-200"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            {testSendResult.message}
          </div>
        )}
      </Glass>

      {/* 5. Last 20 Fallback Events Audit */}
      <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} weight="regular" className="text-blue-400" />
            <h3 className="text-base font-bold text-[var(--text)]">
              Last 20 Fallback &amp; Offline Events Audit
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--muted)]">
            Total Logged: {report?.fallbackEvents?.length || 0}
          </span>
        </div>

        {report?.fallbackEvents && report.fallbackEvents.length > 0 ? (
          <div className="divide-y divide-white/5 border-t border-b border-white/5 max-h-72 overflow-y-auto">
            {report.fallbackEvents.map((evt, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-[var(--text)] font-semibold">{evt.reason}</span>
                  <span className="text-[11px] text-[var(--muted)] block">Sender: {evt.maskedSender}</span>
                </div>
                <div className="text-right space-y-0.5 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {evt.status}
                  </span>
                  <span className="text-[10px] text-[var(--muted)] block">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted)] italic py-4">
            No fallback events recorded in this session. All systems operating normally.
          </p>
        )}
      </Glass>

      {/* 6. Inbound Webhook Configuration Data */}
      <Glass tint="subtle" className="p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Pulse size={20} weight="regular" className="text-blue-400" />
            <h3 className="text-base font-bold text-[var(--text)]">
              Meta Webhook Credentials
            </h3>
          </div>
          <Badge variant="good" dot>
            Immediate Processing Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] block">
                Meta Callback URL
              </span>
              <span className="text-xs font-mono text-[var(--text)] block truncate max-w-xs">
                https://mc-mathamatics-web.vercel.app/api/whatsapp/webhook
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  "https://mc-mathamatics-web.vercel.app/api/whatsapp/webhook",
                  "webhook-url"
                )
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors"
            >
              {copiedKey === "webhook-url" ? (
                <Check size={16} weight="bold" className="text-blue-400" />
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
                mc_verify_2026
              </span>
            </div>
            <button
              onClick={() =>
                copyToClipboard("mc_verify_2026", "verify-token")
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors"
            >
              {copiedKey === "verify-token" ? (
                <Check size={16} weight="bold" className="text-blue-400" />
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
