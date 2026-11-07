"use client";

import * as React from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  formula,
  displayMode = false,
  className,
}) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
        });
      } catch (err) {
        console.error("KaTeX error:", err);
      }
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={cn("inline-block select-none", className)} />;
};
