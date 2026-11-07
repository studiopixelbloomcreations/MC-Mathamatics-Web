"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminAnnouncement, deleteAdminAnnouncement } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { Pin, Trash2, CheckCircle2, AlertCircle, Plus } from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  target: string;
  pinned: boolean;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("all");
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadAnnouncements = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createAdminAnnouncement({
        title,
        body,
        target,
        pinned,
      });

      setMessage({ text: "Announcement broadcasted successfully!", type: "success" });
      setTitle("");
      setBody("");
      setPinned(false);
      loadAnnouncements();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create announcement";
      setMessage({ text: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminAnnouncement(id);
      loadAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-foreground">Official Announcements</h1>
        <p className="text-xs text-muted-foreground font-mono">
          Broadcast official bulletins targeted to All students, specific Grades (e.g. grade:10), or individual students.
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

      {/* Creation Box */}
      <GlassCard className="p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Title</label>
              <Input
                placeholder="e.g. Special Seminar on Circle Theorems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Target Cohort</label>
              <select
                className="w-full mt-1 h-10 px-3 rounded-lg bg-zinc-900 border border-white/15 text-sm text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="all">All Students (Academy Wide)</option>
                {[6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                  <option key={g} value={`grade:${g}`}>
                    Grade {g} Only
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Bulletin Content</label>
            <textarea
              className="w-full mt-1 p-3 rounded-lg bg-zinc-900 border border-white/15 text-xs text-foreground focus:ring-2 focus:ring-blue-500 outline-none h-24"
              placeholder="Write the full announcement notice here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <Pin className="w-3.5 h-3.5 text-blue-500" />
              <span>Pin this announcement to top of feed</span>
            </label>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-black font-bold text-xs h-9 px-6 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {loading ? "Posting..." : "Post Announcement"}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Announcements List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground">Published Bulletins</h3>
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground text-xs">
              No announcements published yet.
            </GlassCard>
          ) : (
            announcements.map((item) => (
              <GlassCard key={item.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground">
                      Target: {item.target}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {item.body}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-muted-foreground hover:text-rose-400 p-1.5 transition-colors"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
