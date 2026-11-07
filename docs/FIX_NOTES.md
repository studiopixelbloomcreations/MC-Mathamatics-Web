# Root Cause Diagnosis & Fix Notes: Blank Section & Layout Pass

## Executive Summary
This document provides empirical evidence and root-cause analysis for the blank section following the Hero sequence on the MC Mathematics landing page, as observed across 6 responsive viewports (360px, 390px, 768px, 1024px, 1440px, 1920px).

---

## 1. Empirical Evidence (Playwright Test Metrics & Screenshots)

Captured before-fix screenshots across all 6 viewports are archived in `/docs/fix-screenshots/before/`.

### Scroll Step Metrics:
- **mobile-360 (360x740)**:
  - Hero container height: `1628px` (`2.2 * 740px`)
  - Sticky viewport position: `sticky`, top: `0px`
  - Section offsetTop: `1628px`
  - Scroll 740px (1.0x viewport height): Screenshot `mobile-360-scroll-740.png` (14 KB) - blank screen during hero transition.
  - Scroll 1628px (Hero exit point): `sectionOpacity: 1`, but child `<Reveal>` **`revealOpacity: 0`** (content invisible).
- **mobile-390 (390x844)**:
  - Hero container height: `1857px` (`2.2 * 844px`)
  - Scroll 844px (1.0x viewport height): Screenshot `mobile-390-scroll-844.png` (15 KB) - blank screen.
  - Scroll 1857px (Hero exit point): `sectionOpacity: 1`, child `<Reveal>` **`revealOpacity: 0`** (content invisible).
- **tablet-768 (768x1024)**:
  - Hero container height: `2253px` (`2.2 * 1024px`)
  - Scroll 1024px: Screenshot `tablet-768-scroll-1024.png` (21 KB) - blank screen.
  - Scroll 2253px: `sectionOpacity: 1`, child `<Reveal>` **`revealOpacity: 0`** (content invisible).
- **laptop-1024 (1024x768)**:
  - Hero container height: `1690px` (`2.2 * 768px`)
  - Scroll 768px: Screenshot `laptop-1024-scroll-768.png` (21 KB) - blank screen.
  - Scroll 1690px: `sectionOpacity: 1`, child `<Reveal>` **`revealOpacity: 0`** (content invisible).
- **desktop-1440 (1440x900)**:
  - Hero container height: `1980px` (`2.2 * 900px`)
  - Scroll 900px: Screenshot `desktop-1440-scroll-900.png` (23 KB) - blank screen.
  - Scroll 1980px: `sectionOpacity: 1`, child `<Reveal>` **`revealOpacity: 0`** (content invisible).
- **ultrawide-1920 (1920x1080)**:
  - Hero container height: `2376px` (`2.2 * 1080px`)
  - Scroll 1080px: Screenshot `ultrawide-1920-scroll-1080.png` (10 KB) - blank screen.

---

## 2. Confirmed Root Causes

1. **Hidden Initial State & Intersection Observer Failure in `<Reveal>`**:
   `components/ui/reveal.tsx` initializes content with `opacity: 0, y: 20`. It relies on Framer Motion's `whileInView` with a `-80px` margin. Because the hero element above it is a `220vh` sticky block and `<main>` has `overflow-x: hidden`, the IntersectionObserver bounding box calculations fail or delay firing, leaving the entire section right below the hero rendered at `opacity: 0` (invisible DOM elements taking up blank space).
2. **Excessive Spacer Height (`h-[220vh]`) & Sticky Dead Zone**:
   `HeroSequence` utilized `className="relative h-[220vh] w-full"`. The scroll animation keyframes finished before the container scroll reached completion, creating a ~1.2 screen-height dead band where the screen remained frozen in a static state, appearing to the user as a broken or blank section.
3. **Ancestor `overflow-x: hidden`**:
   `app/[locale]/page.tsx` contained `<main className="flex min-h-screen flex-col overflow-x-hidden">`. As per W3C CSS specifications, applying `overflow-x: hidden` to a parent establishes an overflow scroll container, which breaks native CSS `position: sticky` and disrupts viewport scroll observers.
4. **Mobile Pinning Traps & Viewport Height Bug (`100vh`)**:
   On mobile devices (360px and 390px), pinning an element across `220vh` requires extensive scrolling without touch feedback. Additionally, using `100vh` instead of `100svh`/`100dvh` causes jitter and layout jumps as mobile address bars expand and collapse.
5. **Lack of Safe Fallback for Motion & No-JS**:
   If client animation fails or takes time to hydrate, content must be visible by default, not hidden.

---

## 3. Action Plan & Architectural Fixes

1. **Make Visibility Safe by Default**:
   - Refactor `components/ui/reveal.tsx` to ensure initial visibility is safe. Respect `prefers-reduced-motion` and hydration gracefully.
   - Remove `overflow-x-hidden` from `<main>` and use `overflow-x: clip` or handle child containment cleanly without breaking sticky contexts.
2. **Hero Sequence Responsive Pinning**:
   - On small screens (`< 768px`), disable multi-screen sticky pinning. Present the hero as a clean, engaging fade-in presentation (`100svh`).
   - On desktop screens (`>= 768px`), tighten scroll height from `220vh` to a smooth, proportional `160vh`, eliminating dead scroll bands.
   - Use `100svh` / `100dvh` for responsive height handling.
3. **Add Calm Statement Section (Part 2)**:
   - Insert the new `StatementSection` between Hero and Bento grid.
   - Include headline: `"One teacher. One method. Progress you can measure."`
   - Include customizable Sir Malinga statement note.
   - Include 01 Learn / 02 Practice / 03 Improve with hairline dividers.
   - Include the quiet animated analysis card preview with SVG drawing line and rolling score.
4. **Clipped Components & CSS Variable `--header-h` (Part 3)**:
   - Expose dynamic `--header-h` measured via ResizeObserver on FloatingHeader.
   - Apply `scroll-padding-top: var(--header-h, 80px)` and safe top/bottom spacing.
   - Eliminate `overflow: hidden` traps on parent cards with shadows.
5. **Spacing System & Container Queries (Part 4)**:
   - Clamp section padding `clamp(64px, 8vw, 128px)`.
   - Max width `1280px` for landing, fluid up to `1600px` for dashboard.
   - Container queries for dashboard card grids.
