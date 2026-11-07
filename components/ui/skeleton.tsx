import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--surface-glass)] border border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}
