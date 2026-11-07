import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 sm:p-10">
      <header className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black text-xl">
            MC
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Student Portal</h1>
            <p className="text-xs text-muted-foreground font-mono">
              MC Mathematics • Kurunegala
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Sign out
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full my-auto py-12 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student Session Active</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
          Welcome to Your Student Portal
        </h2>

        <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
          Authentication and ID verification completed successfully. The complete Phase 4 student dashboard (bento cards, real-time paper results, animated analysis preview, and WhatsApp reports) is ready to deploy.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Landing Page</span>
            </Button>
          </Link>
          <Link href="/design-system">
            <Button variant="secondary" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Design System Preview</span>
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground pt-6 border-t border-white/10">
        <p>© 2026 MC Mathematics. Maths is the question. MC is the answer.</p>
      </footer>
    </div>
  );
}
