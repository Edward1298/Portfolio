# Phase 7 — Certifications Section

Contract for the certifications section — a horizontal card carousel with 6 cards: the Bachelor's degree first (credibility anchor), followed by 5 certifications. Each card shows a credential image, title, issuer (TODO), date (TODO), and an optional credential link (TODO).

---

## Objective

A horizontal carousel of 6 cards, ordered degree → certifications, browsable via scroll-snap and arrow controls. Decoupled content in `src/data/certifications.js`.

## Prerequisites

- ✅ Phase 0 — Tailwind tokens, fonts.
- ✅ Phase 1 — `Certifications` stub exists; nav anchor `#certifications` resolves.
- ✅ Phase 2 — Global effects mounted.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/Certifications/Certifications.jsx` | replace stub | Carousel wrapper + controls |
| `src/components/Certifications/CertificationCard/CertificationCard.jsx` | create | Single card (sub-component, Architecture §4) |
| `src/components/Certifications/Certifications.css` | create (optional) | Scroll-snap helpers if Tailwind isn't enough |
| `src/data/certifications.js` | create | Array of 6 cert objects |
| `src/assets/images/universitario.png` | copy from `Images/Certifications/Universitario.png` | Degree image |
| `src/assets/images/git-essentials.png` | copy from `Images/Certifications/Git Essentials.png` | Cert 2 image |
| `src/assets/images/aws.png` | copy from `Images/Certifications/AWS.png` | Cert 3 image |
| `src/assets/images/google-ia-essentials.png` | copy from `Images/Certifications/Google IA Essentials.png` | Cert 4 image |
| `src/assets/images/ai-assisted-software-development.png` | copy from `Images/Certifications/AI-Assisted Software Development.png` | Cert 5 image |
| `src/assets/images/exin-agile-scrum-master.jpg` | copy from `Images/Certifications/Exin Agile Scrum Master.jpg` (note: .jpg) | Cert 6 image |

> Architecture governance: all paths mapped in `Architecture.md` §3-4 — no guide update needed.

## Certifications (locked order, 6)

Order is deliberate — the degree is first as a credibility anchor (masterPlan 7.1):

| # | title | image | type |
|---|---|---|---|
| 1 | Bachelor's Degree | universitario.png | Degree |
| 2 | Git Fundamentals | git-essentials.png | Certification |
| 3 | AWS Cloud Technical Essentials | aws.png | Certification |
| 4 | Google AI Essentials | google-ia-essentials.png | Certification |
| 5 | AI-Assisted Software Development | ai-assisted-software-development.png | Certification |
| 6 | EXIN Agile Scrum Master | exin-agile-scrum-master.jpg | Certification |

Each object in `data/certifications.js`:
```js
{
  title,            // exact string from the table above
  image,            // imported asset URL
  type,             // "Degree" | "Certification"
  issuer,           // "TODO: issuer"
  date,             // "TODO: date"
  credentialUrl,    // null  // TODO: optional credential link
}
```

`issuer`, `date`, and `credentialUrl` are **TODO placeholders** set to the string `"TODO: <field>"` (and `null` for `credentialUrl`) — to be filled in during implementation when the user provides them.

## Tasks

### 7.1 Degree first
- `data/certifications.js` array is ordered exactly as the table above: degree at index 0, then 5 certs.
- Render in array order so the Bachelor's degree is the leftmost card (the first card the recruiter sees).

### 7.2 Horizontal carousel
- Use a horizontal scroll-snap container: `overflow-x-auto snap-x snap-mandatory` with `scroll-snap-align: center` on each card.
- Cards are `w-80` (or similar fixed width) with consistent height.
- Native swipe works on mobile (touch + scroll-snap). Desktop gets arrow controls (next/prev) implemented as real `<button>`s beside the carousel that call `scrollBy` on the container ref.
- Active card highlight: track the centered card via `IntersectionObserver` (reuse `useInView` from Phase 1 with `amount: 0.6`) → apply `shadow-glow-sm` + full opacity to the active card; dim others to `opacity-60`.

### 7.3 Animation
- Framer Motion adds subtle transitions on card activation (`layout` or `animate` props) — keep light.
- `prefers-reduced-motion: reduce` → disable transitions; scroll snaps instantly (scroll-snap still works for usability, just no animated transition between cards).

### 7.4 Card content — `CertificationCard.jsx`
- Credential image (top, `aspect-video` object-cover, `rounded-lg`).
- Title (`font-display`, `text-primary`).
- Issuer (`text-secondary`, currently `"TODO: issuer"` placeholder).
- Date (`font-mono`, `text-secondary`, currently `"TODO: date"` placeholder).
- Optional credential link (`ExternalLink` Lucide icon) when `credentialUrl` is non-null — for now, all are `null` so no link renders yet. When TODOs get filled with real URLs, the link appears.
- Type badge in the corner: "Degree" vs "Certification" in `font-mono text-xs text-secondary`.
- Card shell: `bg-surface`, `border-subtle`, `rounded-lg`, `shadow-card` (Design System §6).

### 7.5 Heading
- Section `<h2>` "Certifications" (or "Certifications & Degree") for in-page navigation, rendered by `Certifications.jsx`.

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - Arrow controls are real `<button>`s with `aria-label="Previous"` / `aria-label="Next"`.
  - Keyboard: Left/Right arrow keys focus + move the carousel (add a `keydown` handler on the container) when the section has focus.
  - Each card's credential link (when rendered) is a real `<a>` reachable via Tab with the global focus outline.
  - Credential image `<img>` has `alt` = title.
  - Touch targets ≥44×44px for arrow controls.
  - `prefers-reduced-motion: reduce` → no animated card transitions (instant snap).
- **Desktop-first, responsive (Rules §7):** carousel arrows at desktop; native swipe at mobile.
- **English only (Rules §6)** for all strings.
- **No new dependencies (Rules §15):** Framer Motion already locked. No carousel library — use scroll-snap + arrow controls.
- **No comments unless short and necessary (Rules §5).**
- **No commit / push (Rules §17).**
- **No invented content**: titles and images match the table above exactly. `issuer`, `date`, and `credentialUrl` stay as TODO placeholders until the user provides real values.

## Acceptance criteria (DoD)

- [ ] 6 cards render in the exact order: Bachelor's Degree → Git Fundamentals → AWS Cloud Technical Essentials → Google AI Essentials → AI-Assisted Software Development → EXIN Agile Scrum Master.
- [ ] Each card shows the correct credential image, title, type badge, and TODO placeholders for issuer and date.
- [ ] No `credentialUrl` link renders yet (all are `null`).
- [ ] Bachelor's Degree card is the leftmost / first card.
- [ ] Horizontal scroll-snap works on mobile (swipe) and desktop (arrow buttons).
- [ ] Active (centered) card has `shadow-glow-sm` + full opacity; inactive cards dimmed to `opacity-60`.
- [ ] Arrow buttons are `<button>`s with aria-labels and ≥44px touch targets.
- [ ] Left/Right arrow keys move the carousel when the section has focus.
- [ ] Credential image `<img>` `alt` equals each title.
- [ ] `prefers-reduced-motion: reduce` → no animated card transitions; snap is instant.
- [ ] Layout works at 375px (cards visible, swipeable, nothing overflows).
- [ ] All content is read from `src/data/certifications.js` (no hardcoded strings in components).
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → scroll to the Certifications section → confirm 6 cards render in the correct order with the right titles, images, and type badges.
2. Confirm the Bachelor's Degree card is the first (leftmost) card.
3. Click the Next/Prev arrow buttons → confirm the carousel scrolls and the centered card is highlighted.
4. Tab to the carousel container → press Left/Right arrow keys → confirm the carousel moves.
5. DevTools → device toolbar → 375px width → swipe horizontally → confirm scroll-snap centers each card and nothing overflows.
6. Inspect a card in the Elements panel → confirm the credential image `<img>` has `alt` matching the title.
7. Confirm no `credentialUrl` link renders on any card (they're all `null` TODOs).
8. DevTools → toggle `prefers-reduced-motion: reduce` → reload → use arrows → confirm cards snap instantly with no animated transition.
9. Confirm `issuer` and `date` show "TODO: issuer" / "TODO: date" placeholders ready to be filled.
10. `npm run build` → confirm it completes without errors.