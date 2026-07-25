# Portfolio — Master Plan

Reference document for the end-to-end implementation of the personal portfolio.
Stack and vision are defined in `Guides/Design_System.md` and `Guides/Portfolio_initiative.md`.
No database required.

---

## Resolved Decisions

| # | Topic | Resolution |
|---|---|---|
| 1 | About Me timeline | **Vertical**, to keep it responsive |
| 2 | Lightning density across sections | **Stay active everywhere** |
| 3 | Cursor spark trail color | **Same `#5B8FFF`** as the bolts — revisit if it reads off |
| 4 | Projects | **4 projects**, stacking-cards style per motionsites.ai reference (updated from 5 per phase-6 spec) |
| 5 | Certifications | **5 titles**, horizontal carousel with cards |
| 6 | Skills keyboard sound | **No mute** — sound assumed subtle |
| 7 | Skills keyboard interaction polish | CSS-only keycap grid (no Spline, no GSAP, no new deps). Added: **cursor-follow spotlight** `#5B8FFF` (hover-only — fades in on `mouseenter`, out on `mouseleave`); **on-press spark burst** (~400ms fade, accent/bolt-core colors); **permanent board tilt** via CSS `perspective` + slight `rotateX` (a few degrees only); **idle micro-flicker** = nice-to-have, **not** DoD. All decorative motion gates on `prefers-reduced-motion: reduce` (keyboard stays fully usable, static fallback). |

---

## Phase 0 — Project Scaffold & Config

| Step | What |
|---|---|
| 0.1 | `npm create vite@latest .` — React template |
| 0.2 | Install deps: `tailwindcss`, `framer-motion`, `lucide-react`, `howler` |
| 0.3 | Install dev deps: `postcss`, `autoprefixer` |
| 0.4 | Init Tailwind: `tailwind.config.js` + `postcss.config.js` |
| 0.5 | Add the **color palette** as Tailwind theme extensions |
| 0.6 | Import fonts in `index.html`: Space Grotesk, Inter, JetBrains Mono |
| 0.7 | Set up folder structure (`/src/components/`, `/src/hooks/`, `/src/data/`, `/src/assets/`) — flat layout per `Architecture.md` |
| 0.8 | Clear Vite boilerplate, set `<title>` and meta tags |

---

## Phase 1 — App Shell & Navigation

| Step | What |
|---|---|
| 1.1 | `App.jsx` — single-page wrapper, renders all sections + nav |
| 1.2 | **Fixed nav bar** — anchor links to each section (Landing, About, Skills, Projects, Certifications, Contact) |
| 1.3 | Active section highlight on scroll via `IntersectionObserver` |
| 1.4 | Global base styles in `index.css` — bg color, text color, scroll behavior |

---

## Phase 2 — Global Effects (Background & Cursor)

| Step | What |
|---|---|
| 2.1 | **Lightning canvas** — `LightningBackground.jsx` based on Lightning.jsx reference; small background bolts (depth 5, 2–3 simultaneous, `shadowBlur` active) |
| 2.1c | **Fog layer** — `FogBackground.jsx` (own component, mounted alongside lightning): WebGL fragment-shader FBM noise, dark storm-tuned palette (base `#0A0C12`, mist `rgba(0.16,0.19,0.28)`, accent tinted toward `#5B8FFF`). Behind lightning canvas (z 0 vs lightning z 1). Canvas is `position:fixed` (viewport-sized, efficient) but the shader displaces its noise coords by `window.scrollY / innerHeight * 0.5` — the fog drifts at half the page scroll speed (gentle parallax, less nauseating than near-1:1). Perf gates: DPR cap 1, half-res render + CSS upscale, 6 FBM octaves desktop / 4 mobile, `IntersectionObserver` lazy-init on `#landing`, `visibilitychange` pause. Mobile throttle (`<768px`). Reduced-motion: **deliberate exception** — fog keeps its gentle ambient drift + scroll-linked displacement (slow/ambient, atmospheric base of the site); lightning still omitted entirely under reduced-motion. |
| 2.2 | **Lazy-init** — `IntersectionObserver` on the Landing section starts the canvas loop |
| 2.3 | **`prefers-reduced-motion`** — disable canvas entirely if detected |
| 2.4 | **Mobile throttle** — if `window.innerWidth < 768`, reduce bolt count or disable |
| 2.5 | **Cursor spark trail** — `CursorSparkTrail.jsx`, accent `#5B8FFF`, lazy-init after first user interaction |
| 2.6 | Performance: `requestAnimationFrame` cleanup, destroy on unmount |
| 2.7 | Lightning stays **active across all sections** (per resolved decision #2) |

---

## Phase 3 — Landing Section

| Step | What |
|---|---|
| 3.1 | Full-viewport hero: name (Space Grotesk), tagline (Inter) |
| 3.2 | Social links row: GitHub, LinkedIn, CV download — Lucide icons + lightning accent |
| 3.3 | Subtle entrance animation (Framer Motion `fadeIn` + `slideUp`) |
| 3.4 | Lightweight — no heavy content, no images |

---

## Phase 4 — About Me Section

| Step | What |
|---|---|
| 4.1 | Short bio block — 3–4 lines of prose (Inter, body weight) |
| 4.2 | **Vertical timeline** — responsive, compact |
| 4.3 | Timeline entries: `date + role/milestone + 1-line description` |
| 4.4 | Animations: Framer Motion `whileInView` for scroll-triggered reveals |

---

## Phase 5 — Skills Section (Infinite Logo Loop)

| Step | What |
|---|---|
| 5.1 | Replace SkillsCircuit SVG network with `SkillsLoop/` — CSS-flow-based infinite marquee; no fixed-dimension SVG layout, resize-safe by design |
| 5.2 | Three categorized horizontal rows: Backend (left), Tools (right), Frontend (left) — `data/skills.js` reused as-is via `category` field |
| 5.3 | Infinite scroll via CSS `@keyframes translateX` (0 → -50%), two copies back-to-back for seamless loop, `mask-image` edge fade |
| 5.4 | Row hover → `animation-play-state: paused`; chip hover → accent border + `translateY(-2px)` + glow shadow |
| 5.5 | Dividers between rows: thin `#2A2E3A` line + `#5B8FFF` glow dot traveling 4s linear loop (direction alternates per divider) |
| 5.6 | `prefers-reduced-motion: reduce` → rows render as static wrapped grid, dividers flat (no animation, dot at 40% opacity) |
| 5.7 | Image error fallback: `onError` → monogram (first-letter acronym or first 2 chars) in accent color |
| 5.8 | `aria-hidden="true"` on duplicated second copy; `aria-label` on each track listing all skill names for screen readers |

---

## Phase 6 — Projects Section (Stacking Cards)

| Step | What |
|---|---|
| 6.1 | Create `ProjectCard.jsx` — screenshot, title, 2–3 line story, GitHub/live links |
| 6.2 | **Stacking scroll** with Framer Motion `useScroll` + `useTransform` — one card visible, next stacks on top as you scroll |
| 6.3 | Fallback: if Framer Motion pinning isn't precise, swap to GSAP ScrollTrigger `pin` |
| 6.4 | Populate from `/src/data/projects.js` — keeps content decoupled |
| 6.5 | **4 projects** total (per resolved decision #4), style matching motionsites.ai reference |
| 6.6 | **Mobile** — test touch scroll behavior, possibly fall back to vertical list on small screens |

---

## Phase 7 — Certifications Section

| Step | What |
|---|---|
| 7.1 | Degree first (credibility anchor), then certs |
| 7.2 | **Horizontal carousel** with cards — 5 titles total (per resolved decision #5) |
| 7.3 | Framer Motion scroll/interaction-driven carousel |
| 7.4 | Card content: title, issuer, date, optional credential link |

---

## Phase 8 — Contact Section

| Step | What |
|---|---|---|
| 8.1 | "Let's work together" heading + short subtitle |
| 8.2 | Contact form — name, email, message, and file attachment fields |
| 8.3 | Submit via **Formspree** (unchanged integration, extended to support file uploads) |
| 8.4 | Wrapped in **ElectricBorder** (reactbits Canvas-based animated border) — accent `#5B8FFF` |
| 8.5 | Regular submit button styled with warm CTA `#F2A93B` — `hover:brightness-110`, disabled state, inline-flex with Send icon and loading spinner |
| 8.6 | File attachment: dashed-border row, Paperclip icon, accepts PDF/PNG/JPG, 25MB max (Formspree system limit), filename display + remove button |
| 8.7 | Success/error feedback rendered **inline** inside the electric-bordered card — success replaces form content, error preserves fields |
| 8.8 | `prefers-reduced-motion` — ElectricBorder replaced with static bordered card (no canvas) |
| 8.9 | *(removed — SpecularButton dropped, `ogl` dependency no longer needed but may be cleaned up)* |

---

## Phase 9 — Performance & Polish

| Step | What |
|---|---|
| 9.1 | **Per-section lazy-loading** — `React.lazy` + `Suspense` for heavy sections (Skills, Projects) |
| 9.2 | Test all `prefers-reduced-motion` paths |
| 9.3 | Test mobile — touch scroll, canvas throttle, keyboard usability |
| 9.4 | Lighthouse audit — target 90+ Performance score |
| 9.5 | Final QA — anchor links, form submit, CV download, color contrast, content |

---

---

*Detailed contracts per phase will be added separately before each phase begins.*