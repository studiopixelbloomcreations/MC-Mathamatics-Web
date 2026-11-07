"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--muted)] select-none tracking-normal"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              error && "border-[var(--bad)] focus:ring-[var(--bad)]/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--bad)] font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
