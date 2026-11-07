# MC Mathematics E-Learning Platform

> **"Maths is the question. MC is the answer."**  
> Premium e-learning, deterministic diagnostic assessment, and autonomous WhatsApp platform for master mathematics teacher **Malinga C Dissanayake** (Kurunegala, Sri Lanka).

---

## 🌟 Executive Summary

MC Mathematics is a modern web platform engineered for high-performance scale, strict security, zero-cost parent communication, and deterministic diagnostic analytics:

1. **Student Portal:**
   - Atomic Unique ID generation (`MCG10TP1001`, `MCG11T1002`).
   - 6-digit PIN login with browser credential autofill.
   - Live Supabase Realtime mark & announcement toasts.
   - Comprehensive parental controls gate (bedtime lock, hide results, audit log).
   - Dynamic **"Send me the report"** button linking directly to WhatsApp.
2. **Deterministic Analysis Engine:**
   - Pure code calculations for percentiles, standard deviation, trends, and stability.
   - 6-layer Recharts visual suite: Trend line, Topic radar, Comparison bars, Rank movement, Topic heatmap, and Consistency meter.
   - Zero hallucination guarantee: all insights are strictly calculated in code.
3. **Sir's AI Mode (WhatsApp Voice & Text Control):**
   - Natural language mark entry, attendance roll call, and grade announcements.
   - Zod tool validation & 24-hour undo window.
   - Server-side 409 guard prevents concurrent web editing.
4. **Rule-Based Parent Bot (Zero Message Cost):**
   - Inbound 24-hour free window strategy (`START`, `REPORT`, `PIN`, `STOP`).
   - Sibling auto-detection and multi-student routing.
   - Zero student data disclosure to unregistered numbers.
5. **Runtime Architecture:**
   - Production target: **Cloudflare Workers** via `@opennextjs/cloudflare`.
   - Vercel for preview branch deployments.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Strict TypeScript)
- **Styling & Motion:** Tailwind CSS v4, GSAP + ScrollTrigger, Framer Motion, Lenis Smooth Scroll
- **Database & Auth:** Supabase (`@supabase/ssr`, PostgreSQL, Row-Level Security on all 14 tables)
- **Analytics & Math:** KaTeX, Recharts
- **Internationalization:** `next-intl` (English & Sinhala)
- **Testing:** Vitest, Playwright

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Typecheck & lint
npm run typecheck
npm run lint

# 6. Production build
npm run build
```
