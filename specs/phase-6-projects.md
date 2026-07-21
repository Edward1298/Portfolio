# Phase 6 — Projects Section (Stacking Cards)

Contract for the projects section — 4 featured projects presented as a stacking-cards scroll pattern: one card visible at a time, the next slides up and stacks on top as the user scrolls. Each card shows a screenshot, title, a 2–3 line story (TODO placeholder for now), and links to the repo and the live site where available.

> **Note:** This phase implements **4 projects**, overriding `masterPlan.md` resolved decision #4 (which said 5). The guide is updated in the same change as this spec (Rule 13) — see the `masterPlan.md` decision table.

---

## Objective

A pinned scroll-driven section where 4 project cards stack on top of each other as the user scrolls down. Card content (title, screenshot, story, links) is decoupled into `src/data/projects.js` so future edits don't touch component code.

Inspiration: the "Projects" section at https://motionsites.ai/?prompt=3d-jack-portfolio-hero — files/cards moving on top of each other.

## Prerequisites

- ✅ Phase 0 — Tailwind tokens, fonts.
- ✅ Phase 1 — `Projects` stub exists; nav anchor `#projects` resolves.
- ✅ Phase 2 — Global effects mounted.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/Projects/Projects.jsx` | replace stub | Scroll-pinned stacking container |
| `src/components/Projects/ProjectCard/ProjectCard.jsx` | create | Single card (sub-component, Architecture §4) |
| `src/components/Projects/Projects.css` | create (optional) | Pin/stacking helpers if Tailwind isn't enough |
| `src/data/projects.js` | create | Array of 4 project objects |
| `src/assets/images/wedding-invate.png` | copy from `Images/Projects/WeddingInvate.png` | Screenshot for VyN-Wedding-Invate **and** Portfolio placeholder |
| `src/assets/images/budget-api.png` | copy from `Images/Projects/BudgetAPI.png` | Screenshot for BudgetPilot-API |
| `src/assets/images/migolazo.png` | copy from `Images/Projects/MiGolazo.png` | Screenshot for MiGolazo |

> Architecture governance: all paths mapped in `Architecture.md` §3-4 — no guide update needed. Portfolio reuses `wedding-invate.png` (no extra file).

## Projects (locked, 4)

| # | Title | repo | live | screenshot | live badge |
|---|---|---|---|---|---|
| 1 | VyN-Wedding-Invate | `https://github.com/Edward1298/V-N-Wedding-Invate` | `https://v-n-wedding-invate.vercel.app/` | wedding-invate.png | Live |
| 2 | BudgetPilot-API | `https://github.com/Edward1298/BudgetPilot-API` | — (Docker, local only) | budget-api.png | "Local (Docker)" badge |
| 3 | MiGolazo | `https://github.com/Edward1298/golazo` | `https://www.migolazo.com/` | migolazo.png | Live |
| 4 | Portfolio | `https://github.com/Edward1298/Portfolio` | To be hosted | wedding-invate.png (placeholder) | "Coming soon" badge |

Order is the visual order in the stack — first card is the topmost project.

Each project object in `data/projects.js`:
```js
{
  title,
  repo,
  live,           // URL or null
  liveBadge,      // "Live" | "Local (Docker)" | "Coming soon"
  screenshot,     // imported asset URL
  story,          // TODO placeholder (see below)
}
```

**Story field:** set `story: "TODO: 2–3 line story (problem → solution → result)"` for every project. To be filled in with real copy during implementation (per user decision).

## Tasks

### 6.1 `ProjectCard.jsx` — single card
- Screenshot at the top: `<img src={screenshot} alt={title} class="aspect-video w-full object-cover rounded-lg" />`.
- Title (`font-display`, `text-primary`).
- Story paragraph (`text-secondary`, body weight, 2–3 lines).
- Links row using Lucide icons:
  - `Github` icon + "Code" label → `repo` URL, `target="_blank" rel="noopener noreferrer"`.
  - If `live` is set: `ExternalLink` icon + "Live" → `live` URL, same target/rel.
  - If `live` is null: badge (`text-secondary`, `font-mono`) showing `liveBadge` ("Local (Docker)" or "Coming soon").
- Card shell: `bg-surface`, `border-subtle`, `rounded-lg`, `shadow-card`, `overflow-hidden` (per Design System §6).
- Section heading "Projects" is an `<h2>` rendered by `Projects.jsx`, not the card.

### 6.2 Stacking scroll (Framer Motion)
- Pin the section: it tall enough to scroll through, with cards positioned sticky/absolute.
- Use Framer Motion `useScroll({ target: containerRef, offset: ["start start", "end end"] })` + `useTransform` to drive each card's `y`, `scale`, `opacity`:
  - As scroll progresses, card N+1 slides up from below and scales to 1 over card N; card N simultaneously scales down slightly and dims (`opacity-70`) to feel "stacked under".
  - Final state: all 4 cards visible, slightly offset, the last one fully on top.
- Choose transforms that feel smooth on a typical desktop. Document the chosen math in a one-line comment.

### 6.3 Fallback (no GSAP)
- If Framer Motion's pinning is imprecise or janky, **fall back to a simple vertical stacked-cards list** — cards stack statically in a vertical column; Framer Motion `whileInView` fades/scales each card as it enters view. No motion-driven stacking, no pinning.
- **Do not add GSAP** — it is not in the locked stack (Rules §15). This overrides `masterPlan.md` 6.3's "swap to GSAP ScrollTrigger" suggestion.
- Document the chosen approach (stacking-pin or static-fallback) in a one-line comment in `Projects.jsx`.

### 6.4 Decoupled data
- All content comes from `src/data/projects.js`. `Projects.jsx` imports the array and maps `ProjectCard` over it. No hardcoded titles/URLs inside the component.

### 6.5 Screenshot assets
- Copy the three screenshot PNGs into `src/assets/images/` with kebab-case names (see Files table). Portfolio reuses `wedding-invate.png` (placeholder until a real Portfolio screenshot exists).
- Import them in `data/projects.js`: `import weddingInvate from '../assets/images/wedding-invate.png'` and assign `screenshot: weddingInvate`.

### 6.6 Mobile behavior
- At <768px, if pinned stacking fights touch scroll, fall back to a plain vertical 1-card-per-row list — cards stack normally, scroll reveals each one (masterPlan 6.6).
- Use `useMediaQuery('(min-width: 768px)')` to switch behaviors.

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - Every link is a real `<a>` with `href`, reachable via Tab, with the global `#5B8FFF` focus outline.
  - External links use `target="_blank" rel="noopener noreferrer"`.
  - Screenshot `<img>` has descriptive `alt` = project title.
  - `prefers-reduced-motion: reduce` → disables all stacking transforms; cards render as a static vertical list (no slide/scale/opacity animation).
  - Section heading is an `<h2>` for in-page navigation.
- **Desktop-first, responsive (Rules §7):** stacking at desktop, vertical list at <768px.
- **English only (Rules §6)** for all strings.
- **No new dependencies (Rules §15)** — Framer Motion already locked. No GSAP.
- **No comments unless short and necessary (Rules §5).**
- **No commit / push (Rules §17).**
- **Guide sync (Rule 13):** update `masterPlan.md` resolved decision #4 from "5 projects" to "4 projects" in the same change as this spec.

## Acceptance criteria (DoD)

- [ ] 4 project cards render in the order: VyN-Wedding-Invate → BudgetPilot-API → MiGolazo → Portfolio.
- [ ] Each card shows its screenshot, title, story (TODO placeholder for now), and links row.
- [ ] GitHub link opens the correct repo in a new tab for each project.
- [ ] VyN-Wedding-Invate and MiGolazo cards have a working "Live" link to the correct URLs.
- [ ] BudgetPilot-API card shows a "Local (Docker)" badge instead of a live link.
- [ ] Portfolio card shows a "Coming soon" badge and reuses `wedding-invate.png` as its placeholder screenshot.
- [ ] At ≥768px the cards stack on scroll (or static fallback, documented) using Framer Motion.
- [ ] At <768px the section falls back to a vertical 1-card-per-row list.
- [ ] All links are Tab-reachable with visible `#5B8FFF` focus outline.
- [ ] `prefers-reduced-motion: reduce` → cards render as a static list with no slide/scale/opacity animation.
- [ ] All content is read from `src/data/projects.js` (no hardcoded strings in components).
- [ ] `masterPlan.md` decision #4 is updated to "4 projects" (synced in the same change).
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → scroll to the Projects section → confirm 4 cards render in the correct order with the right titles, screenshots, and links.
2. On desktop (≥1024px) → scroll through the section → confirm cards stack on top of each other (or fallback list, whichever was chosen — confirm it's smooth).
3. Click each card's GitHub link → confirm it opens the correct repo (`Edward1298/V-N-Wedding-Invate`, `Edward1298/BudgetPilot-API`, `Edward1298/golazo`, `Edward1298/Portfolio`) in a new tab.
4. Click the Live link on VyN-Wedding-Invate → opens `https://v-n-wedding-invate.vercel.app/`.
5. Click the Live link on MiGolazo → opens `https://www.migolazo.com/`.
6. Confirm BudgetPilot-API shows a "Local (Docker)" badge (no live link).
7. Confirm Portfolio shows a "Coming soon" badge with `wedding-invate.png` as its screenshot.
8. Tab through the section → confirm every link is reachable in order with a visible focus outline.
9. DevTools → toggle `prefers-reduced-motion: reduce` → reload → confirm cards render as a static vertical list, no stacking animation.
10. DevTools → device toolbar → 375px width → confirm the mobile vertical fallback works and nothing overflows.
11. `npm run build` → confirm it completes without errors.
12. `git diff masterPlan.md` → confirm decision #4 updated from 5 → 4.