# Design System

Reference document for the tech stack, color palette, and typography used across the portfolio.

---

## 1. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | **React + Vite** | No SSR/SEO needs for a single-page, heavily client-side-interactive portfolio — Vite gives fast builds without Next.js overhead. (Revisit Next.js only if the Blog needs strong SEO later.) |
| Styling | **Tailwind CSS** | Fast to prototype, solid dark mode support, easy to keep spacing/color consistent across a long single page. |
| Scroll animation (Projects, timeline) | **Framer Motion** (`useScroll`, `useTransform`) | Native React integration, good learning curve, sufficient for the stacking cards effect. |
| Complex/pinned animation (fallback for Projects) | **GSAP + ScrollTrigger** | More control over pinning if Framer Motion isn't precise enough for the stacking effect. |
| Keyboard audio (Skills) | **Howler.js** (or native `Audio` API if sounds are few) | Better handling of preload and throttling multiple simultaneous plays than raw `<audio>`. |
| Icons | **Lucide React** | Lightweight, consistent, good coverage for social links/CV icons. |
| Deployment | **Vercel** or **Netlify** | Free tier covers this case, automatic deploy from GitHub. |

**Not needed:** Redux/Zustand or any global state library — a single-page portfolio doesn't need it. `useState`/`useRef` per section is enough.

---

## 2. Color Palette

Theme: "night storm" — near-black background, electric blue as the protagonist (matching the existing `ACCENT` value in `Lightning.jsx`), with a warm accent reserved for calls to action.

| Role | Hex | Usage |
|---|---|---|
| Page background | `#0A0C12` | Base background across the whole site — cold near-black, not pure black. |
| Surface / cards | `#12151C` | Cards, Skills keyboard base, Projects containers. |
| Lightning accent | `#5B8FFF` | Bolts, cursor spark trail, links, hover states — the de facto brand color. |
| Bolt core / highlights | `#D2E6FF` | Already used as the bolt's white core in the code; reuse for emphasized text or punctual highlights, not as a background. |
| Warm CTA accent | `#F2A93B` | Reserved for calls to action (main Contact button, landing CTA hover, maybe one Projects accent). Use sparingly — 2-3 touchpoints max, otherwise it competes with the blue and breaks the "storm" coherence. |
| Primary text | `#F5F6F8` | Off-white instead of pure white — softer on the eyes against such a dark background over a long scroll. |
| Secondary text | `#9AA3B2` | Muted labels, captions, secondary copy. |

**Usage rule:** blue = ambient/interactive, warm accent = action. Don't let the warm accent become a second background color.

---

## 3. Typography

Two-font pairing: a clean, modern sans for readability, and a geometric/technical display font for headings and interactive UI (Skills keyboard, nav) to reinforce the "electric/tech" feel without adding noise.

| Role | Font | Notes |
|---|---|---|
| Headings / display (About, Projects titles, section headers) | **Space Grotesk** | Geometric, slightly technical character — fits the storm/electric theme without being a gimmick font. Free on Google Fonts. |
| Body text (About Me copy, project descriptions, timeline entries) | **Inter** | Excellent readability at small sizes, huge language/weight coverage, the de facto standard for clean product UI — won't fight with the display font. Free on Google Fonts. |
| Monospace accents (Skills keycaps, timeline dates, code-like labels) | **JetBrains Mono** or **Space Mono** | Reinforces the "developer" identity in small doses — keycap labels, dates, tech stack tags. Don't use for paragraphs. Free on Google Fonts / JetBrains. |

**Weight usage:**
- Headings: 500–600 (medium/semibold) — avoid 700+, it reads heavy against a dark background with a lot of glow/blur already happening visually.
- Body: 400 regular, 500 for emphasis only (never bold everything).
- Monospace: 400–500, used only for short labels, never long text blocks.

**Sizing guidance:**
- Keep body text at 16px minimum for readability over a long scroll page.
- Headings should scale down on mobile more aggressively than usual, since the background canvas animation already adds visual noise — don't compound it with oversized type.

**Where to get them:** all three are free and available via [Google Fonts](https://fonts.google.com) (Space Grotesk, Inter, Space Mono) or [JetBrains Mono's own distribution](https://www.jetbrains.com/lp/mono/) if preferred over Space Mono — either works, pick based on which keycap look you like better once you prototype Skills.

---

## Open questions

1. **Space Grotesk vs. an alternative display font:** worth prototyping the Landing name/headline in both Space Grotesk and something like Sora before locking it in — they're close in feel but Sora reads slightly warmer/less mono-adjacent.
2. **Monospace choice for Skills keycaps:** JetBrains Mono vs. Space Mono — mostly a matter of taste (JetBrains Mono is a touch more "IDE," Space Mono a touch more "retro/display"). Worth testing directly on the keycap component.
