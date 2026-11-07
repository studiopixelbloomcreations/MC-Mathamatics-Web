import React from "react";
import { Link } from "@/i18n/routing";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
      <div className="space-y-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
          Privacy Policy &amp; Data Protection
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Compliance with Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA). Last updated: November 2026.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-sm text-[var(--muted)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">1. Overview &amp; Data Controller</h2>
          <p>
            MC Mathematics (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Academy&rdquo;), founded by Malinga C Dissanayake in Kurunegala, Sri Lanka, operates as the data controller for personal information collected through our website, student dashboards, and WhatsApp diagnostic service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-[var(--text)]">Student Profile:</strong> Full name, academic grade (6–13), class stream (Theory or Theory + Paper), atomic student identifier, and hashed 6-digit access PIN.</li>
            <li><strong className="text-[var(--text)]">Parent Information:</strong> Verified WhatsApp mobile number and consent timestamps.</li>
            <li><strong className="text-[var(--text)]">Academic Telemetry:</strong> Model paper scores, sectional marking breakdown, class attendance history, and diagnostic error categorizations.</li>
            <li><strong className="text-[var(--text)]">Security Logs:</strong> Hashed IP addresses, browser user-agents, and timestamped login logs for brute-force defense.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">3. Children&apos;s Data &amp; Parental Consent</h2>
          <p>
            Because our students include minors under 18 years of age, registration requires verifiable parental/guardian consent recorded with an auditable timestamp during sign-up. Parents hold statutory rights under Sri Lankan PDPA to inspect, export, or request deletion of their child&apos;s educational records at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">4. WhatsApp Telemetry &amp; AI Processing</h2>
          <p>
            Progress reports are transmitted via Meta WhatsApp Cloud API within standard 24-hour service windows initiated by parents. WhatsApp communication contains academic progress metrics only; security PINs are never transmitted over WhatsApp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">5. Data Retention &amp; Erasure Requests</h2>
          <p>
            Parents may request data exports or account erasure by submitting a verified request to administration or through the Parental Controls console. Inactive student records are permanently purged after two examination cycles.
          </p>
        </section>
      </div>

      <div className="pt-8 border-t border-[var(--border)] flex gap-4">
        <Link href="/" className="text-sm font-medium text-[var(--brand)] hover:underline">
          &larr; Back to Home
        </Link>
        <Link href="/terms" className="text-sm font-medium text-[var(--muted)] hover:underline">
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
