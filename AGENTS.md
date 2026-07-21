# AGENTS.md

Quick-reference for OpenCode sessions. Full binding rules in `Guides/Rules.md`.

## Before anything

Read guides in this exact order before writing code:
1. `Guides/Rules.md`
2. `Guides/Portfolio_initiative.md`
3. `Guides/masterPlan.md`
4. `Guides/Architecture.md`
5. `Guides/Design_System.md`

## Stack (locked — ask before adding libraries)

React + Vite | Tailwind CSS | Framer Motion | Howler.js | Lucide React
No database, no backend, no global state library. No GSAP, no Spline, no carousel/form library.

## Phase workflow

Implementation proceeds one phase at a time. All phase contracts are written in `specs/` (phases 0–9).
- Active phase is defined by the spec in `specs/` — only work on that phase.
- **Phase 10 (Vercel deploy) was dropped** — the user handles hosting manually. Do not add deploy scripts or infra config.

## Critical rules agents would otherwise miss

- **Never commit or push** without explicit user request (Rule 17).
- **No new dependencies** without asking first (Rule 15).
- **Update `Architecture.md`** whenever creating a new file/folder not yet mapped there. Do it in the same change (Governance Protocol, Architecture §6).
- **Keep guides in sync** — if a decision changes, update the relevant guide doc in the same change (Rule 13).
- **Desktop-first, responsive** — primary target is recruiters on desktop, but every component must work on mobile (Rule 7).
- **Accessibility is non-negotiable** — `prefers-reduced-motion`, keyboard nav, visible focus states, color contrast (Rule 8).
- **Warm CTA color (`#F2A93B`) is for action only** — never use it as a background (Design System §2).
- **Environment variables go in `/.env`** — secrets never committed. Contact form (Phase 8) is locked to **Formspree**, recipient `Edward_1298@hotmail.com` is wired in the Formspree dashboard (never in code); the only env var is `VITE_FORMSPREE_ID`.
- **Components are PascalCase, co-located CSS, sub-components nested in parent folder** (Architecture §4-5).
- **`hooks/`, `data/`, `assets/` are flat** — one file per item, not one folder per item (Architecture §3). Images go in `src/assets/images/` kebab-case (e.g. `wedding-invate.png`), never nested per item.
- **Content is decoupled into `src/data/*.js`** — skills, projects, certifications, timeline, contact config each have their own flat data file; components read from data, never hardcode titles/URLs.
- **Projects count is 4** (masterPlan decision #4 was updated from 5 → 4). Do not add a 5th project without asking.

## Verification

After any changes, run the project to confirm it works (Rule 11). No test suite exists yet.
