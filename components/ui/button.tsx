"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand)] text-[#0c0d10] font-semibold shadow-md shadow-[var(--brand)]/15 hover:brightness-105",
        accent:
          "bg-[var(--accent)] text-[#0c0d10] font-semibold shadow-md shadow-[var(--accent)]/15 hover:brightness-105",
        secondary:
          "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-elevated)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--surface-elevated)]",
        ghost:
          "text-[var(--text)] hover:bg-[var(--surface-elevated)] hover:text-[var(--brand)]",
        destructive:
          "bg-[var(--bad)] text-white shadow-md shadow-[var(--bad)]/20 hover:brightness-105",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-lg",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base rounded-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  magnetic?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size,
      magnetic = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const isPrimaryCTA = variant === "primary" || variant === "accent" || magnetic;

    // Magnetic physics with studio spring: stiffness 400, damping 28
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { stiffness: 400, damping: 28 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldReduceMotion || !isPrimaryCTA) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.18);
      y.set((e.clientY - centerY) * 0.18);
    };

    const handleMouseLeave = () => {
      if (shouldReduceMotion) return;
      x.set(0);
      y.set(0);
    };

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        style={shouldReduceMotion || !isPrimaryCTA ? undefined : { x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
