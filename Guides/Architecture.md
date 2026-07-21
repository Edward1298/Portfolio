# Architecture

Reference document for the file and folder structure of the portfolio.
**Governance rule:** This document MUST be updated whenever a new file or folder is created that is not already mapped here. Update it in the same commit and add a short note of the entry's purpose.

---

## 1. Overview

- **Format:** Single-page scroll app — no routing, no multiple views.
- **Stack:** React + Vite, Tailwind CSS, Framer Motion, Howler.js, Lucide React.
- **No database, no backend, no global state library.**

---

## 2. Top-Level Structure

```
Portfolio/
├── Guides/                  # Base planning & reference .md files
│   ├── Rules.md              # Binding agent rules (read first)
│   ├── Design_System.md      # Colors, typography, tokens
│   ├── Portfolio_initiative.md  # Product vision
│   ├── masterPlan.md         # Phase-by-phase implementation plan
│   └── Architecture.md       # This file
├── specs/                    # One contract file per implementation phase
│   ├── phase-0-scaffold.md
│   ├── phase-1-app-shell.md
│   ├── phase-2-global-effects.md
│   ├── phase-3-landing.md
│   ├── phase-4-about.md
│   ├── phase-5-skills.md
│   ├── phase-6-projects.md
│   ├── phase-7-certifications.md
│   ├── phase-8-contact.md
│   └── phase-9-polish.md
├── public/                   # Static assets served as-is
│   └── cv.pdf
├── CV/                        # Source CV PDF (copied to public/cv.pdf in Phase 3) — committed
├── Images/                    # Source screenshots/credentials (copied to src/assets/images/ in Phases 6/7) — committed
├── src/                      # Application source (see section 3)
├── index.html                # Vite entry, fonts, meta
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env                      # Local env var: VITE_FORMSPREE_ID — NEVER commit
├── .gitignore                # Ignores node_modules/, dist/, .env
├── AGENTS.md                 # Quick-reference for OpenCode sessions
└── README.md
```

---

## 3. `src/` Structure

```
src/
├── main.jsx                  # Vite/React entry point
├── App.jsx                   # Single-page root, renders all sections + nav
├── App.css                   # App-level styles
├── index.css                 # Tailwind directives + global base styles
├── components/               # All components (see section 4)
├── hooks/                    # Reusable React hooks
│   ├── useInView.js          # IntersectionObserver wrapper
│   ├── usePrefersReducedMotion.js
│   └── useMediaQuery.js
├── data/                     # Decoupled content/data
│   ├── projects.js
│   ├── skills.js
│   ├── timeline.js
│   └── certifications.js
└── assets/                   # Local static assets imported in code
    ├── sounds/               # Keyboard key clips (Howler.js)
    └── images/               # Screenshots, logos, icons
```

**Notes:**
- `hooks/`, `data/`, `assets/` are **flat** — one file per item, not one folder per item.
- These are not components and do not follow the co-located component folder convention.

---

## 4. Component Structure

Every component lives in its own folder under `src/components/`, named after the component in **PascalCase**. Inside each folder: the `.jsx` file, an optional co-located `.css` file, and any helper files scoped to that component.

**Sub-components (children of a section) are nested inside their parent's folder.**

```
src/components/
├── Nav/
│   └── Nav.jsx
├── LightningBackground/
│   └── LightningBackground.jsx
├── CursorSparkTrail/
│   └── CursorSparkTrail.jsx
├── Landing/
│   └── Landing.jsx
├── About/
│   ├── About.jsx
│   └── Timeline/             # Sub-component of About
│       └── Timeline.jsx
├── SkillsKeyboard/           # Skills section — the interactive keyboard
│   ├── SkillsKeyboard.jsx
│   └── SkillKey/             # Sub-component — individual keycap
│       └── SkillKey.jsx
├── Projects/
│   ├── Projects.jsx
│   └── ProjectCard/          # Sub-component of Projects
│       └── ProjectCard.jsx
├── Certifications/
│   ├── Certifications.jsx
│   └── CertificationCard/    # Sub-component of Certifications
│       └── CertificationCard.jsx
└── Contact/
    └── Contact.jsx
```

### Per-folder contents

| File | Purpose |
|---|---|
| `ComponentName.jsx` | Main component |
| `ComponentName.css` *(optional)* | Styles scoped to this component when Tailwind isn't enough |
| `*.jsx` helpers *(optional)* | Local sub-components or builders specific to this component |

---

## 5. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component folder | PascalCase | `LightningBackground/` |
| Component file | Matches folder, `.jsx` | `LightningBackground.jsx` |
| Hook file | camelCase, `use` prefix | `useInView.js` |
| Data file | camelCase, singular | `projects.js` |
| Spec file | `phase-N-name.md` | `phase-0-scaffold.md` |
| CSS file | Matches component | `Nav.css` |
| Asset files | kebab-case | `key-press.mp3`, `project-storekit.png` |

---

## 6. Governance Protocol

This document is the **single source of truth** for project structure.

### Rule
Before creating any new file or folder under `src/` (or at root level), check this file:
1. **If the path is already mapped** — no action needed.
2. **If the path is NOT mapped** — update `Architecture.md` in the same commit:
   - Add the new entry to the relevant tree.
   - Add a short note explaining its purpose.
3. This applies to:
   - New components (add a folder in `src/components/`)
   - New sub-components (nest inside parent folder)
   - New hooks, data files, or asset directories
   - New config files at root
   - New spec files in `specs/`

### Example update

> Added `src/components/Contact/FormField/FormField.jsx` — isolated input field with validation, reused by the Contact form.

---

## 7. Import Conventions

- Components: `import Nav from './components/Nav/Nav.jsx'`
- Hooks: `import { useInView } from './hooks/useInView.js'`
- Data: `import { projects } from './data/projects.js'`
- Assets: `import keySound from './assets/sounds/key-press.mp3'`
- Use **relative paths** within `src/`. No path aliases unless added to `vite.config.js` and mapped here.

---

*Last updated: phase 0 — initial structure defined.*