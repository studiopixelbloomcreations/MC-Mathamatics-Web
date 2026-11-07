import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-foreground flex items-center justify-center p-6">
      <GlassCard className="p-8 max-w-md w-full text-center space-y-6 border-amber-500/30 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
            Error 404
          </span>
          <h1 className="text-2xl font-black tracking-tight">Coordinate Not Found</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested mathematical locus or page does not exist in the MC Mathematics coordinate system.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Main Campus
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
