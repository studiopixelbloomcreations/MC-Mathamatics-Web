"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { getAiModeStatus, setAiMode, setParentChatEnabled, getAdminAiActions, undoAiAction } from "@/app/actions/admin";
import { runDiagnosticsAction } from "@/app/actions/diagnostics";
import { Bot, RotateCcw, CheckCircle2, AlertCircle, Terminal, MessageSquare } from "lucide-react";
import Link from "next/link";

interface AiActionItem {
  id: string;
  raw_text: string;
  tool_calls: Array<{ tool: string; args: Record<string, unknown> }>;
  result: Record<string, unknown> | null;
  status: string;
  undo_data: Record<string, unknown> | null;
  created_at: string;
}

export default function AdminAiModePage() {
  const [aiMode, setAiModeState] = useState(false);
  const [parentChatEnabled, setParentChatState] = useState(true);
  const [aiHealthStatus, setAiHealthStatus] = useState<string>("ok");
  const [actions, setActions] = useState<AiActionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    try {
      const [status, actionsList, diag] = await Promise.all([
        getAiModeStatus(),
        getAdminAiActions(),
        runDiagnosticsAction(),
      ]);
      setAiModeState(status.aiMode);
      setParentChatState(status.parentChatEnabled);
      setAiHealthStatus(diag.ai.status);
      setActions(actionsList as unknown as AiActionItem[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAiMode = async () => {
    const nextVal = !aiMode;
    setLoading(true);
    setMessage(null);

    try {
      await setAiMode(nextVal);
      setAiModeState(nextVal);
      setMessage({
        text: nextVal
          ? "🤖 AI Mode is now ACTIVE! Sir's WhatsApp messages will be parsed and executed autonomously. Manual web editing is disabled."
          : "AI Mode is now OFF. Manual editing controls in the admin portal are re-enabled.",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle AI Mode";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleParentChat = async () => {
    const nextVal = !parentChatEnabled;
    setLoading(true);
    setMessage(null);

    try {
      await setParentChatEnabled(nextVal);
      setParentChatState(nextVal);
      setMessage({
        text: nextVal
          ? "💬 Parent AI Chat is now ENABLED. Parents can converse with the AI assistant on WhatsApp."
          : "Parent AI Chat is now PAUSED. Parents will receive automated offline fallback buttons for marks & reports.",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle Parent Chat";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (actionId: string) => {
    setLoading(true);
    setMessage(null);

    try {
      await undoAiAction(actionId);
      setMessage({ text: "AI action successfully reverted!", type: "success" });
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to undo action";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">AI Mode Cockpit & Autonomous Control</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Govern Sir&apos;s WhatsApp AI engine, inspect parsed tool calls, audit raw text, and revert actions within 24 hours.
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

      {/* Status Indicators & Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Mode Toggle (Sir's autonomous write actions) */}
        <GlassCard className="p-6 border-blue-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {aiMode && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      aiMode ? "bg-blue-500" : "bg-neutral-600"
                    }`}
                  ></span>
                </span>
                <span className="text-xs uppercase font-mono tracking-wider text-blue-500 font-bold">
                  Autonomous State Control
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  aiHealthStatus === "ok"
                    ? "bg-blue-600/20 text-blue-300 border-blue-500/30"
                    : "bg-blue-950 text-blue-200 border-blue-800"
                }`}
              >
                {aiHealthStatus === "ok" ? "AI ENGINE READY" : "AI UNHEALTHY"}
              </span>
            </div>

            <h2 className="text-lg font-bold text-foreground">
              Sir&apos;s AI Mode (Voice &amp; Text Write Actions)
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When active, Sir can send voice notes or text on WhatsApp to enter marks, post bulletins, and dispatch attendance. Manual edit screens become read-only (server-side 409 enforcement).
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-xs font-mono font-bold text-foreground">
              {aiMode ? "AI MODE ACTIVE" : "AI MODE OFF"}
            </span>
            <button
              onClick={handleToggleAiMode}
              disabled={loading}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                aiMode ? "bg-blue-600" : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  aiMode ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </GlassCard>

        {/* Card 2: Parent AI Chat Toggle */}
        <GlassCard className="p-6 border-blue-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="text-xs uppercase font-mono tracking-wider text-blue-500 font-bold">
                  Parent Inbound Assistant
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  parentChatEnabled
                    ? "bg-blue-600/20 text-blue-300 border-blue-500/30"
                    : "bg-white/5 text-[var(--muted)] border-white/10"
                }`}
              >
                {parentChatEnabled ? "PARENT CHAT ON" : "PARENT CHAT PAUSED"}
              </span>
            </div>

            <h2 className="text-lg font-bold text-foreground">
              Parent AI Chatbot
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When enabled, registered parents can chat naturally with the AI assistant. When turned off, parents immediately receive automated offline replies with buttons to fetch their child&apos;s marks and report.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-xs font-mono font-bold text-foreground">
              {parentChatEnabled ? "PARENT CHAT ACTIVE" : "PARENT CHAT OFF"}
            </span>
            <button
              onClick={handleToggleParentChat}
              disabled={loading}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                parentChatEnabled ? "bg-blue-600" : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  parentChatEnabled ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* AI Action Audit & 24h Undo Feed */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-foreground">
              AI Action History & Undo Feed (24-Hour Window)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            {actions.length} Actions Logged
          </span>
        </div>

        <div className="space-y-3">
          {actions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs font-sans">
              No AI actions executed yet. Test via WhatsApp or the AI Simulator.
            </div>
          ) : (
            actions.map((act) => {
              const isUndone = act.status === "undone";
              const canUndo =
                !isUndone &&
                Date.now() - new Date(act.created_at).getTime() < 24 * 60 * 60 * 1000;

              return (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/15 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          act.status === "executed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : act.status === "undone"
                            ? "bg-neutral-700 text-neutral-300"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {act.status}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>

                    {canUndo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUndo(act.id)}
                        disabled={loading}
                        className="h-7 text-[11px] gap-1 text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Undo Action
                      </Button>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Raw WhatsApp Inbound Text:
                    </span>
                    <p className="p-2.5 rounded bg-zinc-900 border border-white/5 font-mono text-[11px] text-blue-200 whitespace-pre-wrap">
                      {act.raw_text}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Validated Tool Calls & Execution:
                    </span>
                    <pre className="p-2.5 rounded bg-zinc-900 border border-white/5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                      {JSON.stringify(act.tool_calls, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>
    </div>
  );
}
