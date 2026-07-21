# Phase 4 — About Me Section

Contract for the About Me section. A short bio block (3–4 lines, professional but less formal than the CV) followed by a responsive vertical timeline with 5 points: 4 dated milestones plus a "Present" terminator at the very end of the line.

---

## Objective

A compact About Me section that introduces the owner in a human tone and shows the career path as a vertical timeline. The timeline is the structural backbone: 4 dated milestones (date + role + place, no descriptions) and a 5th "Present" marker at the very end of the rail signalling "still going".

## Prerequisites

- ✅ Phase 0 — Tailwind tokens configured, fonts loaded.
- ✅ Phase 1 — `About` stub exists at `src/components/About/About.jsx`; nav anchor `#about` resolves.
- ✅ Phase 2 — Global effects mounted.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/About/About.jsx` | replace stub | Section wrapper: bio + timeline |
| `src/components/About/About.css` | create (optional) | Timeline vertical spine styles if Tailwind isn't enough |
| `src/components/About/Timeline/Timeline.jsx` | create | Sub-component rendering the timeline rail + entries |
| `src/data/timeline.js` | create | Decoupled timeline content (flat, one file — Architecture §3) |

> Architecture governance: `About/` and `About/Timeline/Timeline.jsx` are mapped in `Architecture.md` §4; `data/timeline.js` is mapped in §3 — no guide update needed for Phase 4.

## Content (locked)

### Bio block (verbatim)

> Passionate software developer since 2020, and tech lover forever. I build things end-to-end — from APIs in C#/.NET to interfaces in React — and I genuinely enjoy the process, not just the result. I build fast with AI-assisted tools like Claude Code, and I'm always tinkering with something new.

- Render as a single paragraph (3–4 lines at desktop width).
- Do **not** paraphrase or split it — use this exact text.

### Timeline data (`src/data/timeline.js`)

Each entry has only three fields: `date`, `role`, `place`. **No description field.** Order is chronological, oldest first.

| # | date | role | place |
|---|---|---|---|
| 1 | May 2020 | Systems Engineering | Fidelitas University |
| 2 | January 2022 | Web Developer | Instituto de Estudio y Desarrollo Humano |
| 3 | June 2024 | Software Development Intern | Align Technology |
| 4 | December 2024 | Software Developer / DevOps Engineer | One Way Technologies |
| 5 | Present | — | — |

Entry 5 is a **terminator marker**: it renders only the word "Present" with no role and no place. It caps the end of the line.

## Tasks

### 4.1 Bio block
- Render the verbatim bio text above as a single paragraph.
- Typography: `font-sans` (Inter), body weight 400, `text-primary`, minimum 16px.
- Constrain width for readability (e.g. `max-w-2xl`), left-aligned.
- Position above the timeline with comfortable spacing (`space-12` between bio and timeline per Design System §4).

### 4.2 Timeline structure
- A vertical rail (left-aligned spine) running down the section.
- Each milestone has a node (dot) on the rail and content to the right of it:
  - `date` — `font-mono` (JetBrains Mono), `text-secondary`, small size (kebab-like label per Design System §3).
  - `role` — `font-display` (Space Grotesk), weight 500–600, `text-primary`.
  - `place` — `text-secondary`, body weight, just below the role.
- The 5th entry ("Present") renders only the word **"Present"** in `text-secondary`, placed at the very bottom of the rail as a terminator — no role, no place, no extra text.

### 4.3 `Timeline.jsx` sub-component
- Lives at `src/components/About/Timeline/Timeline.jsx` (nested under `About/` per Architecture §4).
- Imports the `entries` array from `@/data/timeline.js` (or relative path `../../../data/timeline.js` — no path alias unless added per Architecture §7).
- Renders a semantic `<ol>` of milestones; each milestone is an `<li>`.
- Accepts no props — content comes from the data file (keeps content decoupled per masterPlan philosophy).

### 4.4 Scroll animations
- Each timeline entry animates in via Framer Motion `whileInView`:
  - Variant: `fadeIn` + `slideUp` (opacity 0→1, y 16→0), duration ~0.5s.
  - Stagger entries as they enter: each one triggers when its own position hits the viewport (`viewport={{ once: true, amount: 0.3 }}`).
- Bio block: `whileInView` fade-in on the paragraph.
- `prefers-reduced-motion: reduce` → entries render instantly with no movement (use `usePrefersReducedMotion` from Phase 2).

### 4.5 Responsive
- Vertical on **all** sizes (masterPlan resolved decision #1 — explicitly "vertical, to keep it responsive").
- Desktop (≥1024px): rail on the left, content to the right, generous spacing (`space-8` between entries).
- Mobile (<640px): rail stays on the left but spacing tightens (`space-6` between entries), font sizes scale down (heading `text-2xl`, dates `text-xs`).
- The 5th "Present" marker stays at the very end of the rail at all sizes.

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - Timeline is a semantic `<ol>` with `<li>` children — screen readers announce it as an ordered list.
  - `prefers-reduced-motion: reduce` → all `whileInView` animations render instantly.
  - Color contrast: `text-secondary` (`#9AA3B2`) on `#0A0C12`/`#12151C` must meet the contrast targets from Design System §7.
  - Keyboard nav: no interactive elements required in the timeline (read-only), but the section heading should be a real `<h2>` for in-page navigation.
- **Desktop-first, responsive (Rules §7):** looks right at desktop widths, works at 375px.
- **English only (Rules §6)** for all strings (dates, roles, places, bio).
- **No new dependencies (Rules §15)** — Framer Motion is already in the stack.
- **No comments unless short and necessary** (Rules §5).
- **No commit / push** (Rules §17).
- **No content invented** — use exactly the bio and the 5 timeline entries above. Do not add extra entries or descriptions.

## Acceptance criteria (DoD)

- [ ] Bio block renders the exact verbatim text from this spec, as one paragraph.
- [ ] Timeline renders 5 entries in chronological order (May 2020 → Jan 2022 → Jun 2024 → Dec 2024 → Present).
- [ ] Entries 1–4 show `date` + `role` + `place` with no description.
- [ ] Entry 5 shows **only** the word "Present" — no role, no place.
- [ ] Fonts are correct: dates in JetBrains Mono, roles in Space Grotesk, places in Inter.
- [ ] Timeline is a `<ol>` with `<li>` children (semantic).
- [ ] Bio and each timeline entry animate in on scroll via `whileInView`, staggered.
- [ ] With `prefers-reduced-motion: reduce`, the bio and all timeline entries render instantly.
- [ ] Layout is vertical at all viewport sizes; spacing tightens at 375px; nothing overflows.
- [ ] Section heading is an `<h2>` with id-compatible text (e.g. "About Me").
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → scroll to the About section → confirm the bio paragraph renders with the exact text from this spec.
2. Confirm 5 timeline entries render in order, each with the correct date, role, and place (entries 1–4) and only "Present" for entry 5.
3. Scroll slowly through the timeline → confirm each entry animates in as it enters the viewport (staggered).
4. DevTools → toggle `prefers-reduced-motion: reduce` → reload → scroll → confirm the bio and all entries appear instantly with no movement.
5. DevTools → toggle device toolbar → 375px width → confirm the timeline is still vertical, spacing is tighter, nothing overflows, and "Present" still caps the end.
6. Inspect the timeline in the Elements panel → confirm it is a `<ol>` with `<li>` children.
7. Verify fonts: dates use JetBrains Mono, roles use Space Grotesk, places use Inter (Inspect → Computed → font-family).
8. `npm run build` → confirm it completes without errors.