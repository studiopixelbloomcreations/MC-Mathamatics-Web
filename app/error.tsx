"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error Boundary caught error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground flex items-center justify-center p-6">
      <GlassCard className="p-8 max-w-md w-full text-center space-y-6 border-rose-500/30 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-rose-400 font-bold">
            Runtime Exception
          </span>
          <h1 className="text-2xl font-black tracking-tight">Calculation Interrupted</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An unexpected error occurred while executing this operation. You can retry the request or contact support.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Recalculate (Retry)
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
