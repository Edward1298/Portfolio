# Phase 5 — Skills Section (Interactive Keyboard)

Contract for the skills section — a mechanical keyboard where each keycap is a skill. 4 rows × 6 columns = 24 skills total. Each key has a tech logo, a CSS 3D-press effect, and plays a subtle click sound **on click only** (no hover, no mute). Scoped to this section — does not persist globally.

---

## Objective

A section-scoped interactive keyboard grid of 24 skill keycaps arranged in 4 rows of 6. Built with CSS (no Spline, no GSAP, no new deps). Each key has a tech-logo `<img>` (or styled monogram), a CSS 3D-press effect, and plays a subtle click sound **on click only**. The section adds four interaction-polish layers on top of the base keycaps (masterPlan 5.7–5.10): a cursor-follow spotlight, an on-press spark burst, a permanent board tilt, and an optional idle micro-flicker. All decorative motion is gated behind `prefers-reduced-motion: reduce` so the keyboard stays fully usable as a static grid.

## Prerequisites

- ✅ Phase 0 — Tailwind tokens configured, fonts loaded.
- ✅ Phase 1 — `SkillsKeyboard` stub exists; nav anchor `#skills` resolves.
- ✅ Phase 2 — Global effects mounted.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/SkillsKeyboard/SkillsKeyboard.jsx` | replace stub | Keyboard grid wrapper |
| `src/components/SkillsKeyboard/SkillKey/SkillKey.jsx` | create | Single keycap (sub-component, Architecture §4) |
| `src/components/SkillsKeyboard/SkillsKeyboard.css` | create (optional) | 3D-press helpers if Tailwind isn't enough |
| `src/data/skills.js` | create | 24 skills with `name`, `icon`, `row` |
| `src/assets/sounds/key-press.mp3` | (TODO — provide later) | Howler audio clip |

> Architecture governance: all paths mapped in `Architecture.md` §3-4 — no guide update needed.

## Skills layout (24 total, locked)

| Row | Skills |
|---|---|
| 1 | C#, .NET, SQL, Entity Framework, JWT, Azure |
| 2 | React, JavaScript, HTML, CSS, Vite, React Router |
| 3 | Framer Motion, Git, GitHub, Docker, AWS, Php |
| 4 | OpenCode, Claude Code, Vercel, Supabase, VSCode, PowerBI |

Each entry in `data/skills.js` has: `{ name, icon, row, monogram? }`. Order inside a row is left-to-right as listed above.

## Icon strategy (Devicon + SimpleIcons CDN, no install)

Each skill stores an `icon` URL in `data/skills.js`. Source priority:
1. **Devicon CDN** — `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<slug>/<slug>-original.svg` (covers React, JavaScript, HTML, CSS, Vite, Docker, AWS, Git, GitHub, Php, VSCode, Framer Motion, etc.).
2. **SimpleIcons CDN** — fall back to `https://cdn.simpleicons.org/<slug>` for the rest (Vercel, Supabase, PowerBI, Azure, etc.).
3. **Styled monogram keycap** — for skills absent from both CDNs (Entity Framework, JWT, OpenCode, Claude Code, React Router): set `icon: null` and `monogram: "EF"` (or similar 1-3 letter glyph) so `SkillKey` renders a short text glyph in `font-mono` + `text-accent` instead of an `<img>`.

Each `<img>` must have `alt` text equal to the skill name (Design System §7 — accessible images).

## Tasks

### 5.1 `SkillKey.jsx` — single keycap
- Render a real `<button>` element (focusable, keyboard-activatable).
- Default state: `bg-surface` top face, `shadow-pressed` base depth, `border-subtle` edge, `rounded-lg` per Design System §5/§6.
- Pressed state: Tailwind `active:translate-y-0.5` + `active:shadow-pressed` (inset shadow) to simulate the keycap sinking into the board.
- Content: skill icon `<img>` centered (when `icon` set) **or** monogram text in `font-mono text-accent` (when `monogram` set), with the skill label below in `text-secondary font-mono text-xs`.
- Min size ≥44×44px (Design System §7).

### 5.2 `SkillsKeyboard.jsx` — keyboard grid
- CSS grid: `grid-cols-6` at desktop (≥1024px), collapses to `grid-cols-4` at ≥768px and `grid-cols-3` at <768px so keys stay tappable on mobile.
- Renders one `SkillKey` per entry in `data/skills.js`, in the order listed above.
- Section-scoped: keyboard is rendered only inside the `#skills` section (masterPlan 5.5 — no global persistence).
- Container heading: `<h2>` reading "Skills" for in-page navigation.

### 5.3 Sound — Howler.js, click only
- Preload `key-press.mp3` once at component scope with `new Howl({ src: [keyPressUrl], preload: true })` where `keyPressUrl` is the imported asset path (`import keyPressUrl from '../assets/sounds/key-press.mp3'`).
- Play the clip **only on click** (`onClick` → `howl.play()`). No hover sound, no mute control (masterPlan 5.3-5.4).
- **TODO (clip not provided yet):** the user must add `src/assets/sounds/key-press.mp3`. Until then, the import will fail silently or Howler will log a warning and clicks stay silent — the UI must remain fully usable.

### 5.4 Entrance animation
- Framer Motion staggered reveal: keys fade+rise row by row using `whileInView` with `viewport={{ once: true, amount: 0.2 }}`. Each row delays ~80ms after the previous; keys within a row stagger ~30ms.
- `prefers-reduced-motion: reduce` → all keys render instantly (no transform/opacity), via `usePrefersReducedMotion`.

### 5.5 Cursor-follow spotlight
- A single radial glow (soft, large `blur` radius, `#5B8FFF` at low alpha) overlaid on the **whole board**, not per-key. It tracks the mouse position via a `mousemove` handler on the board wrapper that updates a CSS `--spotlight-x` / `--spotlight-y` custom property (or a transformed `<div>`) — no per-key listeners.
- Fades **in on `mouseenter`** of the board, **out on `mouseleave`**. Use a CSS `transition: opacity` (~200ms) on the spotlight layer, not a JS toggle loop.
- Scoped to the `#skills` section only; the spotlight layer is clipped to the board wrapper (`overflow: hidden` or `border-radius`-bounded) so it never leaks outside the keyboard.
- `prefers-reduced-motion: reduce` → spotlight movement disabled; either render the layer static at the board's center with no mouse tracking, or omit it entirely. Keyboard must remain fully usable.

### 5.6 On-press spark burst
- On **click / `keydown` (Enter or Space)** of a key, emit a small burst (~8–12 short-lived particle elements) radiating outward from the pressed key's center and fading under **~400ms**.
- Colors reuse existing design-system tokens only — `text-accent` (`#5B8FFF`), `text-accent-glow` (`#7BA3FF`), `text-highlight` (`#D2E6FF` / bolt core). No new palette entries.
- Implement with a transient React state array of particles + CSS `transform`/`opacity` transitions, or a keyed Framer Motion `AnimatePresence`. Clean up particles after the animation completes (no DOM accumulation).
- **Never on hover** — only on an actual press (mouse click or keyboard activation). Co-exists with the 3D-press effect and the Howler click sound from 5.3.
- `prefers-reduced-motion: reduce` → spark burst skipped entirely; the press still triggers the 3D-press color/opacity change and (if available) the sound.

### 5.7 Permanent board tilt
- Apply a fixed **whole-board** 3D perspective via CSS on the keyboard grid wrapper: `perspective: ~1000px` on the parent and `transform: rotateX(<a few deg>)` (e.g. 6–10°) on the grid. The tilt is constant, not driven by scroll or mouse — it just suggests depth.
- Distinct from each key's individual 3D-press (5.1): the tilt is on the board wrapper, press is on the `<button>`. They compose — keys still sink into the tilted board.
- Keep the tilt shallow enough that text/icons remain legible and the grid doesn't read as a tilted photo. Verify at mobile widths that the tilt doesn't cause horizontal overflow.
- `prefers-reduced-motion: reduce` → tilt flattened (`transform: none`); the grid renders as a flat 2D grid. Keyboard remains fully usable.

### 5.8 Idle micro-flicker *(optional — not blocking DoD)*
- Every few seconds, pick a random key and run a brief, subtle flash (a soft `#5B8FFF` glow that fades in and out under ~300ms), as if distant lightning hit that key. No sound, no movement, just a one-shot opacity/box-shadow pulse.
- Must NOT interfere with user interaction: do not run the flicker on the key currently hovered or focused, and pause the timer while any key is being pressed.
- Nice-to-have — implement only if it stays a simple `setInterval` + random pick + CSS transition. If it risks complicating the component or hurting the Lighthouse score, **drop it**. It is explicitly **not** part of the Definition of Done.
- `prefers-reduced-motion: reduce` → skipped entirely (consistent with the rest of the section).

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - Every key is a real `<button>` — keyboard-reachable via Tab.
  - Enter/Space triggers the same 3D-press effect + sound as a pointer click.
  - Visible `:focus-visible` outline in `#5B8FFF` (global from Phase 1, verify here).
  - Min 44×44px touch targets on mobile.
  - `prefers-reduced-motion: reduce` → 3D translate disabled (press becomes a simple color/opacity change, no movement); entrance animation skipped. Spotlight movement, spark bursts, and the permanent board tilt **all** flatten/disable too — keyboard must remain fully usable as a static grid.
  - Icon `<img>` elements must have descriptive `alt`.
- **Interaction polish (masterPlan 5.7–5.10):**
  - **Spotlight** is hover-only (`mouseenter`/`mouseleave`), tracks the whole board via a single `mousemove` listener (no per-key listeners), scoped to `#skills`.
  - **Spark burst** is press-only (click / Enter / Space), never hover; fades under ~400ms; colors limited to existing accent/bolt-core tokens; cleans up its own DOM.
  - **Board tilt** is a constant shallow CSS `perspective` + `rotateX` (a few degrees) on the wrapper, flat under reduced-motion, must not cause horizontal overflow on mobile.
  - **Idle micro-flicker** (if implemented) must avoid the hovered/focused/pressed key and pause during a press. Non-blocking — skippable.
- **Desktop-first, responsive (Rules §7):** 6 columns at desktop, fewer on mobile.
- **English only (Rules §6)** for all strings.
- **No new dependencies (Rules §15):** Howler.js is already locked. Do **not** add Spline, GSAP, or any icon npm package — use CDN `<img>` only.
- **No comments unless short and necessary (Rules §5).**
- **No commit / push (Rules §17).**

## Acceptance criteria (DoD)

- [ ] 24 keys render in the exact order/rows from the layout table.
- [ ] Grid is 6 columns at desktop, 4 at ≥768px, 3 at <768px.
- [ ] Each key is a `<button>` ≥44×44px with a visible `#5B8FFF` focus outline on Tab.
- [ ] Pressing a key (mouse or Enter/Space) triggers the 3D-press effect.
- [ ] Sound plays only on click, not on hover.
- [ ] Icons render for CDN-covered skills; monograms render for the four unmatched skills (Entity Framework, JWT, OpenCode, Claude Code, React Router — *five, since React Router may also need monogram*).
- [ ] All icon `<img>` have `alt` text.
- [ ] Entrance animation staggers row-by-row on first scroll into view.
- [ ] `prefers-reduced-motion: reduce` → keys render instantly, no 3D translate, no entrance animation **and** spotlight movement, spark bursts, and board tilt are all disabled/flattened — keyboard stays fully usable.
- [ ] Keyboard is scoped to `#skills` — does not appear elsewhere.
- [ ] Page remains usable if the audio clip is missing (Howler logs a warning, clicks stay silent, UI intact).
- [ ] Move the mouse across the board → a soft `#5B8FFF` spotlight follows the cursor and fades in/out on `mouseenter`/`mouseleave`; it never leaks outside the keyboard.
- [ ] Click a key (and Enter/Space on a focused key) → a spark burst radiates from that key using only accent/bolt-core colors and is fully gone within ~400ms; no spark on hover; no DOM accumulation after multiple presses.
- [ ] The keyboard grid has a constant shallow `perspective` + `rotateX` tilt; keys still sink into the tilted board on press; no horizontal overflow at 375px.
- [ ] *(Optional)* Idle micro-flicker fires on a random key occasionally, avoids hovered/focused/pressed keys, pauses during a press.
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → scroll to the Skills section → confirm 24 keycaps render in 4 rows of 6 with the right names.
2. Hover a key → confirm **no sound** plays (only click should play).
3. Click a key → confirm the 3D-press effect + click sound (assuming the clip exists; if missing, confirm graceful silence).
4. Tab into the section → confirm each key is reachable in DOM order and shows a `#5B8FFF` focus outline; press Enter or Space on a focused key → confirm the press + sound trigger.
5. DevTools → toggle `prefers-reduced-motion: reduce` → reload → scroll into the section → confirm keys render instantly with no entrance animation and no 3D translate on press (color/opacity change only).
6. DevTools → device toolbar → 375px width → confirm the grid collapses to 3 columns, keys remain ≥44px, and nothing overflows.
7. Verify monogram fallback: inspect a key for Entity Framework, JWT, OpenCode, Claude Code, React Router → confirm it shows a styled glyph in `font-mono` accent, not a broken `<img>`.
8. Inspect Network tab → confirm icon images load from `cdn.jsdelivr.net` / `cdn.simpleicons.org`.
9. Move the mouse into the Skills section → confirm the `#5B8FFF` spotlight appears and follows the cursor; move the mouse off the board → confirm it fades out; confirm it does not appear outside the keyboard bounds.
10. Click a key → confirm a spark burst radiates from that key with accent/bolt-core colors and is gone within ~400ms; press Enter/Space on a focused key → confirm the same burst fires; hover a key → confirm **no** burst.
11. Inspect the board wrapper in DevTools → confirm a constant shallow `rotateX` is applied via CSS `perspective`; resize to 375px → confirm no horizontal overflow is introduced by the tilt.
12. Toggle `prefers-reduced-motion: reduce` → reload → confirm spotlight movement, spark bursts, and board tilt are all disabled/flattened alongside the existing entrance animation and 3D-press — the keyboard is a flat, fully usable static grid.
13. *(Optional, only if implemented)* Wait idle on the section for ~10–20s → confirm a random key does a brief `#5B8FFF` glow flicker; hover/focus/press a key → confirm the flicker does not target that key.
14. `npm run build` → confirm it completes without errors.