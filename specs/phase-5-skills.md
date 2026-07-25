# Phase 5 — Skills Section (Infinite Logo Loop)

Contract for the skills section — three categorized horizontal marquee rows
(Backend, Tools, Frontend) that scroll continuously. Replaces the earlier SVG
circuit-network layout ("SkillsCircuit" / hub-and-spoke) which had a resize bug
(SVG viewBox background/layout broke on window resize).

---

## Objective

A CSS-flow-based infinite marquee with three stacked rows. Each row scrolls at a
slow steady pace, fades at edges via `mask-image`, pauses on hover, and has a
thin divider below with a traveling glow dot. Zero fixed-dimension SVG layout —
pure CSS `translateX` animation — so resize bugs are structurally avoided.

## Prerequisites

- Phase 0 — Tailwind tokens configured, fonts loaded.
- Phase 1 — Nav anchor `#skills` resolves.
- `data/skills.js` exists with `category` field (backend / frontend / tools).

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/SkillsLoop/SkillsLoop.jsx` | create | Main loop component (replaces SkillsCircuit) |
| `src/components/SkillsLoop/SkillsLoop.css` | create | Infinite scroll animations, hover states, dividers |
| `src/data/skills.js` | unchanged | Reused as-is |

## Row layout (3 categories)

| Row | Category | Direction | Skills |
|---|---|---|---|
| 1 | Backend | scrolls left | C#, .NET, SQL, Php, Supabase (5) |
| 2 | Tools | scrolls right | GitHub, Docker, AWS, Azure, Claude Code, Vercel, PowerBI (7) |
| 3 | Frontend | scrolls left | React, JavaScript, HTML, CSS (4) |

Each row has a `#5B8FFF` dot + uppercase mono label above it, left-aligned.

## Technical design

### Infinite marquee (CSS-only, no JS timer)

- Each row renders a `.skill-row__marquee` containing two identical copies of its
  items back-to-back inside `.skill-row__marquee-inner` wrappers.
- CSS `@keyframes marquee-left` animates `translateX` from `0` to `-50%` (one full
  set width). The duplicate copy makes the seam invisible.
- `animation: marquee-left 35s linear infinite` — second copy follows seamlessly.
- Right-scrolling rows use `marquee-right` keyframe ( `-50%` → `0` ).

### Edge fade masking

- `.skill-row__track` has `overflow: hidden` and `mask-image: linear-gradient(...)`
  — transparent at 0–clamp, black in the middle, transparent at the far edge.
- Fade zones use `clamp(20px, 10vw, 80px)` so they shrink on mobile.

### Hover behavior

- Row hover sets `animation-play-state: paused` on the marquee.
- Individual chip hover highlights — `border-color: #5B8FFF`, `translateY(-2px)`,
  soft glow `box-shadow` — independent of row-level pause.

### Dividers with traveling dot

- Between rows: a thin `1px` `#2A2E3A` line.
- A `6px` `#5B8FFF` dot with `box-shadow` glow animates `left` from `0` to
  `calc(100% - 6px)` (or reverse) in 4s linear infinite.
- Divider below Backend (dot left→right), divider below Tools (dot right→left).

### Image error fallback

- `onError` on `<img>` sets local state → renders monogram (first-char-of-each-word
  or first 2 chars) in accent color inside the chip, matching the existing project
  convention for missing icons.

## Accessibility

- The duplicated second copy (used for seamless loop) gets `aria-hidden="true"`.
- Each track has `aria-label` listing all skill names (e.g. "Backend skills: C#,
  .NET, SQL, Php, Supabase") so screen readers get the full list once.
- Chips are `role="presentation"` and not focusable — they are decorative
  representations, not interactive controls.
- Hover-highlight on chips is purely visual (no interactive affordance lost).

## Acceptance criteria (DoD)

- [ ] Three rows: Backend (5), Tools (7), Frontend (4) — correct items per row.
- [ ] Each row scrolls infinitely in its designated direction with no visible seam.
- [ ] Left/right edges fade smoothly via `mask-image` — no hard cutoff.
- [ ] Hovering a row pauses that row's scroll.
- [ ] Hovering a chip highlights it (accent border, slight lift) independently.
- [ ] Dividers between rows have a traveling glow dot in the correct direction.
- [ ] `prefers-reduced-motion: reduce` → rows render as a static wrapped grid, no
      divider animation.

## Verification

1. `npm run dev` → scroll to Skills → confirm 3 rows: Backend, Tools, Frontend.
2. Watch each row scroll — infinite loop, no visible restart.
3. Hover a row → confirm scroll pauses. Hover a chip → confirm it highlights.
4. Resize window from 1440px down to 375px → confirm no breakage, no overflow,
   no disappearing elements. Chips wrap naturally in static/reduced mode.
5. DevTools → toggle `prefers-reduced-motion: reduce` → reload → confirm static
   grid, no animation.
6. Confirm no new npm dependencies added.
7. `npm run build` succeeds.

---

*This spec replaces the original Phase 5 contract (SkillsKeyboard + SkillsCircuit)
with the infinite-logo-loop design. The circuit-network layout was removed due to
a resize bug in its SVG viewBox-based layout; the CSS-flow-based marquee approach
avoids that class of bug by design.*
