# Phase 9 — Performance & Polish

Contract for the final polish phase — no new features, only optimization and cross-cutting QA. Lazy-load the heavy sections, verify every `prefers-reduced-motion` path, test mobile, run Lighthouse, and pass a final cross-section QA checklist.

---

## Objective

Take the full single-page site (phases 0–8) and make it ship-quality: fast first load, smooth on every device, accessible on every reduced-motion path, and free of console errors. No new components, no new content, no new dependencies.

## Prerequisites

- ✅ Phases 0 through 8 — all sections implemented and functional.

## Files to modify

| Path | Action | Purpose |
|---|---|---|
| `src/App.jsx` | edit | Wrap heavy sections in `React.lazy` + `Suspense` |
| `src/components/Nav/Nav.jsx` | verify | Active-section logic still resolves after lazy mounts |
| `src/index.css` | verify | `prefers-reduced-motion` global fallbacks |
| Other component files | touch-ups only | Fix issues surfaced by Lighthouse / mobile QA |

> No new files. No Architecture.md / masterPlan.md update needed.

## Tasks

### 9.1 Per-section lazy-loading
- Use `React.lazy` + `Suspense` to code-split the **three heaviest** sections:
  - `SkillsKeyboard` (Howler + audio preload)
  - `Projects` (stacking scroll + multiple screenshots)
  - `Certifications` (multiple credential images)
- Keep these **eager** (do not lazy-load):
  - `Landing` — above the fold, must render immediately.
  - `About` — light, no reason to split.
  - `Contact` — critical for the user; form should always be available.
- `<Suspense fallback={<div className="min-h-screen" />}>` — a minimal placeholder that preserves layout height so the active-section IntersectionObserver stays accurate. Don't use a flashy spinner as the fallback — it would flicker during scroll.
- Verify that lazy sections still expose their `id`-bearing `<section>` so nav anchor links resolve and the active-highlight still works after the section mounts.

### 9.2 Test all `prefers-reduced-motion` paths
Manually verify each effect renders safe / static when the user prefers reduced motion:
- [ ] `LightningBackground` — canvas does not render (Phase 2).
- [ ] `CursorSparkTrail` — trail does not render (Phase 2).
- [ ] `Nav` smooth-scroll — disabled (jumps instead) (Phase 1).
- [ ] `Landing` entrance — instant, no transform (Phase 3).
- [ ] `About` timeline reveals — entries appear instantly (Phase 4).
- [ ] `SkillsKeyboard` — no entrance stagger, no 3D translate on press (color/opacity change only) (Phase 5).
- [ ] `Projects` — static vertical list, no stacking/scale/opacity animation (Phase 6).
- [ ] `Certifications` — carousel snaps instantly, no card transitions (Phase 7).
- [ ] `Contact` — status messages swap instantly, no fade; spinner non-animated or replaced by text (Phase 8).

### 9.3 Mobile QA (target: 375px width)
Walk the entire page at 375px and confirm:
- [ ] Nav usable, links ≤ full row, ≥44×44px touch targets.
- [ ] Lightning canvas throttled or disabled, no frame drops.
- [ ] Cursor trail appears after first interaction.
- [ ] Skills grid collapses to 3 columns, keys ≥44px.
- [ ] Projects falls back to a vertical 1-card-per-row list (no pin fight).
- [ ] Certifications carousel swipeable via native scroll-snap.
- [ ] Contact form is a single-column stack; submit button ≥44px tall.
- [ ] No horizontal overflow anywhere; no clipped text.

### 9.4 Lighthouse audit
Run Lighthouse on desktop (default mode) and target all four categories **≥90**:
- Performance ≥90 (Rules §14 — performance budget).
- Accessibility ≥90 (Rules §8 — accessibility non-negotiable).
- Best Practices ≥90.
- SEO ≥90.

Address the **top issues** Lighthouse surfaces, in priority order. Common ones likely to apply:
- Largest Contentful Paint — ensure fonts preconnect + display swap (Phase 0); consider inlining critical CSS for the Landing.
- Unused JS — confirm `React.lazy` actually splits the bundles (inspect the `dist/` chunks).
- Color contrast — verify `text-secondary` (`#9AA3B2`) on `#0A0C12` / `#12151C` passes AA (Design System §7).
- Missing `alt` — every `<img>` has descriptive alt (Phases 5/6/7 already require this — audit confirms).
- Missing meta — `lang="en"`, meta description, `<title>` set (Phase 0).
- Touch targets — confirm ≥44×44px on all interactive elements at mobile.

Re-run Lighthouse after fixes until all four thresholds are met. Document the final scores in a one-line comment in `App.jsx` (e.g. `// Lighthouse v12: Perf 94, A11y 100, BP 100, SEO 100`).

### 9.5 Final QA checklist
Cross-cutting verification:
- [ ] All 6 nav anchors resolve and smooth-scroll to the right section (Landing, About, Skills, Projects, Certifications, Contact).
- [ ] Active-highlight updates correctly through **every** section, including the bottom `Contact` (Phase 1 requirement).
- [ ] CV download link downloads `cv.pdf` (Phase 3).
- [ ] All external links (GitHub, LinkedIn, project repos, project live sites) open in a new tab with `rel="noopener noreferrer"`.
- [ ] All Lucide icon-only links have `aria-label`s (Phases 3/6/7 already require this — audit confirms).
- [ ] `<html lang="en">`, meta description, and a meaningful `<title>` are set.
- [ ] `.env` is gitignored; `VITE_FORMSPREE_ID` placeholder is present; no real form ID or recipient email is committed.
- [ ] No console errors or warnings anywhere across a full top-to-bottom scroll in `npm run dev`.
- [ ] `npm run build` completes without warnings or errors.
- [ ] No artifacts in the repo that shouldn't be there (`node_modules/`, `dist/`, real `.env`).

## Technical constraints

- **No new dependencies (Rules §15):** if a Lighthouse fix seems to need a new lib, ask the user first — don't install silently.
- **No new files (masterPlan 9.1-9.5 are all edits/verification, not new structure).** If a fix genuinely needs a new file, update `Architecture.md` in the same change (Governance Protocol, Architecture §6).
- **Accessibility is non-negotiable (Rules §8):** every reduced-motion path must work; nothing regresses.
- **Performance budget (Rules §14):** lazy-init heavy effects, lazy-load heavy sections, don't regress the Lighthouse score.
- **English only (Rules §6).**
- **No comments unless short and necessary (Rules §5)** — the Lighthouse scores comment in `App.jsx` is the exception, explicitly required here.
- **No commit / push (Rules §17).**

## Acceptance criteria (DoD)

- [ ] `SkillsKeyboard`, `Projects`, and `Certifications` are loaded via `React.lazy` + `Suspense`. The other three sections stay eager.
- [ ] The `Suspense` fallback preserves layout so the active-section IntersectionObserver still works.
- [ ] Nav anchor links still resolve to lazy sections, and active-highlight updates correctly across all six sections.
- [ ] Every `prefers-reduced-motion` path in §9.2 is verified safe/static.
- [ ] The site passes mobile QA at 375px per §9.3 — no overflows, touch targets ≥44px.
- [ ] Lighthouse desktop scores: Performance ≥90, Accessibility ≥90, Best Practices ≥90, SEO ≥90.
- [ ] Lighthouse scores are recorded in a one-line comment in `App.jsx`.
- [ ] Every item in the §9.5 final QA checklist passes.
- [ ] `npm run dev` shows no console errors across a full scroll.
- [ ] `npm run build` completes without warnings or errors.

## Verification

1. `npm run build` → inspect `dist/assets/` → confirm 3+ JS chunks exist (proves `React.lazy` actually code-split the lazy sections).
2. `npm run dev` → open the app → confirm Landing, About, and Contact render immediately (eager) and the others load on scroll/interaction (lazy).
3. Open DevTools → Network → reload → confirm chunks for Skills/Projects/Certifications load later than the initial bundle.
4. Tab through the entire page top to bottom → confirm the active nav link updates for every section, including `Contact` at the bottom.
5. DevTools → toggle `prefers-reduced-motion: reduce` → reload → walk the entire page → confirm every animation/effect is disabled per the §9.2 checklist.
6. DevTools → device toolbar → 375px width → walk the entire page → confirm every item in §9.3 passes (no overflows, touch targets, fallbacks).
7. DevTools → Lighthouse → run desktop audit → confirm all four scores ≥90. Paste the scores into the `App.jsx` comment.
8. Open every external link on the page → confirm each opens in a new tab to the correct destination with `noopener`.
9. Open the CV download link → confirm `cv.pdf` downloads.
10. `git status` → confirm `.env` is not staged; no real Formspree ID or recipient email is in the diff.
11. Final scroll in `npm run dev` → DevTools console → confirm zero errors and zero warnings.