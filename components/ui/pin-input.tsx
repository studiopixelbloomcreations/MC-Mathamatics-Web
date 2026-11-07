"use client";

import * as React from "react";
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

    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();

    if (combined.length === length && !newDigits.includes("")) {
      onComplete?.(combined);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="one-time-code"
          value={digits[index] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] text-center text-lg sm:text-xl font-bold font-mono text-[var(--accent)] shadow-inner backdrop-blur-md focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 disabled:opacity-50 transition-all duration-150",
            error && "border-[var(--bad)] text-[var(--bad)] focus:ring-[var(--bad)]/30",
            digits[index] && "border-[var(--brand)]/50 bg-[var(--surface)]"
          )}
        />
      ))}
    </div>
  );
};
