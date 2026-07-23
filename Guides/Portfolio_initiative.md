# Portfolio Initiative

Purpose: give the agent a concise understanding of what this project is and what it should become. Technical implementation details live in `Design_System.md`, `Architecture.md`, and the per-phase contracts in `specs/`.

---

## 1. Overview

A personal portfolio website. Format: **single-page scroll** — no routing, no multiple views. Visual identity: **"night storm"** — an electric-blue lightning theme over a near-black background. Philosophy: **minimize text, prioritize visual and interactive content**. For details, point visitors to GitHub or the CV.

---

## 2. Global Visual Identity

- **Background:** small lightning bolts (not one large bolt), active across all sections.
- **Cursor:** a spark trail that feels consistent with the background bolts — storm, not fog.

---

## 3. Sections

### Landing
The first impression. Name, tagline, and links to LinkedIn, GitHub, and CV. Minimal — no heavy content, no images.

### About Me
A brief prose block (3–4 lines: what I do, soft skills, qualities) followed by a **vertical timeline** — entries in the format `date + role/milestone + 1 line`. Compact, responsive, not too detailed.

### Skills
An interactive mechanical keyboard (3D-press keycaps). Each key represents a skill. Keys play a subtle click **sound on click** (no hover, no mute control). The keyboard is **scoped to this section only** — it does not persist as a global background.

### Projects
5 featured projects presented as a **stacking-cards scroll pattern** — one project visible at a time, the next stacks on top as the user scrolls down. Each card shows a screenshot, a 2–3 line story (problem → solution → result), and links to the repo and/or live site.
Pattern reference: [motionsites.ai/?prompt=3d-jack-portfolio-hero](https://motionsites.ai/?prompt=3d-jack-portfolio-hero).

### Certifications
University degree shown first as a credibility anchor, followed by 5 certifications. Presented as a **horizontal card carousel**. Compact and browsable.

### Contact
"Let's work together" header with a short subtitle and a contact form for direct email submission. The warm CTA accent color is reserved for the submit button.

---

## 4. Core Principles

- **Fixed nav** with anchor links to each section — required for a long single-scroll page.
- **Less text, more interaction** — details live on GitHub or in the CV.
- **Performance-conscious** — canvas + audio + scroll animations together are heavy; keep the initial load light.
- **Accessible** — respects `prefers-reduced-motion`, usable if any effect fails, sensible color contrast over the animated background.