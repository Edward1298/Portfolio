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

## Phase 5 — Skills Section (Interactive Keyboard)

| Step | What |
|---|---|
| 5.1 | Create `SkillKey.jsx` — individual keycap with 3D-press effect (Tailwind `transform`, `box-shadow`) |
| 5.2 | Create `SkillsKeyboard.jsx` — layout grid of keys, each representing a skill |
| 5.3 | **Sound:** preload audio clip(s) via Howler.js, play `onClick` only |
| 5.4 | **No mute control** (per resolved decision #6) |
| 5.5 | Keyboard scoped to this section — no global persistence |
| 5.6 | Section entrance animation — keys stagger-reveal |
| 5.7 | **Cursor-follow spotlight** — soft radial glow `#5B8FFF` tracking mouse across the whole board (not per-key); fades in on `mouseenter`, out on `mouseleave`. Disabled under `prefers-reduced-motion`. |
| 5.8 | **On-press spark burst** — small accent/bolt-core colored spark particles burst from the clicked key on `onClick`/`keydown` (never hover), fade out under ~400ms. Disabled under `prefers-reduced-motion`. |
| 5.9 | **Permanent board tilt** — whole keyboard grid uses CSS `perspective` + slight `rotateX` (a few degrees only) for depth; distinct from each key's individual 3D-press. Flattened under `prefers-reduced-motion`. |
| 5.10 | *(Nice-to-have)* **Idle micro-flicker** — a random key does a brief subtle flash occasionally without interaction, like distant lightning. Non-blocking; only if it stays simple. |

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
|---|---|
| 8.1 | "Let's work together" heading + short subtitle |
| 8.2 | Contact form — name, email, message fields |
| 8.3 | Submit → send via **Formspree** or **EmailJS** (no backend needed) |
| 8.4 | Warm CTA accent (`#F2A93B`) on submit button |
| 8.5 | Success/error feedback state |

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