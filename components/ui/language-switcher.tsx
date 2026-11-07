"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const nextLocale = locale === "en" ? "si" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] px-3 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--brand)] hover:text-[var(--accent)] cursor-pointer select-none",
        className
      )}
    >
      <Globe className="h-3.5 w-3.5 text-[var(--brand)]" />
      <span>{locale === "en" ? "සිංහල" : "English"}</span>
    </button>
  );
}
