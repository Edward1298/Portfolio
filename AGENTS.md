# AGENTS.md

Quick-reference for OpenCode sessions. Full binding rules in `Guides/Rules.md`.

## Before anything

Read guides in this exact order before writing code:
1. `Guides/Rules.md`
2. `Guides/Portfolio_initiative.md`
3. `Guides/masterPlan.md`
4. `Guides/Architecture.md`
5. `Guides/Design_System.md`

## Commands

```
npm run dev      # start dev server (default http://localhost:5173)
npm run build    # production build
npm run lint     # oxlint (installed by Vite scaffold)
npm run preview  # preview production build
```

## Stack (locked — ask before adding libraries)

React + Vite | Tailwind CSS | Framer Motion | Howler.js | Lucide React
No database, no backend, no global state library. No GSAP, no Spline, no carousel/form library.

**Tailwind is v3** — PostCSS config uses `tailwindcss` + `autoprefixer`. Do NOT upgrade to v4 or install `@tailwindcss/postcss`.

## Phase workflow

Implementation proceeds one phase at a time. All phase contracts in `specs/` (phases 0–9).
- **Phases 0–4 done** (scaffold, nav, lightning/cursor, landing, about).
- **Phases 5–9 are stubs** — section placeholders only. Do not jump ahead.
- **Phase 10 was dropped** — no deploy scripts or infra config.

## Critical rules

- **Never commit or push** without explicit user request (Rule 17).
- **No new dependencies** without asking first (Rule 15).
- **Update `Architecture.md`** whenever creating a new file/folder not yet mapped. Do it in the same change (Architecture §6).
- **Keep guides in sync** — if a decision changes, update the relevant guide doc in the same change (Rule 13).
- **Desktop-first, responsive.** Primary target is recruiters on desktop, but every component must work at 375px (Rule 7).
- **Accessibility is non-negotiable** — `prefers-reduced-motion`, keyboard nav, visible focus states, color contrast (Rule 8).
- **All animations must gate on `usePrefersReducedMotion`** (from `src/hooks/`). If true, render instantly with no transforms.
- **Warm CTA color (`#F2A93B`) is for action only** — never use it as a background (Design System §2).
- **Components are PascalCase, one folder per component**, co-located `.css` optional. Sub-components nest inside parent folder (Architecture §4-5).
- **`hooks/`, `data/`, `assets/` are flat** — one file per item, not one folder per item (Architecture §3).
- **Content is decoupled into `src/data/*.js`** — components read from data files, never hardcode titles/URLs.
- **Projects count is 4** (masterPlan decision #4). Do not add a 5th without asking.
- **Environment variables in `/.env`** — never committed. Contact form (Phase 8) uses Formspree; the only env var is `VITE_FORMSPREE_ID`.

## Verification

After any changes, run `npm run dev` and `npm run build` to confirm the project works. No test suite exists.
