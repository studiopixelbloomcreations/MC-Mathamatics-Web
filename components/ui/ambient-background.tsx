"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient background with two slow (30s loop) drifting radial glows
 * and a subtle SVG noise overlay. Gives the Liquid Glass primitive
 * authentic optical density to refract and blur.
 */
export function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden select-none"
    >
      {/* Drifting Blob 1 - Warm Gold/Amber */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 0.12 }
            : {
                x: [0, 60, -40, 0],
                y: [0, -40, 50, 0],
                scale: [1, 1.15, 0.95, 1],
                opacity: [0.12, 0.18, 0.14, 0.12],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[15%] left-[10%] h-[560px] w-[560px] rounded-full blur-[140px] bg-[var(--brand)]"
      />

      {/* Drifting Blob 2 - Deep Neutral Slate */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: 0.08 }
            : {
                x: [0, -70, 50, 0],
                y: [0, 50, -30, 0],
                scale: [1, 0.9, 1.1, 1],
                opacity: [0.08, 0.14, 0.1, 0.08],
              }
        }
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[45%] -right-[10%] h-[600px] w-[600px] rounded-full blur-[160px] bg-[var(--accent)]"
      />

      {/* Micro-grain noise overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035] dark:opacity-[0.045] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="ambient-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ambient-noise)" />
      </svg>
    </div>
  );
}
