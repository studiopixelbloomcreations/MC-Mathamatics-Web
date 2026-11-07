"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  className?: string;
  variant?: "floating" | "card" | "capsule" | "surface" | "modal";
  interactive?: boolean;
  tint?: "clear" | "subtle" | "accent";
}

/**
 * Universal Liquid Glass Primitive (iOS 27 Inspired).
 * Incorporates specular cursor tracking, multi-layer refractive highlights,
 * and tactile iOS spring physics.
 */
export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  (
    {
      children,
      className,
      variant = "card",
      interactive = false,
      tint = "clear",
      style,
      onMouseMove,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseMove) onMouseMove(e);
      const element = localRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    // Variant style maps
    const variantStyles = {
      floating: "rounded-2xl shadow-xl",
      card: "rounded-2xl shadow-md",
      capsule: "rounded-full shadow-lg",
      surface: "rounded-xl shadow-sm",
      modal: "rounded-3xl shadow-2xl",
    }[variant];

    const tintStyles = {
      clear: "",
      subtle: "bg-opacity-80 dark:bg-opacity-70",
      accent: "border-amber-500/30 shadow-amber-500/5",
    }[tint];

    return (
      <>
        {/* Hidden SVG Refraction Filter for Chromium browsers */}
        <RefractionFilter />

        <motion.div
          ref={(node) => {
            localRef.current = node;
            if (typeof forwardedRef === "function") {
              forwardedRef(node);
            } else if (forwardedRef) {
              forwardedRef.current = node;
            }
          }}
          onMouseMove={handlePointerMove}
          whileTap={
            interactive
              ? {
                  scale: 0.978,
                  transition: { type: "spring", stiffness: 450, damping: 25 },
                }
              : undefined
          }
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className={cn(
            "liquid-glass",
            variantStyles,
            tintStyles,
            interactive && "cursor-pointer active:cursor-grabbing",
            className
          )}
          style={
            {
              "--mx": `${mousePos.x}%`,
              "--my": `${mousePos.y}%`,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </motion.div>
      </>
    );
  }
);

Glass.displayName = "Glass";

/**
 * Global SVG Refraction Filter for Liquid Glass Lensing
 */
let hasMountedRefraction = false;

export function RefractionFilter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!hasMountedRefraction) {
      hasMountedRefraction = true;
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="lens-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves="1"
            result="warp"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="4"
            in="SourceGraphic"
            in2="warp"
          />
        </filter>
      </defs>
    </svg>
  );
}
