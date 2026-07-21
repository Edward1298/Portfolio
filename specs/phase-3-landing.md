# Phase 3 — Landing Section

Contract for the landing section — the first impression of the portfolio. A full-viewport hero introducing Eduardo Céspedes with a role-based tagline and three action links (GitHub, LinkedIn, CV download). Subtle Framer Motion entrance, lightweight: no images, no heavy content.

---

## Objective

A full-viewport hero that introduces the owner by name and role, gives recruiters three immediate actions (GitHub, LinkedIn, CV download), and animates in subtly on load. The hero sits above the lightning background from Phase 2 and sets the visual tone for the rest of the page.

## Prerequisites

- ✅ Phase 0 — Tailwind tokens configured, fonts loaded.
- ✅ Phase 1 — `Landing` stub component exists at `src/components/Landing/Landing.jsx`; nav anchor `#landing` resolves.
- ✅ Phase 2 — `LightningBackground` is mounted in `App.jsx` (the hero sits above it).

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `public/cv.pdf` | create (copy from `CV/CV-EN-Eduardo Céspedes.pdf`) | Served as the CV download target |
| `src/components/Landing/Landing.jsx` | replace stub | Hero content |
| `src/components/Landing/Landing.css` | create (optional) | Only if Tailwind isn't enough |

> Architecture governance: `public/cv.pdf` is already mapped in `Architecture.md` §2; `Landing/` is mapped in §4 — no guide update needed for Phase 3.

## Tasks

### 3.0 Copy the CV file into `public/`
- Source: `D:\Carpetas\Edward\Proyectos\Portfolio\CV\CV-EN-Eduardo Céspedes.pdf`.
- Destination: `public/cv.pdf` (rename to `cv.pdf` so the download link is clean and stable).
- The download link will point to `/cv.pdf` (Vite serves `public/` at root).
- Do **not** commit secrets — this is a public CV, safe to commit.

### 3.1 Hero layout
- Full-viewport section: `min-h-screen`, content centered both axes (`flex items-center justify-center`).
- Sits above the lightning canvas: `relative z-10` (lightning is `z-0` from Phase 2).
- Heading uses `font-display` (Space Grotesk), `text-primary`, large size (e.g. `text-6xl` desktop, scale down aggressively on mobile per Design System §3 — `text-4xl` at `sm`).
- Tagline uses `font-sans` (Inter), `text-secondary`, body weight, one line.

### 3.2 Identity content
- **Name:** Eduardo Céspedes
- **Tagline (role-based, one line):** Software Developer & DevOps Engineer

### 3.3 Social links row
Three links rendered horizontally, each with a Lucide React icon:
| Link | Icon | href | Target |
|---|---|---|---|
| GitHub | `Github` | `https://github.com/Edward1298` | `_blank`, `rel="noopener noreferrer"` |
| LinkedIn | `Linkedin` | `https://www.linkedin.com/in/eduardo-cespedes-osorio` | `_blank`, `rel="noopener noreferrer"` |
| CV download | `FileDown` | `/cv.pdf` | `download` attribute set |

Styling:
- Icons in `text-accent` (`#5B8FFF`), hover `text-accent-glow` + `shadow-glow-sm`.
- Touch targets ≥44×44px (padding around each icon link, Design System §7).
- Visible `:focus-visible` outline in `#5B8FFF` (already global from Phase 1, but verify).
- Wrap the row in a `<ul>` / `<nav>` for semantic structure; each link is an `<a>`.

### 3.4 Entrance animation
- Framer Motion variants:
  - Name: `fadeIn` + `slideUp` (opacity 0→1, y 20→0), duration ~0.6s.
  - Tagline: same, delay ~0.1s.
  - Links row: same, delay ~0.2s.
- Wrapper respects `prefers-reduced-motion`: if the user prefers reduced motion, render instantly with no transform/opacity change.
- Use `usePrefersReducedMotion` (from Phase 2) to short-circuit the animation.

### 3.5 Lightweight
- No images, no audio, no canvas — reuses the global `LightningBackground` from Phase 2.
- No new dependencies.

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - All three links reachable via Tab; visible `#5B8FFF` focus outline.
  - Touch targets ≥44×44px on mobile.
  - `prefers-reduced-motion: reduce` → entrance renders instantly (no movement).
  - Icons must have accessible names (aria-label or visually-hidden text), since icons alone aren't descriptive enough for screen readers — e.g. `aria-label="GitHub profile"`.
- **Desktop-first, responsive (Rules §7):** hero looks right at ≥1024px; remains readable at 375px.
- **English only** (Rules §6) — all visible strings in English.
- **No new dependencies** (Rules §15) — Framer Motion and Lucide React are already in the stack.
- **No comments unless short and necessary** (Rules §5).
- **No commit / push** (Rules §17).

## Acceptance criteria (DoD)

- [ ] Hero is full-viewport and centered; name in Space Grotesk, tagline in Inter below it.
- [ ] Name displays "Eduardo Céspedes"; tagline displays "Software Developer & DevOps Engineer".
- [ ] Three links render with Lucide icons (Github, Linkedin, FileDown).
- [ ] GitHub link opens `https://github.com/Edward1298` in a new tab.
- [ ] LinkedIn link opens `https://www.linkedin.com/in/eduardo-cespedes-osorio` in a new tab.
- [ ] CV download link triggers a download of `/cv.pdf` (file exists in `public/`).
- [ ] Entrance animation runs on load (name → tagline → links, staggered ~100ms).
- [ ] With `prefers-reduced-motion: reduce`, the hero renders instantly with no movement.
- [ ] Tab reaches each of the three links in order; focus outline is visible in `#5B8FFF`.
- [ ] Touch targets ≥44×44px at 375px viewport width.
- [ ] Hero content sits visually above the lightning canvas (z-index correct).
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → load the page → confirm the name, tagline, and three icon links render centered on a full-viewport hero over the lightning background.
2. Click the GitHub icon → new tab opens `https://github.com/Edward1298`.
3. Click the LinkedIn icon → new tab opens the LinkedIn profile URL.
4. Click the CV download icon → `cv.pdf` downloads (verify file exists at `public/cv.pdf`).
5. Reload the page → confirm the staggered entrance animation plays (name → tagline → links).
6. DevTools → toggle `prefers-reduced-motion: reduce` → reload → confirm the hero appears instantly with no animation.
7. Tab from the address bar into the page → confirm each link is reachable in order and shows a visible `#5B8FFF` focus outline.
8. DevTools → toggle device toolbar → 375px width → confirm the hero is readable, links are centered and ≥44px touch targets.
9. `npm run build` → confirm it completes without errors.