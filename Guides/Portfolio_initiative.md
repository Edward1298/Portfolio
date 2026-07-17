# Portfolio Initiative

Initial planning document for the personal portfolio. Format: **single-page scroll**, no multiple views/routes.

---

## 1. Global Background

**Concept:** Lightning effect with "small background bolts" (not one large, consistent bolt), based on the reference `Lightning.jsx` component, instead of the single-bolt version from [reactbits.dev/backgrounds/lightning](https://reactbits.dev/backgrounds/lightning?hue=230&intensity=0.6).

**Cursor chase:** Spark trail — consistent with the visual language of the background bolts (instead of the ghost cloud cursor, which broke thematic coherence: storm vs. fog).

**Technical notes to consider:**
- The base component uses `depth: 7` (main bolt) and `depth: 5` (branches) recursively, with `shadowBlur` active on every `stroke()` call — expensive on canvas. Limit the number of simultaneous active bolts (2–3 max).
- Disable or reduce the effect under `prefers-reduced-motion` and on mobile (throttle based on `window.innerWidth`).
- Lazy-init: the canvas loop shouldn't start until the Landing section is in viewport, to avoid impacting initial load time.

**Color/palette reference:** [nareshkhatri.site](https://www.nareshkhatri.site/)

---

## 2. Landing

Simple, similar to Naresh Khatri's: name, links to LinkedIn, GitHub, and CV.

No additional elements — this is the first view, it shouldn't be overloaded.

---

## 3. About Me

**Overall philosophy for the portfolio:** minimize text, prioritize visual/guided content. For details, point to GitHub or the CV.

**Structure:**
- Short block: what I do, soft skills, and qualities (brief prose, 3–4 lines).
- Co-section as a **timeline**, not too detailed: format `date + role/milestone + 1 line`.

**Note:** decide whether the timeline should be horizontal-scroll or vertical/compact, so it doesn't take up too much vertical space given this is a single long-scroll page.

---

## 4. Skills

**Concept:** interactive mechanical keyboard (3D tabs style), inspired by Naresh's section, with modifications:

- **No cat** (decorative element from the original, excluded).
- **Scoped only to this section** — does not persist as a site-wide global background.
- Same button functionality (mechanical keyboard style), **including sound**.

**Technical notes:**
- Sound on `onClick`, not `onHover` (avoids cacophony when quickly hovering over multiple keys, and respects browser autoplay policies).
- Preload audio files to avoid delay on the first click.

---

## 5. Projects

**Concept:** "stacking cards" scroll pattern — one project visible at a time, and as the user keeps scrolling down, the next one stacks on top of the previous one.

**Reference:** [motionsites.ai/?prompt=3d-jack-portfolio-hero](https://motionsites.ai/?prompt=3d-jack-portfolio-hero)

**Content per project:**
- GitHub repositories.
- Screenshots of own projects, with links to repo and/or live project.
- Short project story (2–3 lines: problem → solution → result, consistent with the "less text" philosophy).

**Technical notes:**
- Implement with a proven library for scroll-driven animation (Framer Motion `useScroll`/`useTransform`, or GSAP ScrollTrigger with `pin`) rather than a manual `IntersectionObserver` approach.
- Test thoroughly on mobile — the "stacking" behavior with native touch scroll feels different than with mouse/trackpad scroll on desktop.

---

## 6. Certifications

Relevant/valuable certifications + university degree.

**Note:** if the university degree is recent or relevant, consider showing it first as a credibility anchor, with certifications afterward as a complement.

---

## 7. Contact

Style similar to Naresh's: "Let's work together," contact form for direct email submission.

---

## General considerations (whole page)

- **Fixed nav with anchor links** to each section (Skills, Experience, Projects, etc.) — necessary given this is a single, heavy, long-scroll page.
- **Cumulative performance:** the site combines background canvas animation + cursor chase + interactive audio + scroll-jacking in Projects. Aggressive per-section lazy-loading is needed to avoid penalizing initial load time.
- **Accessibility:** review `prefers-reduced-motion`, color contrast over the animated background, and ensure the site remains usable if the audio/canvas JS fails.

---

## Open questions / doubts

1. **About Me timeline:** horizontal-scroll or vertical/compact format? Still needs to be defined so it doesn't break the flow of a single long-scroll page.
2. **Background lightning density:** should it stay active across all sections, or reduce intensity/disappear after the Landing, so it doesn't visually compete with Skills (keyboard) and Projects (stacking cards)?
3. **Cursor spark trail:** same accent color as the background bolts, or a differentiated tone so it reads as a distinct interactive element from the ambient effect?
4. **Projects — number of featured projects:** how many projects go into the stacking pattern (all the ones mentioned: StoreKit-like, etc., or a "top" subset, with the rest as a simple list linking to GitHub)?
5. **Certifications:** how many certifications are you planning to show? If there are many, a grid/badge format might work better than a list, to keep the section compact.
6. **Keyboard sound (Skills):** visible mute/volume control for the user, or is the sound assumed to be subtle enough not to bother?

---

*Suggested next step: resolve question #2 (lightning density across sections), since it affects the design of both Skills and Projects.*
