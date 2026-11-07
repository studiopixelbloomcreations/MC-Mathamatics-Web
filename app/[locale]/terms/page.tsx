import React from "react";
import { Link } from "@/i18n/routing";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
      <div className="space-y-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
          Terms of Service &amp; Academic Agreement
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Governing enrolment, student codes of conduct, and examination participation. Last updated: November 2026.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-sm text-[var(--muted)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">1. Enrolment &amp; Attendance</h2>
          <p>
            Enrolment grants a non-transferable student seat in designated academic lectures and examination sittings in Kurunegala. Students must maintain a minimum 75% attendance threshold to remain eligible for model paper discussions and term diagnostic evaluations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">2. Examination Integrity &amp; Strict Marking</h2>
          <p>
            Model papers are administered under strict examination hall conditions. Submission of fraudulent papers or plagiarism will result in disqualification and notification of parents via registered WhatsApp channels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">3. Intellectual Property</h2>
          <p>
            All lecture notes, model paper compilations, marking schemes, and pedagogical materials prepared by Malinga C Dissanayake are protected intellectual property. Redistribution, reproduction, or commercial resale without written authorization is prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">4. Platform Use &amp; Account Security</h2>
          <p>
            Students are responsible for safeguarding their unique Student ID and 6-digit access PIN. Sharing credentials or attempting unauthorized access to another student&apos;s academic telemetry will trigger automated IP lockout and administrative review.
          </p>
        </section>
      </div>

      <div className="pt-8 border-t border-[var(--border)] flex gap-4">
        <Link href="/" className="text-sm font-medium text-[var(--brand)] hover:underline">
          &larr; Back to Home
        </Link>
        <Link href="/privacy" className="text-sm font-medium text-[var(--muted)] hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
