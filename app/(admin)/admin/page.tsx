import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Lock } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-black text-[var(--accent)]">
              MC
            </span>
            <span className="text-sm font-semibold tracking-wider uppercase text-[var(--muted)]">
              Admin Portal (Subdomain Isolated)
            </span>
          </div>
          <Badge variant="brand" dot>
            Subdomain Routing Active
          </Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <GlassCard variant="bento">
            <div className="space-y-3">
              <ShieldCheck className="h-8 w-8 text-[var(--brand)]" />
              <h2 className="text-xl font-bold">Admin Control Cockpit</h2>
              <p className="text-xs text-[var(--muted)]">
                Isolated behind admin subdomain host-based routing. Enforces TOTP 2FA,
                Supabase admin claims, and AI Mode safety guards.
              </p>
            </div>
          </GlassCard>

          <GlassCard variant="bento">
            <div className="space-y-3">
              <Lock className="h-8 w-8 text-[var(--accent)]" />
              <h2 className="text-xl font-bold">Host Routing Enforced</h2>
              <p className="text-xs text-[var(--muted)]">
                In production, direct access via public domain is blocked (404),
                ensuring security and boundary separation.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
