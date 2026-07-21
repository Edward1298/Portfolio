# Phase 1 — App Shell & Navigation

Contract for the app shell phase. Builds the single-page root, the fixed navigation bar with anchor links to all six sections, IntersectionObserver-driven active-section highlighting, and global base styles. Section components are created as **minimal stubs** that later phases fill in.

---

## Objective

A working single-scroll page where the nav is fixed, all six section anchors resolve and scroll smoothly, the active section is highlighted in the nav as the user scrolls, and base styling (background, text color, smooth scroll) is in place. Each section exists as a stub component so that phases 3–8 can replace them without touching `App.jsx` or `Nav.jsx`.

## Prerequisites

- ✅ Phase 0 complete — Vite project runs, Tailwind tokens configured, folders exist.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/App.jsx` | edit | Render `Nav` + all six section stubs |
| `src/App.css` | create (optional) | App-level layout glue if Tailwind isn't enough |
| `src/index.css` | edit | Ensure base styles from Phase 0 are sufficient |
| `src/components/Nav/Nav.jsx` | create | Fixed nav bar with anchor links |
| `src/components/Nav/Nav.css` | create (optional) | Nav-specific styles if Tailwind isn't enough |
| `src/hooks/useInView.js` | create | IntersectionObserver wrapper (reused by sections later) |
| `src/components/Landing/Landing.jsx` | create (stub) | `id="landing"` placeholder |
| `src/components/About/About.jsx` | create (stub) | `id="about"` placeholder |
| `src/components/SkillsKeyboard/SkillsKeyboard.jsx` | create (stub) | `id="skills"` placeholder |
| `src/components/Projects/Projects.jsx` | create (stub) | `id="projects"` placeholder |
| `src/components/Certifications/Certifications.jsx` | create (stub) | `id="certifications"` placeholder |
| `src/components/Contact/Contact.jsx` | create (stub) | `id="contact"` placeholder |

> Architecture governance: all paths above are already mapped in `Architecture.md` §4 — no guide update needed for Phase 1.

## Tasks

### 1.1 `App.jsx` — single-page wrapper
- Import and render `<Nav />` followed by the six section components in order: `Landing`, `About`, `SkillsKeyboard`, `Projects`, `Certifications`, `Contact`.
- Each section is a direct child of a top-level `<>` fragment (no routing — `Portfolio_initiative.md` §1 mandates a single-page scroll).
- Sections must be stacked vertically; each wrapper `<section>` carries its `id` so anchor links resolve.

### 1.2 Fixed nav bar with anchor links
- `Nav.jsx` renders a `<header>` / `<nav>` fixed to the top (`position: fixed`, `z-index` above content, full width).
- Nav links (in order, exact labels): **Landing**, **About**, **Skills**, **Projects**, **Certifications**, **Contact**.
- Each `<a>` uses `href="#<id>"` matching the section `id`s above.
- Use Lucide React icons sparingly if helpful; text labels are required for accessibility.
- Desktop-first layout: links aligned to the right; on mobile (<768px) collapse to a compact row or a menu — choose the simplest accessible option (a horizontal scroll row or a disclosure menu). Keep touch targets ≥44×44px (Design System §7).

### 1.3 Active section highlight on scroll
- Implement `useInView.js`: a `useInView(options)` hook returning `[ref, inView]` based on `IntersectionObserver`. Options should expose `threshold` and `rootMargin` with sensible defaults.
- Use it in `Nav.jsx` (or `App.jsx`) to track which section is most in view and apply an active style to the matching link (e.g. `text-accent` + `shadow-glow-sm`).
- Active state must update as the user scrolls through each section, not on click only.
- The last section (`Contact`) must also be detectable — tune `rootMargin` so the bottom section can become active.

### 1.4 Global base styles
- `src/index.css`:
  - `html { scroll-behavior: smooth; }` (already from Phase 0).
  - `body { @apply bg-bg text-primary font-sans antialiased; }` (already from Phase 0 — verify).
  - Add `scroll-margin-top` to each `<section>` so anchor jumps don't hide behind the fixed nav (value = nav height + small gap, e.g. `scroll-mt-20`).
  - Visible focus state for all interactive elements: `:focus-visible { outline: 2px solid #5B8FFF; outline-offset: 2px; }` (Design System §7).

## Section stubs (common pattern)

Each stub is a minimal component so later phases can expand it without breaking `App.jsx` / `Nav.jsx`:
```jsx
export default function Landing() {
  return (
    <section id="landing" className="scroll-mt-20 min-h-screen flex items-center justify-center">
      <h1 className="font-display text-4xl text-primary">Landing</h1>
    </section>
  )
}
```
- `min-h-screen` so each section is tall enough to make the active-highlight observable during scroll.
- Use `font-display` (Space Grotesk) for headings per Design System §3 — map it in Tailwind `fontFamily`.
- Stubs are placeholders only — do **not** add final content (that belongs to phases 3–8).

## Technical constraints

- **Accessibility is non-negotiable** (Rules §8 / Design System §7):
  - All nav links reachable via Tab in DOM order.
  - Visible `:focus-visible` outline in `#5B8FFF`.
  - `prefers-reduced-motion`: disable `scroll-behavior: smooth` — wrap that declaration in `@media (prefers-reduced-motion: no-preference)`.
  - Touch targets ≥44×44px on mobile.
- **Desktop-first, responsive** (Rules §7): nav must look right at desktop widths and remain usable at 375px.
- **English only** for all strings (Rules §6).
- **No new dependencies** (Rules §15) — rely on Tailwind, Lucide React, and the IntersectionObserver browser API.
- **No comments unless short and necessary** (Rules §5).
- **No commit / push** (Rules §17).

## Acceptance criteria (DoD)

- [ ] Nav is fixed and visible across the full scroll of the page.
- [ ] Clicking each of the 6 links smooth-scrolls to the matching section.
- [ ] The active link is highlighted as its section enters view (verified by scrolling through all six).
- [ ] The bottom section (`Contact`) can become active.
- [ ] Anchor jumps do not hide section content behind the fixed nav (scroll-margin-top works).
- [ ] Tabbing through the nav reaches every link in order; the focused link shows a visible `#5B8FFF` outline.
- [ ] `prefers-reduced-motion: reduce` disables smooth scroll.
- [ ] Layout is correct on desktop (≥1024px) and on a 375px mobile viewport; touch targets ≥44px.
- [ ] All six stub components exist at the paths listed above and render without errors.
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → scroll the page top to bottom → confirm each nav link highlights when its section is in view.
2. Click each nav link → confirm smooth scroll to the correct section and that content is not hidden under the nav.
3. Tab through the nav from the top of the page → confirm every link is reachable and the focus outline is visible.
4. DevTools → toggle `prefers-reduced-motion: reduce` → confirm smooth scroll is disabled (jump instead).
5. DevTools → toggle device toolbar → 375px width → confirm nav remains usable and touch targets are ≥44px.
6. `npm run build` → confirm it completes without errors.