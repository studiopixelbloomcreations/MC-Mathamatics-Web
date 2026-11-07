"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("Common");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#analysis", label: "Smart Analysis" },
    { href: "#grades", label: "Classes (6–13)" },
    { href: "#meet-sir", label: "Meet Sir" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md group-hover:border-[var(--brand)] transition-colors">
            <span className="font-mono text-lg font-black tracking-tight text-[var(--accent)]">
              MC
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[var(--text)]">
              MC Mathematics
            </span>
            <span className="text-[10px] tracking-wider text-[var(--muted)] uppercase font-mono">
              Kurunegala
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />
          <Link href="/login">
            <Button variant="ghost" size="sm" magnetic>
              {t("login")}
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="accent" size="sm" magnetic>
              {t("signup")}
              <Sparkles className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] text-[var(--text)]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-[var(--border)] bg-[var(--surface)] px-6 py-6 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="h-[1px] bg-[var(--border)] my-2" />
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-[var(--muted)]">{t("language")}</span>
              <LanguageSwitcher />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button variant="accent" className="w-full">
                  {t("signup")}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
