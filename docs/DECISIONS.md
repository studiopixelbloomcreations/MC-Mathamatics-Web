# Architecture & Technical Decisions

This document records key architectural and design choices made during development, as mandated by the MC Mathematics project blueprint.

## 1. Hosting & Runtime Strategy
- **Decision:** Target Cloudflare Workers via `@opennextjs/cloudflare` with Node.js compatibility enabled (`nodejs_compat`).
- **Rationale:** Free-tier commercial use permitted; lightning-fast global edge responses in Sri Lanka. Disallow Node-exclusive runtime APIs (such as runtime local filesystem operations, long-lived background in-memory timers) to guarantee edge compatibility.

## 2. Design System & Theming Tokens
- **Decision:** Dark-first design system with CSS custom property tokens for semantic colors (`--bg`, `--surface`, `--surface-glass`, `--border`, `--text`, `--muted`, `--accent`, `--brand`, `--good`, `--warn`, `--bad`).
- **Rationale:** Adheres to the 2026 design specification in Blueprint Part A2, offering an electric violet + warm gold signature palette with Lenis smooth scrolling and GPU-accelerated motion tokens.

## 3. Host-based Routing for Admin Portal
- **Decision:** Use Next.js `middleware.ts` to inspect the `Host` header. Requests matching `admin.*` are rewritten to the `/(admin)` route group, while direct access to `/admin` on the public domain is blocked in production.
- **Rationale:** Isolates the administrative cockpit on a separate subdomain while retaining a unified Next.js codebase.

## 4. Internationalization (i18n)
- **Decision:** Use `next-intl` supporting English (`en`) and Sinhala (`si`), with client cookies and header negotiation.
- **Rationale:** Ensures accessibility and usability for both English-medium and Sinhala-medium mathematics students in Sri Lanka.
