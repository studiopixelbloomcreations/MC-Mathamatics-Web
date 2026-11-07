import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border select-none",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border)] bg-[var(--surface-glass)] text-[var(--text)]",
        brand:
          "border-[var(--brand)]/30 bg-[var(--brand)]/15 text-[var(--brand)]",
        accent:
          "border-[var(--accent)]/30 bg-[var(--accent)]/15 text-[var(--accent)]",
        good:
          "border-[var(--good)]/30 bg-[var(--good)]/15 text-[var(--good)]",
        warn:
          "border-[var(--warn)]/30 bg-[var(--warn)]/15 text-[var(--warn)]",
        bad:
          "border-[var(--bad)]/30 bg-[var(--bad)]/15 text-[var(--bad)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "brand" && "bg-[var(--brand)] animate-pulse",
            variant === "accent" && "bg-[var(--accent)] animate-pulse",
            variant === "good" && "bg-[var(--good)]",
            variant === "warn" && "bg-[var(--warn)]",
            variant === "bad" && "bg-[var(--bad)]",
            (!variant || variant === "default") && "bg-[var(--muted)]"
          )}
        />
      )}
      {children}
    </div>
  );
}
