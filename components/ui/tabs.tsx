"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] p-1 backdrop-blur-md",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors select-none",
              isActive ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 -z-10 rounded-lg bg-[var(--surface)] shadow-sm border border-[var(--border)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
