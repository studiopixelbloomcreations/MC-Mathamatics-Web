import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--brand)] font-mono font-bold text-2xl">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
        Page not found
      </h1>
      <p className="text-sm text-[var(--muted)] max-w-md">
        The requested page does not exist or has been relocated within the academy portal.
      </p>
      <div className="pt-2">
        <Link href="/">
          <Button variant="primary">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
