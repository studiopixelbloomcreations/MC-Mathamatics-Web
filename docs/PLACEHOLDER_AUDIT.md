# Placeholders, Mocks & Test Data Audit

Date: 2026-11-08
Target: MC Mathematics Production Hardening

## 1. Identified Items & Audit Findings

| Category | File | Location | Description | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| **Dev Tools** | `app/(admin)/admin/ai-simulator` | Entire folder | Test-only chat simulator for AI testing | Removed from production routes and admin navigation. |
| **Seeds** | `app/actions/seed.ts` | Entire file | Seed action generating 12 fake students | Removed action and removed from UI. |
| **Mock Auth Fallback** | `app/actions/auth.ts` | Lines 169-180 | Fallback creating dummy MCG101001 ID if Supabase DB is offline | Removed mock fallback; returns real DB error gracefully. |
| **Mock Profile Fallback** | `app/actions/dashboard.ts` | Lines 162-175 | Fallback profile returning fake "Kamal Perera" | Removed mock profile; throws unauthorized redirect to login. |
| **Fake Testimonials** | `components/landing/testimonials-marquee.tsx` | Lines 10-35 | Hard-coded testimonials (Kasun, Mrs. Nilanthi, Dineth, Sithmi) | Refactored to read from database `site_content` / verified reviews. Section only renders if approved reviews exist. |
| **Fake Stats Counters** | `components/landing/trust-strip.tsx` | Lines 10-40 | Hardcoded stats (1200+ students, 23.8% gain) | Refactored to query real aggregate counts or hide when below threshold. |
| **Hardcoded Copy** | `components/landing/statement-section.tsx` | Line 53 | Placeholder TODO comment for Sir's statement | Replaced with dynamic `site_content` statement with dignified fallback. |
| **Console Noise** | `app/api/whatsapp/webhook/route.ts`, `lib/ai/processor.ts` | Various | Debug log noise | Replaced with clean structured production logging without leaking secrets. |
| **WhatsApp Number** | Multiple files | Hardcoded fallback `+94771234567` | Placeholder phone number | Replaced with environment variable `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_AI_NUMBER` (+1 555 144 4070 configured). |

## 2. Real Logic Implementation Plan
1. `site_content` table and management action in Admin (`/admin/content`) for Sir to edit bio, photos, testimonials, and announcements.
2. Production Privacy Policy (`/privacy`), Terms of Service (`/terms`), and Parent Consent details.
3. Clean error boundaries (`app/[locale]/error.tsx`, `app/[locale]/not-found.tsx`).
