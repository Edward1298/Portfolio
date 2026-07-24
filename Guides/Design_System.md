# Design System

Quick reference for the portfolio's tech stack, color palette, typography, spacing, and component tokens.

---

## 1. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | **React + Vite** | Fast builds, no SSR overhead for a single-page interactive portfolio |
| Styling | **Tailwind CSS** | Fast prototyping, solid dark mode, consistent spacing/color |
| Scroll animation | **Framer Motion** (`useScroll`, `useTransform`) | Native React integration, good for stacking cards |
| Complex pinned animation | **GSAP + ScrollTrigger** | Fallback if Framer Motion pinning isn't precise |
| Keyboard audio | **Howler.js** | Better preload and throttling than raw `<audio>` |
| Icons | **Lucide React** | Lightweight, consistent, good coverage |
| Deployment | **Vercel** or **Netlify** | Free tier, auto-deploy from GitHub |

**No global state library needed** — `useState`/`useRef` per section is enough.

---

## 2. Color Palette

Theme: **night storm** — near-black background, electric blue protagonist, warm accent for actions.

### Core Colors

| Role | Hex | Tailwind Token | Usage |
|---|---|---|---|
| Page background | `#0A0C12` | `bg-bg` | Base background across the whole site |
| Surface | `#12151C` | `bg-surface` | Cards, keyboard base, project containers |
| Surface elevated | `#1A1E28` | `bg-surface-elevated` | Cards that need to pop (modals, selected states) |
| Lightning accent | `#5B8FFF` | `text-accent`, `bg-accent` | Bolts, cursor trail, links, hover states |
| Accent hover / glow | `#7BA3FF` | `text-accent-glow` | Glow effects, link hovers, soft highlights |
| Accent pressed | `#3B6FD9` | `bg-accent-dark` | Active/pressed states |
| Bolt core / highlights | `#DFE8F5` | `text-highlight` | Emphasized text, punctual highlights |
| Warm CTA | `#F2A93B` | `text-cta`, `bg-cta` | Calls to action — **use sparingly, 2-3 touchpoints max** |
| Warm CTA hover | `#D98A2E` | `bg-cta-hover` | CTA hover / pressed state |
| Primary text | `#F0F2F6` | `text-primary` | Off-white body text |
| Secondary text | `#A4AEB8` | `text-secondary` | Muted labels, captions |
| Disabled / muted | `#7A8491` | `text-disabled` | Disabled states, inactive elements |
| Border subtle | `#2A2E3A` | `border-subtle` | Card borders, separators |

### Usage Rules
- **Blue = ambient / interactive** — links, glow, effects, hover feedback.
- **Warm = action only** — CTAs, primary buttons, one-off highlights.
- **Never use warm as a background** — it breaks the storm coherence.

---

## 3. Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Headings / display | **Space Grotesk** | 500–600 | Section headers, project titles, nav |
| Body text | **Inter** | 400 (500 for emphasis) | About Me, descriptions, timeline prose |
| Monospace accents | **JetBrains Mono** | 400–500 | Keycaps, dates, tags, code-like labels |

### Rules
- **Never bold everything** — body stays 400, headings max 600.
- **Minimum body size:** 16px.
- **Monospace only for short labels** — never for paragraphs.
- **Headings scale down aggressively on mobile** — the canvas background already adds visual noise.

### Import (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 4. Spacing & Sizing

Base unit: **4px** (Tailwind default). Use these scale steps consistently.

| Token | Value | Use Case |
|---|---|---|
| `space-1` | 4px | Tight gaps, icon padding |
| `space-2` | 8px | Inline spacing, small gaps |
| `space-3` | 12px | Card internal padding |
| `space-4` | 16px | Standard gap / padding |
| `space-6` | 24px | Section internal padding |
| `space-8` | 32px | Between components within a section |
| `space-12` | 48px | Between sections |
| `space-16` | 64px | Large section breaks |

---

## 5. Effects & Shadows

| Token | Value | Use Case |
|---|---|---|
| `shadow-glow-sm` | `0 0 12px rgba(91, 143, 255, 0.25)` | Subtle glow on hover |
| `shadow-glow-md` | `0 0 24px rgba(91, 143, 255, 0.4)` | Active states, accent buttons |
| `shadow-glow-lg` | `0 0 48px rgba(91, 143, 255, 0.6)` | Lightning core glow, hero accents |
| `shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.4)` | Card lift shadow |
| `shadow-pressed` | `inset 0 2px 8px rgba(0, 0, 0, 0.6)` | Pressed keyboard keys, active buttons |

### Border Radius
| Token | Value | Use Case |
|---|---|---|
| `rounded-sm` | 4px | Tags, small buttons |
| `rounded-md` | 8px | Cards, inputs |
| `rounded-lg` | 12px | Large cards, keyboard base |
| `rounded-full` | 9999px | Pills, circular buttons |

---

## 6. Component Tokens

### Button (Primary CTA)
```
bg: #F2A93B
text: #0A0C12
hover-bg: #D98A2E
rounded: rounded-md (8px)
padding: space-3 x space-4 (12px 16px)
font: Space Grotesk 500
shadow: shadow-glow-sm on hover
```

### Button (Secondary / Ghost)
```
bg: transparent
border: 1px solid #2A2E3A
text: #5B8FFF
hover-bg: rgba(91, 143, 255, 0.1)
hover-border: #5B8FFF
rounded: rounded-md
```

### Card
```
bg: #12151C or #1A1E28
border: 1px solid #2A2E3A
rounded: rounded-lg (12px)
padding: space-6 (24px)
shadow: shadow-card
```

### Input
```
bg: #12151C
border: 1px solid #2A2E3A
text: #F5F6F8
placeholder: #9AA3B2
focus-border: #5B8FFF
focus-shadow: shadow-glow-sm
rounded: rounded-md
padding: space-3 (12px)
```

---

## 7. Accessibility

| Rule | Implementation |
|---|---|
| `prefers-reduced-motion` | Disable lightning canvas, reduce Framer Motion animations to simple fades |
| Color contrast | All text colors tested against `#0A0C12` and `#12151C` backgrounds |
| Focus states | Visible `outline: 2px solid #5B8FFF` on all interactive elements |
| Touch targets | Minimum 44×44px for buttons and links on mobile |
| Keyboard nav | All sections and nav links reachable via Tab |

---

## 8. Responsive Breakpoints

| Name | Width | Notes |
|---|---|---|
| `sm` | 640px | Tablet portrait |
| `md` | 768px | **Canvas throttle point** — reduce/disable lightning below this |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |

---

*Last updated: master plan phase 0 — all open questions resolved.*