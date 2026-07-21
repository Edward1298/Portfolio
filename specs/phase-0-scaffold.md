# Phase 0 — Project Scaffold & Config

Contract for the first implementation phase. Bootstraps the Vite + React project, installs the locked stack, wires Tailwind with the full design-token palette, sets up the flat folder structure, imports fonts, and strips Vite boilerplate.

---

## Objective

Initialize a runnable Vite + React project that contains the locked stack, the full `Design_System.md` token set mapped into Tailwind, the folder layout from `Architecture.md` §3, the three portfolio fonts, and a clean shell — so that Phase 1 can build the app shell on top.

## Prerequisites

- None. This is the first phase.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `package.json` | create (via Vite) + edit | Deps + scripts |
| `vite.config.js` | create (via Vite) | Vite config |
| `tailwind.config.js` | create | Tailwind theme extensions (all tokens) |
| `postcss.config.js` | create | Tailwind + autoprefixer PostCSS plugins |
| `index.html` | modify (via Vite) | Title, meta, Google Fonts links |
| `src/main.jsx` | modify (via Vite) | React entry, imports `index.css` |
| `src/App.jsx` | replace boilerplate | Minimal placeholder rendering one section |
| `src/index.css` | replace boilerplate | Tailwind directives + base styles |
| `.gitignore` | create / edit | Ignore `node_modules`, `dist`, `.env` |
| `.env` | create (template only, gitignored) | Placeholder for Formspree/EmailJS IDs |
| `src/components/` | create folder | Empty, ready for Phase 1+ |
| `src/hooks/` | create folder | Empty, flat |
| `src/data/` | create folder | Empty, flat |
| `src/assets/sounds/` | create folder | Empty, flat |
| `src/assets/images/` | create folder | Empty, flat |

> Architecture governance: every folder above is already mapped in `Architecture.md` §3 — no guide update needed for Phase 0.

## Tasks

### 0.1 Scaffold Vite + React
- Run `npm create vite@latest .` inside the repo root.
- Choose the **React** template (JavaScript — no TypeScript, per stack lock).
- Accept overwrite of existing files if prompted (the repo currently only has `Guides/`, `specs/`, `README.md`).

### 0.2 Install runtime dependencies
```
npm install tailwindcss framer-motion lucide-react howler
```
- These are the four runtime libs from `Design_System.md` §1.
- `tailwindcss` is installed as a runtime dep here for simplicity of init; it will be moved to postcss-driven build per `postcss.config.js`.

### 0.3 Install dev dependencies
```
npm install -D postcss autoprefixer
```

### 0.4 Init Tailwind + PostCSS configs
- `tailwind.config.js` — set `content` to `["./index.html", "./src/**/*.{js,jsx}"]`.
- `postcss.config.js` — plugins `tailwindcss` and `autoprefixer`.

### 0.5 Map the full token palette into Tailwind theme extensions
Extend `theme.extend` in `tailwind.config.js` with **every** token below. Token names must match `Design_System.md` exactly so utilities like `bg-bg`, `text-accent`, `shadow-glow-md`, `rounded-lg` resolve correctly.

**Colors** (Design System §2):
| Token | Hex |
|---|---|
| `bg` | `#0A0C12` |
| `surface` | `#12151C` |
| `surface-elevated` | `#1A1E28` |
| `accent` | `#5B8FFF` |
| `accent-glow` | `#7BA3FF` |
| `accent-dark` | `#3B6FD9` |
| `highlight` | `#D2E6FF` |
| `cta` | `#F2A93B` |
| `cta-hover` | `#D98A2E` |
| `primary` | `#F5F6F8` |
| `secondary` | `#9AA3B2` |
| `disabled` | `#6B7280` |
| `subtle` (border) | `#2A2E3A` |

**Spacing** (Design System §4): add the custom scale steps `space-1` … `space-16` (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px) only if any value is outside Tailwind's default scale — otherwise rely on defaults. Document the mapping in a comment.

**Shadows** (Design System §5):
| Token | Value |
|---|---|
| `shadow-glow-sm` | `0 0 12px rgba(91,143,255,0.25)` |
| `shadow-glow-md` | `0 0 24px rgba(91,143,255,0.4)` |
| `shadow-glow-lg` | `0 0 48px rgba(91,143,255,0.6)` |
| `shadow-card` | `0 4px 24px rgba(0,0,0,0.4)` |
| `shadow-pressed` | `inset 0 2px 8px rgba(0,0,0,0.6)` |

**Border radius** (Design System §5): keep Tailwind defaults (`rounded-sm` 4px, `rounded-md` 8px, `rounded-lg` 12px, `rounded-full`) — verify they match; override only `rounded-lg` to 12px if needed.

### 0.6 Import fonts in `index.html`
Add to `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
- Set `<title>` to the portfolio owner's name + " — Portfolio".
- Add a meta description and `lang="en"` on `<html>` per Rules §2 (English-only project).

### 0.7 Create the flat folder structure
Create exactly the folders listed in "Files to create / modify". Per `Architecture.md` §3:
- `hooks/`, `data/`, `assets/` are **flat** — one file per item, not nested per item.
- Do **not** create placeholder `.gitkeep` files unless needed to retain empty folders in git; prefer creating real files in later phases.

### 0.8 Strip Vite boilerplate
- Delete default `App.jsx` CSS-in-JS demo content, `App.css` demo, and the Vite logo assets.
- Replace `src/App.jsx` with a minimal component that renders a single `<main>` with text confirming the shell is alive (e.g. "Portfolio shell — Phase 0 complete").
- Replace `src/index.css` with Tailwind directives + base styles:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    html { scroll-behavior: smooth; }
    body { @apply bg-bg text-primary font-sans antialiased; }
  }
  ```
- Default `font-sans` to `Inter` in Tailwind config.

## Technical constraints

- **No extra dependencies** beyond the locked stack (Rules §15). GSAP is mentioned in `Design_System.md` as a fallback only — do **not** install it in Phase 0.
- **English only** for all strings, comments, and meta (Rules §6).
- **No secrets** in the repo — `.env` is a template (e.g. `FORMSPREE_ID=your_id_here`), and `.gitignore` must include `.env`.
- **No comments unless short and necessary** (Rules §5).

## Acceptance criteria (DoD)

- [ ] `npm run dev` starts without errors.
- [ ] `npm run build` completes without errors.
- [ ] A Tailwind utility class like `bg-bg` renders the page background as `#0A0C12`.
- [ ] Every color, shadow, and border-radius token from `Design_System.md` exists in `tailwind.config.js`.
- [ ] Space Grotesk, Inter, and JetBrains Mono load (visible in Network tab as a single CSS request).
- [ ] Folder tree under `src/` matches `Architecture.md` §3.
- [ ] `.gitignore` includes `node_modules`, `dist`, `.env`.
- [ ] `App.jsx` renders a placeholder and contains no Vite demo content or logo.
- [ ] `<html lang="en">` and a meaningful `<title>` + meta description are set.
- [ ] No new dependencies beyond the four runtime + two dev listed above.

## Verification

1. `npm run dev` → open the local URL → confirm dark background (`#0A0C12`), off-white text, and the placeholder string render.
2. Open DevTools → Network → confirm the Google Fonts CSS request and font files load.
3. Inspect `tailwind.config.js` → confirm all tokens present and named exactly as in `Design_System.md`.
4. `git status` → confirm `.env` is **not** staged (gitignored) and no secrets are present.
5. Compare `src/` tree against `Architecture.md` §3 — must match.