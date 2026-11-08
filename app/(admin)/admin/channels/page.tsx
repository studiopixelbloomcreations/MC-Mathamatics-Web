"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAiModeStatus, setAdminTelegramId, setActiveChannel } from "@/app/actions/admin";
import { MessageSquare, CheckCircle2, AlertTriangle, Send, ShieldAlert, Bot } from "lucide-react";

export default function AdminChannelsPage() {
  const [activeChannel, setActiveChan] = useState<string>("telegram");
  const [telegramId, setTelegramId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    try {
      const status = await getAiModeStatus();
      setActiveChan(status.activeChannel || "telegram");
      setTelegramId(status.adminTelegramId || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTelegram = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await setAdminTelegramId(telegramId.trim());
      setMessage({ text: "Sir's Telegram User ID saved successfully!", type: "success" });
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to update Telegram ID",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChannel = async (channel: "telegram" | "whatsapp_meta" | "whatsapp_twilio") => {
    setLoading(true);
    setMessage(null);
    try {
      await setActiveChannel(channel);
      setActiveChan(channel);
      setMessage({
        text: `Active communication channel switched to: ${channel.toUpperCase()}`,
        type: "success",
      });
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to switch channel",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Communication Channels</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Configure multi-channel dispatch for Sir and Parents (Telegram, WhatsApp Meta, Twilio).
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

      {/* Primary Channel Selector */}
      <GlassCard className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-foreground">Active Primary Channel</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Select the primary provider for receiving AI Mode commands and parent notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Telegram Card */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeChannel === "telegram"
                ? "bg-blue-600/10 border-blue-500/50 shadow-lg"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
            onClick={() => handleSwitchChannel("telegram")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">✈️</span>
                Telegram Bot
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeChannel === "telegram"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {activeChannel === "telegram" ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Zero Meta rate limits, instant 1-second webhook delivery, inline tap-to-confirm buttons, full Sinhala/English support.
            </p>
          </div>

          {/* WhatsApp Card */}
          <div
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeChannel === "whatsapp_meta"
                ? "bg-emerald-600/10 border-emerald-500/50 shadow-lg"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
            onClick={() => handleSwitchChannel("whatsapp_meta")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">💬</span>
                WhatsApp (Meta Cloud API)
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeChannel === "whatsapp_meta"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {activeChannel === "whatsapp_meta" ? "ACTIVE" : "PAUSED"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Official Meta Business Cloud API. Requires verified phone ID and webhook access token.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Telegram Configuration Card */}
      <GlassCard className="p-6 space-y-4 border-blue-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
              Telegram Access Control
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground">Sir's Telegram User ID</h3>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Only this Telegram user ID can execute admin tool calls (recording marks, notes, attendance, announcements). All other Telegram senders are treated as Parents or prompted to link.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">
          <Input
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="e.g. 123456789"
            className="font-mono text-xs"
          />
          <Button
            onClick={handleSaveTelegram}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs whitespace-nowrap"
          >
            Save Telegram ID
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
