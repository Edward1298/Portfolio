# Portfolio

Live demo: [eduardocespedes.com](https://www.eduardocespedes.com/)

A single-page personal portfolio built as a cinematic scroll experience. Fog drifts in the background, lightning flashes across the viewport, the cursor leaves a spark trail, and content reveals itself in rhythm with the scroll.

Built without a custom backend — the contact form goes straight to Formspree, all assets are static, and the whole thing ships as a Vite-built SPA.

---

## Features

- **WebGL fog background** — full-viewport fragment-shader FBM noise, scroll-linked parallax, dark storm-tuned palette tinted toward the blue accent
- **Lightning canvas** — procedural bolts drawn on a 2D canvas, full-canvas flash that illuminates the fog below, throttled on mobile
- **Cursor spark trail** — `requestAnimationFrame` particle system that follows the pointer, accent color
- **Cinematic landing** — BlurText entrance for the name, gradient sweep, staggered social-link reveal, scroll cue
- **About + vertical timeline** — alternating left/right cards with a throbbing center line and a traveling pulse
- **Skills** — three infinite CSS-marquee rows (Backend / Tools / Frontend) with `mask-image` edge fade, hover pauses the row, chip hover lifts with accent border + glow
- **Projects** — 4 stacking cards pinned to the viewport, scroll-driven `useScroll` + `useTransform` for the entrance and dim transitions
- **Certifications** — horizontal carousel with side cards visible at 40% opacity, click-to-open lightbox
- **Contact form** — 2-column grid (Full Name / Company / Email on the left, Attachment / Message on the right), file upload (PDF/PNG/JPG, 25MB max), inline success / error feedback
- **Accessibility** — `prefers-reduced-motion` gates every decorative animation; the site remains fully usable with motion disabled. Keyboard navigation, visible focus states, ARIA labels throughout
- **Mobile-first responsive** — desktop target but verified at 375px

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, Vite 8 |
| Styling | Tailwind CSS v3 (PostCSS + autoprefixer) |
| Animations | Framer Motion (`motion`, `useScroll`, `useTransform`, `AnimatePresence`) |
| Audio | Howler.js (declared, reserved for future sound work) |
| Icons | Lucide React |
| Lint | oxlint |
| Contact form | Formspree (client-side POST, no backend) |
| Deploy | Vercel (SPA rewrite) |

No database, no global state library, no GSAP, no Spline, no carousel/form libraries.

---

## Architecture

```
src/
├── main.jsx                Entrypoint (StrictMode)
├── App.jsx                 Single-page root: nav + all sections + footer
├── index.css               Tailwind directives + global base styles
├── hooks/
│   ├── useInView.js                IntersectionObserver wrapper (nav highlighting)
│   ├── usePrefersReducedMotion.js  Media-query hook, gates every animation
│   └── useMediaQuery.js            Generic mql listener
├── data/                   Decoupled content — components read from here
│   ├── projects.js
│   ├── skills.js
│   ├── timeline.js
│   ├── certifications.js
│   └── contact.js
├── assets/
│   └── images/             Screenshots, certs, logos (imported in code)
└── components/             One folder per component, PascalCase
    ├── EffectBoundary/     Error boundary, silently swallows canvas crashes
    ├── Nav/                Fixed top nav, anchor links, active-section highlight
    ├── FogBackground/      WebGL FBM noise, z 0
    ├── LightningBackground/ 2D canvas bolts + flash, z 1
    ├── CursorSparkTrail/   Pointer particle trail
    ├── Landing/            Hero (BlurText + BlurText.css)
    │   └── BlurText/
    ├── About/              Bio + Timeline
    │   └── Timeline/
    ├── SkillsLoop/         CSS marquee + SkillsLoop.css
    ├── Projects/           Stacking cards
    │   └── ProjectCard/
    ├── Certifications/     Carousel
    │   ├── CertificationCard/
    │   └── CertificationLightbox/
    ├── Contact/            2-column form, Formspree
    └── Footer/             Copyright + back-to-top
```

---

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file at the project root (never committed):

```
VITE_FORMSPREE_ID=your_form_id_here
```

The contact form will show a "not configured" notice if the env var is missing.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR (default `http://localhost:5173`) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | oxlint over the project |

---

## Deploy

Deployed on Vercel. The site is a single-page app — all routes rewrite to `/` via Vercel's SPA fallback. The build output is the `dist/` folder produced by `npm run build`.

---

## License

Personal portfolio. Content and code by Eduardo Céspedes. Feel free to borrow the patterns, not the identity.
