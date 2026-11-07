"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type?: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-[var(--good)]" />,
    error: <AlertCircle className="h-4 w-4 text-[var(--bad)]" />,
    warning: <AlertTriangle className="h-4 w-4 text-[var(--warn)]" />,
    info: <Info className="h-4 w-4 text-[var(--brand)]" />,
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4 sm:p-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-xl backdrop-blur-xl"
            >
              <div className="mt-0.5">{icons[t.type || "info"]}</div>
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-xs font-semibold text-[var(--text)]">
                    {t.title}
                  </p>
                )}
                <p className="text-xs text-[var(--muted)]">{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="rounded p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);
  return {
    toast: (message: string, type: ToastType = "info", title?: string) =>
      context.addToast({ message, type, title }),
    success: (message: string, title?: string) =>
      context.addToast({ message, type: "success", title }),
    error: (message: string, title?: string) =>
      context.addToast({ message, type: "error", title }),
    warning: (message: string, title?: string) =>
      context.addToast({ message, type: "warning", title }),
    info: (message: string, title?: string) =>
      context.addToast({ message, type: "info", title }),
  };
}
