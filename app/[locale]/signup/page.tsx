import React from "react";
import { SignUpForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SignUpPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar with Back Link & Switches */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Form Container */}
      <main className="w-full relative z-10 my-auto">
        <SignUpForm />
      </main>

      {/* Footer minimal info */}
      <footer className="w-full max-w-4xl mx-auto text-center pt-12 pb-4 text-xs text-muted-foreground relative z-10">
        <p>© 2026 MC Mathematics. Kurunegala, Sri Lanka.</p>
        <p className="mt-1 font-mono text-[11px] text-amber-500/70">
          Maths is the question. MC is the answer.
        </p>
      </footer>
    </div>
  );
}
