"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { PinInput } from "@/components/ui/pin-input";
import { Combobox } from "@/components/ui/combobox";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Tabs } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatCounter } from "@/components/ui/stat-counter";
import { AnimatedRing } from "@/components/ui/animated-ring";
import { Reveal } from "@/components/ui/reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ArrowLeft, Sparkles, Check, Send, ShieldCheck, Zap } from "lucide-react";

export default function DesignSystemPage() {
  const t = useTranslations("DesignSystem");
  const common = useTranslations("Common");
  const { toast, success, error, warning, info } = useToast();

  const [pinValue, setPinValue] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState("grade-11");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [ringProgress, setRingProgress] = React.useState(84);

  const gradeOptions = [
    { value: "grade-10", label: "Grade 10 (O/L Foundation)", description: "Theory + Papers" },
    { value: "grade-11", label: "Grade 11 (O/L Target)", description: "Intensive Revision" },
    { value: "grade-12", label: "Grade 12 (A/L Combined Maths)", description: "Pure & Applied" },
    { value: "grade-13", label: "Grade 13 (A/L Fast-track)", description: "Model Papers" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-[1px] bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-[var(--accent)]">MC</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[var(--muted)]">
                Design Tokens 2026
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">
        {/* Header Hero */}
        <section className="space-y-4">
          <Reveal direction="down">
            <Badge variant="accent" dot>
              MC Mathematics UI Kit
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base text-[var(--muted)] max-w-2xl">
              {t("description")} Dark-first architecture, GPU-accelerated motion tokens,
              and glassmorphic depth designed for Sri Lankan mathematics students.
            </p>
          </Reveal>
        </section>

        {/* Color Palette Tokens */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Design Tokens & Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-2">
              <div className="h-10 rounded-lg bg-[var(--bg)] border border-[var(--border)]" />
              <div className="text-xs font-mono font-semibold">--bg</div>
              <div className="text-[10px] text-[var(--muted)]">Ink Navy</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)]" />
              <div className="text-xs font-mono font-semibold">--surface</div>
              <div className="text-[10px] text-[var(--muted)]">Surface Base</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="h-10 rounded-lg bg-[var(--brand)]" />
              <div className="text-xs font-mono font-semibold">--brand</div>
              <div className="text-[10px] text-[var(--muted)]">Electric Violet</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="h-10 rounded-lg bg-[var(--accent)]" />
              <div className="text-xs font-mono font-semibold">--accent</div>
              <div className="text-[10px] text-[var(--muted)]">Warm Gold</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="h-10 rounded-lg bg-[var(--good)]" />
              <div className="text-xs font-mono font-semibold">--good</div>
              <div className="text-[10px] text-[var(--muted)]">Emerald (#2DD4A0)</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="h-10 rounded-lg bg-[var(--bad)]" />
              <div className="text-xs font-mono font-semibold">--bad</div>
              <div className="text-[10px] text-[var(--muted)]">Rose Pink (#FF5C7A)</div>
            </div>
          </div>
        </section>

        {/* Buttons Showcase */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">{t("buttons")}</h2>
          <div className="flex flex-wrap items-center gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md">
            <Button variant="primary" magnetic>
              <Zap className="h-4 w-4 mr-1" /> Primary Magnetic
            </Button>
            <Button variant="accent" magnetic>
              <Sparkles className="h-4 w-4 mr-1" /> Accent Gold
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="primary" isLoading>
              Loading
            </Button>
          </div>
        </section>

        {/* Bento Glass Cards */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">{t("cards")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="bento" spotlight>
              <div className="space-y-3">
                <Badge variant="brand" dot>
                  Interactive Spotlight
                </Badge>
                <h3 className="text-lg font-bold">Cursor-Following Glow</h3>
                <p className="text-xs text-[var(--muted)]">
                  Move your mouse across this card to observe the 400px radial gradient
                  tracking your cursor coordinates.
                </p>
              </div>
              <div className="pt-6">
                <span className="font-mono text-3xl font-extrabold text-[var(--accent)]">
                  MCG10TP1001
                </span>
              </div>
            </GlassCard>

            <GlassCard variant="bento" spotlight glowColor="rgba(255, 200, 87, 0.2)">
              <div className="space-y-3">
                <Badge variant="accent" dot>
                  Performance Meter
                </Badge>
                <h3 className="text-lg font-bold">Class Average vs Kamal</h3>
                <p className="text-xs text-[var(--muted)]">
                  Deterministic analytics computed on edge servers.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6">
                <AnimatedRing value={ringProgress} size={90} strokeWidth={8} color="var(--accent)" />
                <div className="space-y-1 text-right">
                  <div className="text-xs text-[var(--muted)]">Rank Percentile</div>
                  <div className="font-mono font-bold text-lg text-[var(--good)]">Top 12%</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="bento" spotlight glowColor="rgba(45, 212, 160, 0.2)">
              <div className="space-y-3">
                <Badge variant="good" dot>
                  Security & RLS
                </Badge>
                <h3 className="text-lg font-bold">Encrypted Credentials</h3>
                <p className="text-xs text-[var(--muted)]">
                  Synthetic email mapping + 6-digit PIN with multi-role Row Level Security.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-[var(--good)]" />
                <span className="text-xs font-mono text-[var(--muted)]">
                  RLS ACTIVE ON ALL 12 TABLES
                </span>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Inputs & PIN Input */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">{t("inputs")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--muted)]">Standard Form Fields</h3>
              <Input label="Student Unique ID" placeholder="e.g. MCG10TP1001" />
              <Input
                label="Parent WhatsApp Number"
                placeholder="+94 77 123 4567"
                defaultValue="+94 77 987 6543"
              />
              <Input
                label="Error State Example"
                defaultValue="Invalid Phone Number"
                error="Please enter a valid Sri Lankan mobile number."
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--muted)]">
                  6-Digit Student PIN Input (Paste Supported)
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Try typing or pasting a 6-digit number (e.g. 582914):
                </p>
                <PinInput
                  value={pinValue}
                  onChange={setPinValue}
                  onComplete={(val) => success(`PIN entered: ${val}`, "Authentication Code")}
                />
                <p className="text-xs font-mono text-[var(--accent)] pt-2">
                  Current Value: {pinValue || "(empty)"}
                </p>
              </div>

              <div className="space-y-2">
                <Combobox
                  label="Select Class Grade (Searchable)"
                  options={gradeOptions}
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                  placeholder="Select Grade..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tabs & Skeletons */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Tabs & Skeleton States</h2>
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md space-y-6">
            <Tabs
              tabs={[
                { id: "overview", label: "Overview" },
                { id: "papers", label: "Papers (3 Active)" },
                { id: "attendance", label: "Attendance Heatmap" },
                { id: "analysis", label: "Topic Radar" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Animated Metrics & Motion */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">{t("motion")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <GlassCard variant="bento">
              <span className="text-xs text-[var(--muted)]">Students Enrolled</span>
              <div className="text-3xl font-extrabold text-[var(--accent)] pt-2">
                <StatCounter value={850} suffix="+" />
              </div>
            </GlassCard>
            <GlassCard variant="bento">
              <span className="text-xs text-[var(--muted)]">Papers Completed</span>
              <div className="text-3xl font-extrabold text-[var(--brand)] pt-2">
                <StatCounter value={42} />
              </div>
            </GlassCard>
            <GlassCard variant="bento">
              <span className="text-xs text-[var(--muted)]">Average Improvement</span>
              <div className="text-3xl font-extrabold text-[var(--good)] pt-2">
                <StatCounter value={18.4} prefix="+" suffix="%" decimals={1} />
              </div>
            </GlassCard>
            <GlassCard variant="bento">
              <span className="text-xs text-[var(--muted)]">WhatsApp Delivery</span>
              <div className="text-3xl font-extrabold text-[var(--accent)] pt-2">
                <StatCounter value={99.8} suffix="%" decimals={1} />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Interactive Triggers: Modal & Toasts */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Interactive Modals & Toasts</h2>
          <div className="flex flex-wrap items-center gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal Dialog
            </Button>
            <Button
              variant="outline"
              onClick={() => success("Mark recorded successfully!", "Paper 12")}
            >
              Toast Success
            </Button>
            <Button
              variant="outline"
              onClick={() => error("Invalid PIN entered. 3 attempts remaining.", "Auth Error")}
            >
              Toast Error
            </Button>
            <Button
              variant="outline"
              onClick={() => warning("Attendance is below 75% this month.", "Alert")}
            >
              Toast Warning
            </Button>
            <Button
              variant="outline"
              onClick={() => info("WhatsApp progress report queued.", "Notification")}
            >
              Toast Info
            </Button>
          </div>
        </section>

        {/* Modal Instance */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t("modalTitle")}
          description={t("modalDescription")}
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-[var(--muted)]">
              This modal component features smooth backdrop blur, keyboard ESC dismissal,
              and spring animation physics.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                {common("cancel")}
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setIsModalOpen(false);
                  success("Confirmed action from modal!");
                }}
              >
                {common("confirm")}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
