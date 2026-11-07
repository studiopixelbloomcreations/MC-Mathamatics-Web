"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-white/10 text-center space-y-4">
          <h2 className="text-xl font-bold">Critical Application Error</h2>
          <p className="text-xs text-zinc-400">
            A critical system exception was encountered. Please reload the application.
          </p>
          <Button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-500 text-black font-bold text-xs"
          >
            Reload Platform
          </Button>
        </div>
      </body>
    </html>
  );
}
