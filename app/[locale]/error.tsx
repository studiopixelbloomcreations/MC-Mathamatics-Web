"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold text-xl">
        !
      </div>
      <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
        Something unexpected occurred
      </h2>
      <p className="text-sm text-[var(--muted)] max-w-md">
        We encountered an error loading this section. Our team has been notified.
      </p>
      <div className="pt-2 flex gap-3">
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
        <Button variant="ghost" onClick={() => window.location.href = "/"}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
