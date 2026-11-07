"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  searchPlaceholder = "Search...",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full space-y-1.5", className)}>
      {label && (
        <label className="text-xs font-medium text-[var(--muted)] select-none">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] px-4 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
      >
        <span className={cn(!selectedOption && "text-[var(--muted)]/60")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--muted)] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center border-b border-[var(--border)] px-3 py-2">
            <Search className="h-4 w-4 text-[var(--muted)] mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-[var(--muted)]">
                No results found.
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--surface-glass)]",
                    opt.value === value && "bg-[var(--brand)]/15 text-[var(--brand)] font-medium"
                  )}
                >
                  <div>
                    <div>{opt.label}</div>
                    {opt.description && (
                      <div className="text-xs text-[var(--muted)]">
                        {opt.description}
                      </div>
                    )}
                  </div>
                  {opt.value === value && (
                    <Check className="h-4 w-4 text-[var(--brand)]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
