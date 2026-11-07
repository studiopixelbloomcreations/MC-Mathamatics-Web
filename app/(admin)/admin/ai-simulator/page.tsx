"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Send,
  RotateCcw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  buttons?: Array<{ id: string; title: string }>;
}

export default function AdminAiSimulatorPage() {
  const [senderType, setSenderType] = useState<"sir" | "parent">("sir");
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "🤖 MC Mathematics WhatsApp Simulator Ready.\nToggle between Sir's number (AI Autonomous Mode) and a Parent's number (Rule-based Parent Bot) to test end-to-end messaging.",
      timestamp: "Just now",
    },
  ]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatLog((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const simulatedFrom = senderType === "sir" ? "+94771234567" : "+94779876543";

      // Dispatch directly to webhook endpoint
      const res = await fetch("/api/whatsapp/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: [
            {
              changes: [
                {
                  value: {
                    messages: [
                      {
                        from: simulatedFrom,
                        id: `sim_msg_${Date.now()}`,
                        text: { body: textToSend },
                        type: "text",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }),
      });

      if (res.ok) {
        // Also trigger process if Sir
        if (senderType === "sir") {
          await fetch("/api/ai/process", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": "internal_secret_key",
            },
          });
        }

        // Add simulated bot response
        setTimeout(() => {
          let replyContent = "";
          let buttons: Array<{ id: string; title: string }> | undefined = undefined;

          if (senderType === "sir") {
            if (textToSend === "1") {
              replyContent = "✅ Confirmed & Executed! Marks recorded and student analysis recomputed.";
            } else if (textToSend === "2") {
              replyContent = "🚫 In-flight action was cancelled.";
            } else if (/announcement/i.test(textToSend)) {
              replyContent = `📋 AI Action Preview:\n1. Broadcast announcement to targeted students.\n\nExecute these changes?`;
              buttons = [
                { id: "1", title: "1. Confirm & Save" },
                { id: "2", title: "2. Cancel" },
              ];
            } else {
              replyContent = `📋 AI Action Preview:\n1. Record marks on paper for student.\n2. Recompute analytical engine.\n\nExecute these changes?`;
              buttons = [
                { id: "1", title: "1. Confirm & Save" },
                { id: "2", title: "2. Cancel" },
              ];
            }
          } else {
            // Parent response
            if (textToSend.startsWith("START")) {
              replyContent = `👋 Welcome to MC Mathematics!\nYou are now connected to Kamal Perera's progress updates (MCG10TP1001).\n\n📊 Open dashboard:\nhttps://mcmaths.lk/dashboard`;
              buttons = [{ id: "REPORT", title: "📄 Get Full Report" }];
            } else if (textToSend.startsWith("REPORT")) {
              replyContent = `📊 MC MATHEMATICS — PROGRESS REPORT\nStudent: Kamal Perera (MCG10TP1001)\nGrade 10 · Theory + Paper\n\nLatest: Paper 04 (92%)\nClass average: 75.8% · Topper: 98%\nPosition: Top 10%\n\nCumulative average: 81.8%\nConsistency: Exceptionally Stable\n\nStrengths: Algebra, Trigonometry\nNeeds work: Circle proofs\n\nFull interactive charts:\nhttps://mcmaths.lk/dashboard`;
            } else {
              replyContent = `Hello! MC Mathematics automated parent service.\n\n• Send REPORT to view latest results\n• Send STOP to pause notifications`;
            }
          }

          setChatLog((prev) => [
            ...prev,
            {
              id: `bot_${Date.now()}`,
              sender: "bot",
              text: replyContent,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              buttons,
            },
          ]);
          setLoading(false);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="text-xs uppercase font-mono tracking-wider text-purple-400 font-bold">
              Development Sandbox
            </span>
          </div>
          <h1 className="text-2xl font-black text-foreground">WhatsApp AI Simulator</h1>
          <p className="text-xs text-muted-foreground font-mono">
            Test natural language commands for Sir and rule-based flows for parents without live WhatsApp webhooks.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setChatLog([chatLog[0]])}
          className="text-xs h-8 gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Chat
        </Button>
      </div>

      {/* Simulator Control Strip */}
      <GlassCard className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Simulated Persona:</span>
          <div className="inline-flex rounded-lg border border-white/10 p-0.5 bg-zinc-900">
            <button
              onClick={() => setSenderType("sir")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                senderType === "sir"
                  ? "bg-amber-500 text-black shadow"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Sir (+94 77 123 4567) • AI Mode
            </button>
            <button
              onClick={() => setSenderType("parent")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                senderType === "parent"
                  ? "bg-purple-500 text-white shadow"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Parent (+94 77 987 6543) • Rule Bot
            </button>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2">
          {senderType === "sir" ? (
            <>
              <button
                onClick={() => handleSend("MCG10TP1001 Paper 04 marks 88")}
                className="text-[11px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-amber-500/40 text-amber-300"
              >
                + Mark Entry
              </button>
              <button
                onClick={() => handleSend("Announcement for Grade 10: Special revision class this Saturday 8am")}
                className="text-[11px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-amber-500/40 text-amber-300"
              >
                + Announcement
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSend("START MCG10TP1001")}
                className="text-[11px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-purple-500/40 text-purple-300"
              >
                START
              </button>
              <button
                onClick={() => handleSend("REPORT MCG10TP1001")}
                className="text-[11px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-purple-500/40 text-purple-300"
              >
                REPORT
              </button>
            </>
          )}
        </div>
      </GlassCard>

      {/* WhatsApp Chat Device Frame */}
      <div className="rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Chat header */}
        <div className="p-3.5 bg-zinc-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold font-serif text-sm">
              MC
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">MC Mathematics Bot</p>
              <p className="text-[10px] text-emerald-400 font-mono">
                {senderType === "sir" ? "AI Autonomous Mode (Sir)" : "Rule-Based Parent Bot"}
              </p>
            </div>
          </div>
          <Badge variant="accent" className="font-mono text-[10px]">
            Cloudflare Sandbox
          </Badge>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
          {chatLog.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-md whitespace-pre-wrap leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-zinc-900 border border-white/10 text-foreground rounded-tl-none font-sans"
                }`}
              >
                {msg.text}

                {/* Interactive Reply Buttons */}
                {msg.buttons && (
                  <div className="pt-2.5 mt-2 border-t border-white/10 flex flex-wrap gap-2">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleSend(btn.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 text-[11px] transition-all"
                      >
                        {btn.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-muted-foreground font-mono mt-0.5 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10 text-muted-foreground text-xs w-28">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
            </div>
          )}
        </div>

        {/* Chat input box */}
        <div className="p-3 bg-zinc-900 border-t border-white/10 flex items-center gap-2">
          <Input
            placeholder={
              senderType === "sir"
                ? "Type Sir's command: e.g. MCG10TP1001 Paper 04 marks 85"
                : "Type parent message: START MCG10TP1001 or REPORT"
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="text-xs bg-zinc-950 border-white/15 h-10"
          />
          <Button
            onClick={() => handleSend()}
            disabled={loading || !inputMessage.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-10 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
