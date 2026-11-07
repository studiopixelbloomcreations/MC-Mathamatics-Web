"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [digits, setDigits] = React.useState<string[]>(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  });

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    setDigits(arr);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    const combined = newDigits.join("");
    onChange?.(combined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && !newDigits.includes("")) {
      onComplete?.(combined);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < length; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    const combined = newDigits.join("");
    onChange?.(combined);

    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
      onComplete?.(combined);
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
      {digits.map((digit, index) => {
        const isFilled = Boolean(digit);
        return (
          <motion.div
            key={index}
            animate={
              shouldReduceMotion || !isFilled
                ? { scale: 1 }
                : { scale: [1, 1.08, 1] }
            }
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 28,
            }}
            className="relative"
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={disabled}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "h-12 w-10 sm:h-14 sm:w-12 text-center text-xl font-bold font-mono rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] transition-all duration-150 focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20",
                error && "border-[var(--bad)] text-[var(--bad)] focus:ring-[var(--bad)]/20",
                isFilled && "border-[var(--brand)]/60 bg-[var(--surface-elevated)] text-[var(--brand)]"
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
