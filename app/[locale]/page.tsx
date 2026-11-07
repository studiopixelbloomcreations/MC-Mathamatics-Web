import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-6 max-w-6xl mx-auto backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-extrabold tracking-wider text-[var(--accent)]">
            MC
          </span>
          <span className="text-xs tracking-widest text-[var(--muted)] uppercase">
            Mathematics
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-3xl space-y-8 mt-16">
        <Reveal direction="down" delay={0.1}>
          <Badge variant="accent" dot>
            Next-Gen E-Learning Platform
          </Badge>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            Maths is the question.{" "}
            <span className="text-[var(--accent)] font-serif italic">
              MC is the answer.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto">
            The elite mathematics progress-tracking and e-learning system for
            Malinga C Dissanayake (Kurunegala, Sri Lanka).
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/design-system">
              <Button size="lg" variant="accent" magnetic>
                Explore Design System
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" magnetic>
                Student Login
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
