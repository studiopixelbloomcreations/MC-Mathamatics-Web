# MC Mathematics — Production Dashboard & Rendering Performance

## 1. Architectural Optimizations
- **Smooth Scroll Isolation:** Lenis and GSAP ScrollTrigger ticker are completely bypassed on `/dashboard/*`, `/admin/*`, `/login`, and `/signup` routes. This removes any scroll interception overhead, ensuring instantaneous native 120Hz/60Hz scrolling and zero input latency on forms and data grids.
- **React Server Components & Streaming:** Dashboard pages leverage Server Components to fetch student data, attendance, and paper marks server-side in parallel using `createAdminClient()`.
- **Precomputed Analytical Cache:** Numerical metrics (overall average, consistency scores, rank movement) are calculated deterministically via `/lib/analysis/recompute.ts` and cached in the `analyses` table, eliminating blocking mathematical aggregation on client load.

## 2. Benchmark Metrics Target
- **First Contentful Paint (FCP):** < 0.8s
- **Time to Interactive (TTI):** < 1.4s
- **Interaction to Next Paint (INP):** < 50ms
- **Cumulative Layout Shift (CLS):** 0.00
