# Phase 2 — Global Effects (Background & Cursor)

Contract for the global effects phase. Adds the lightning canvas background (active across all sections) and the cursor spark trail, both lazy-initialized, with `prefers-reduced-motion` fallback and mobile throttle. The lightning algorithm is adapted from the provided `Lightning.jsx` reference.

---

## Objective

A reusable `LightningBackground` component rendering small electric-blue bolts on a fixed full-screen canvas hidden behind all content, plus a `CursorSparkTrail` component that follows the cursor with `#5B8FFF` sparks. Both must:
- lazy-init (don't burn CPU until needed),
- respect `prefers-reduced-motion` (disable entirely),
- throttle or disable on mobile (<768px) for the canvas,
- clean up all `requestAnimationFrame` loops, listeners, and the canvas on unmount,
- keep the page fully usable if either effect fails.

## Prerequisites

- ✅ Phase 0 complete.
- ✅ Phase 1 complete — `App.jsx` renders `Landing`, sections have `id`s, `useInView.js` exists.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/LightningBackground/LightningBackground.jsx` | create | Lightning canvas, fixed behind all content |
| `src/components/LightningBackground/LightningBackground.css` | create (optional) | Only if inline styles aren't enough |
| `src/components/CursorSparkTrail/CursorSparkTrail.jsx` | create | Spark trail following the cursor |
| `src/components/CursorSparkTrail/CursorSparkTrail.css` | create (optional) | Only if inline styles aren't enough |
| `src/hooks/usePrefersReducedMotion.js` | create | Returns boolean for the media query |
| `src/hooks/useMediaQuery.js` | create | Generic `useMediaQuery(query)` hook |
| `src/App.jsx` | edit | Mount `LightningBackground` (behind content) and `CursorSparkTrail` (above content) |

> Architecture governance: all paths above are already mapped in `Architecture.md` §3-4 — no guide update needed for Phase 2.

## Tasks

### 2.1 Lightning canvas — `LightningBackground.jsx`

Adapt the provided `Lightning.jsx` reference (`C:\Users\Admin\Downloads\Lightning.jsx`) to the master plan constraints. Preserve the algorithm's spirit but tune the parameters below.

**Keep from the reference:**
- `buildBolt(x1,y1,x2,y2,roughness,depth)` recursive midpoint-displacement: offset midpoint by `±roughness` on x, `±roughness*0.3` on y; recurse with `roughness /= 1.8`.
- `createStrike` builds a main bolt plus 1–2 branches off mid-segments (branch `roughness=40`).
- Two-pass stroke per bolt: a wide **glow pass** (`shadowBlur`, accent stroke) followed by a narrow **white core** (`rgba(210,230,255,...)`).
- Strike lifecycle: `born` timestamp → fade in over first 10% of duration, fade out for the remaining 90%; total duration ~450ms.
- New strike spawn interval randomized between 1400–4000ms.
- `window` `resize` listener resizes the canvas to full viewport.

**Apply master plan 2.1 overrides:**
- Main bolt **depth = 5** (reference uses 7 — reduce per `masterPlan.md` 2.1). Branch depth = 4.
- **2–3 simultaneous bolts** at any time (reference naturally spawns over time; keep the list of active strikes and don't exceed 3).
- `shadowBlur` **on** (reference already uses 20 for glow and 5 for core — keep).
- Accent color `#5B8FFF` → use `rgb(91, 143, 255)` in the stroke (reference already uses this via `ACCENT = '91, 143, 255'`).
- Canvas is `position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.5` — exactly like the reference inline style. Content above must have a higher `z-index`.

### 2.2 Lazy-init via IntersectionObserver on Landing
- Do **not** start the `requestAnimationFrame` loop on mount.
- Use `useInView` (from Phase 1) observing the `#landing` section (or accept a `targetRef`).
- When `#landing` enters the viewport, start the loop. When it leaves **and** no strike is alive, pause the loop (or stop spawning but let current strikes finish).
- Rationale (Rules §14): the lightning stays active across all sections per masterPlan 2.7, but we avoid running it before the user has scrolled into the page — saves CPU on initial load.

### 2.3 `prefers-reduced-motion` disables the canvas entirely
- Use `usePrefersReducedMotion`. If true, **do not create the canvas / start the loop** — render nothing.
- Page must remain usable and readable (it already has a solid `#0A0C12` background from Phase 0/1).

### 2.4 Mobile throttle — below 768px
- Use `useMediaQuery('(min-width: 768px)')`. Below 768px:
  - Reduce bolt count cap to **1** simultaneous strike (instead of 3), **or** disable the canvas — choose whichever keeps the page smoother on mobile. Document the choice in a one-line comment.
  - Optionally lower `shadowBlur` to save fill rate.
- Rationale (Design System §8): `md` (768px) is the canvas throttle point.

### 2.5 Cursor spark trail — `CursorSparkTrail.jsx`
- Render sparks at the cursor's last positions, in the `#5B8FFF` accent.
- **Lazy-init**: do not attach the pointer listener or start the animation loop until the user's first `pointerdown` / `pointermove` after page load (masterPlan 2.5).
- Each spark fades out and is removed after a short lifetime (~300–500ms); keep an array of active sparks much like the lightning strikes array.
- Render on a separate fixed canvas (or a small set of absolutely-positioned divs) with `pointer-events: none`, `z-index` above the lightning background but below modal content.
- Use `requestAnimationFrame` for the loop.

### 2.6 Cleanup
- On unmount of either component, cancel all `requestAnimationFrame` handles and remove all `resize` / `pointermove` / `pointerdown` listeners.
- The canvas elements are removed from the DOM on unmount (React handles this via the ref'd `<canvas>`).

### 2.7 Lightning stays active across all sections
- `LightningBackground` is mounted once in `App.jsx`, outside the section list, so it persists across the whole scroll. It is **not** scoped to the Landing section — only its **init** is gated on Landing visibility (per 2.2).

## Hooks specs

### `usePrefersReducedMotion.js`
```js
export function usePrefersReducedMotion() {
  // returns true if prefers-reduced-motion: reduce
  // uses matchMedia + resize/ChangeEvent listener
}
```
- Flat file, no folder-per-hook (Architecture §3).

### `useMediaQuery.js`
```js
export function useMediaQuery(query) {
  // returns boolean for the given media query string
  // updates on change
}
```
- Keep generic so other components can reuse it (e.g. Projects mobile fallback in Phase 6).

## `App.jsx` changes

- Mount `<LightningBackground />` as the **first** child (z-index 0, fixed).
- Mount `<CursorSparkTrail />` after the sections so it sits above content in DOM order but its own canvas controls the stacking via `z-index`.
- Wrap both in an error boundary or simple `try/catch` guard so an effect failure never breaks the page (Rules §8 — page must remain usable if any effect fails).

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - Both effects must be **fully disabled** when `prefers-reduced-motion: reduce` — not just slowed.
  - Page content background must remain `#0A0C12` and text readable with no effects active.
  - Canvas elements must have `pointer-events: none` so they never block interaction.
- **Performance (Rules §14):**
  - No `setInterval`; use `requestAnimationFrame`.
  - Cap active strikes and sparks; never grow arrays unbounded.
  - Pause the lightning loop when the page is hidden (`visibilitychange`) — optional but recommended.
- **Mobile-first responsiveness (Rules §7):** throttle per 2.4.
- **English only** (Rules §6), **no new deps** (Rules §15), **no commit/push** (Rules §17).
- **No comments unless short and necessary** (Rules §5).

## Acceptance criteria (DoD)

- [ ] Lightning bolts are visible across **all** sections (scroll top to bottom — bolts keep appearing).
- [ ] Canvas does not start rendering until `#landing` is in view on initial load.
- [ ] With `prefers-reduced-motion: reduce`, **no** lightning and **no** cursor trail render (verify in DevTools).
- [ ] At viewport width <768px, the canvas is throttled (1 bolt max) or disabled — verify no frame drops.
- [ ] Cursor trail appears only after the first pointer interaction, in `#5B8FFF`.
- [ ] Spark trail fades out within ~500ms and never leaves stale sparks.
- [ ] Inspecting memory / listeners: no `requestAnimationFrame` handles or `pointermove` listeners remain after unmounting both components.
- [ ] Page remains fully usable if the canvas effect throws (content scrollable, nav reachable, forms usable).
- [ ] Both canvases have `pointer-events: none` — they never block clicks on nav, links, or form fields.
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → load the page → confirm the canvas starts only after scrolling `#landing` into view (DevTools Performance → watch frames start later, not on load).
2. Scroll through all six sections → confirm bolts appear at every scroll position (active across sections).
3. DevTools → toggle `prefers-reduced-motion: reduce` → reload → confirm no canvas, no trail, page content still readable.
4. DevTools → toggle device toolbar → 375px width → scroll → confirm no frame drops and bolts are throttled/disabled.
5. Move the mouse before any click → no trail. Click or move after `pointerdown` → trail appears in `#5B8FFF` and fades.
6. Unmount both components (e.g. via a temporary dev toggle or by navigating away in a future phase) → confirm `getAnimationFrame` handles and listeners are removed (DevTools → Memory or Elements panel).
7. Temporarily throw an error inside `LightningBackground` → confirm nav, scroll, and section content still work.
8. `npm run build` → confirm it completes without errors.