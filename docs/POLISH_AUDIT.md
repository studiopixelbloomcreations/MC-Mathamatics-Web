# MC Mathematics — Visual & Motion Polish Audit
**Audit Date:** November 2026  
**Focus:** Elimination of "AI-Generated / Vibe-Coded" Aesthetics in favor of Calm, Hand-Crafted Studio Quality.

---

## 1. Audit Findings: "Vibe-Coded" Smells Identified

| Anti-Pattern | Where Identified | Root Issue | Design Resolution |
|---|---|---|---|
| **Emoji used as UI icons** | `🤖`, `👋`, `📄`, `🔑`, `📊`, `❌`, `✅`, `⚠️`, `🚫` in AI Mode, greetings, modals, and simulator | Feels informal and amateurish like a quick prototype | Replace all emoji with Phosphor Icons (`@phosphor-icons/react`, Regular weight, consistent 1.5px optical stroke). Zero emoji in UI. |
| **Mismatched Icon Styles** | Mixed Lucide icons with varying stroke weights (1.5 to 2.5) across cards and buttons | Visual inconsistency; different corner roundings on icons | Single icon system: Phosphor Icons at standardized sizes (16px, 20px, 24px) with subtle interactive spring physics on hover/press. |
| **Default / Generic Fonts** | Default Geist sans across headings and body | Lacks human editorial identity | Self-host **Satoshi** (Fontshare) for headings and UI with tabular numerals (`tnum`) for marks and IDs. Restrict serif (`Instrument Serif`) exclusively to the master slogan. |
| **Purple / Blue / Pink Gradients** | Aurora gradient backgrounds, indigo/purple badges in admin and dashboard | Classic "AI wrapper / landing page template" gradient aesthetic | Strip all decorative purple/violet/pink gradients. Adopt calm, architectural neutrals (`#0e0f12` in dark mode, `#f8f7f4` in light mode) + **ONE brand accent**: MC Precision Gold. |
| **Heavy Harsh Borders** | Prominent `border-white/10`, `border-amber-500/30` on every card | Visual clutter; borders segment space mechanically | Replace heavy borders with **Liquid Glass**: 1px gradient specular highlight (brighter top-left, faint bottom-right), inset rim highlights, and soft layered shadows. |
| **Inconsistent Corner Radii** | Arbitrary `rounded-lg`, `rounded-xl`, `rounded-2xl` without concentric math | Nested elements feel misaligned | Enforce strict **concentric radii formula**: $\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}$. |
| **Artificial Copy & Jargon** | "Welcome back 👋", "Cockpit", "Pulse", "Deterministic Assessment" | Generic SaaS template phrasing | Refine to calm, confident, editorial sentence-case copy written for real students, parents, and Sir. |
| **Flat Empty States** | Dashed border boxes with static text | Visually dead when no data is loaded | Gentle ambient idle motion, clean typography, purposeful call to action. |
| **Missing Brand Imagery** | Placeholder initials ("MC") in colored boxes | Sterile, impersonal | Incorporate the official MC Mathematics emblem and Sir Malinga C Dissanayake's verified portrait. |

---

## 2. Design Direction: Minimal, Calm, Premium

- **Grid:** Strict 4px / 8px spatial grid with deliberate whitespace.
- **Color System:**
  - Dark Theme: Neutral slate-tinted obsidian (`#0c0d10`), surface (`#14161c`), elevated (`#1c1f26`).
  - Light Theme: Warm architectural paper (`#f8f7f4`), surface (`#ffffff`), elevated (`#f1efe9`).
  - Brand Accent: **MC Gold** (`#eab308` dark / `#b45309` light, rigorously checked for $\ge 4.5:1$ WCAG AA contrast).
- **Typography:**
  - Headings & Interface: **Satoshi** (400, 500, 700, 900) with optical tracking.
  - Numbers, Marks, Unique IDs: Satoshi / JetBrains Mono with tabular figures (`font-feature-settings: "tnum"`).
  - Slogan Headline: **Instrument Serif** (used once for editorial dignity).
  - Sinhala Translation: **Noto Sans Sinhala**.
- **Liquid Glass Specification (iOS 27 Inspired):**
  - High-refraction blur (20px), saturation boost (1.6), pointer-reactive specular highlight (`--mx`, `--my`), SVG displacement map refraction lens, and iOS squish spring feedback on press (`scale: 0.975`).
