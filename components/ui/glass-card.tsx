"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean;
  glowColor?: string;
  variant?: "default" | "bento" | "interactive";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      children,
      spotlight = true,
      glowColor = "rgba(108, 92, 231, 0.15)",
      variant = "default",
      onMouseMove,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current && spotlight) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      onMouseMove?.(e);
    };

    return (
      <div
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-xl transition-all duration-300",
          variant === "interactive" &&
            "hover:-translate-y-1 hover:border-[var(--brand)]/50 hover:shadow-xl hover:shadow-[var(--brand)]/10 cursor-pointer",
          variant === "bento" &&
            "p-6 flex flex-col justify-between shadow-lg shadow-black/5",
          className
        )}
        {...props}
      >
        {/* Dynamic Spotlight Glow */}
        {spotlight && isHovered && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`,
            }}
          />
        )}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
