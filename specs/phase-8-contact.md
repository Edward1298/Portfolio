# Phase 8 — Contact Section

Contract for the contact section — a "Let's work together" heading, a short subtitle, and a contact form that posts to Formspree. Submitted messages are delivered to `Edward_1298@hotmail.com` (the recipient is configured in the Formspree dashboard, **not** in the code). The email subject is locked to "Contact from Portfolio" via Formspree's `_subject` field.

---

## Objective

A working contact form that lets recruiters send a message straight to the owner's inbox, with clear success/error feedback and no backend. Formspree is the transport — the code holds only a form ID in an environment variable; the recipient email and any reply-to routing are wired in the Formspree dashboard.

## Prerequisites

- ✅ Phase 0 — Tailwind tokens, `.env` template exists and is gitignored.
- ✅ Phase 1 — `Contact` stub exists; nav anchor `#contact` resolves; active-highlight reaches the bottom section.
- ✅ Phase 2 — Global effects mounted.

## Files to create / modify

| Path | Action | Purpose |
|---|---|---|
| `src/components/Contact/Contact.jsx` | replace stub | Heading + subtitle + form |
| `src/components/Contact/Contact.css` | create (optional) | Only if Tailwind isn't enough |
| `src/data/contact.js` | create | Service config: endpoint builder, env var name, locked subject |
| `.env` | edit (template) | Add `VITE_FORMSPREE_ID=your_form_id_here` placeholder |

> Architecture governance: `Contact/` is mapped in `Architecture.md` §4; `data/contact.js` is a new flat data file per `Architecture.md` §3 (data files are flat, one file per item) — no guide update needed since `data/` itself is already mapped and the file follows the existing `projects.js`, `skills.js`, `timeline.js`, `certifications.js` pattern.

## Formspree setup (manual, done by the user)

These steps are **not** code — they're configuration done once before deploying:

1. Create a Formspree account and a new form at https://formspree.io.
2. In the form's **Settings**, set the **recipient email** to `Edward_1298@hotmail.com` (this is the inbox that receives submissions; it never appears in the code or the repo).
3. (Optional) Set a reply-to in the dashboard so replies go back to the submitter's email.
4. Copy the form ID (the path segment after `/f/` in the form's endpoint) into `.env` as `VITE_FORMSPREE_ID`.
5. Verify the locked subject by sending a test submission — the email subject should read "Contact from Portfolio".

## Tasks

### 8.1 Heading + subtitle
- `<h2>` "Let's work together" — `font-display` (Space Grotesk), `text-primary`.
- Subtitle paragraph below — `text-secondary`, `font-sans`, one or two short lines (e.g. "Have a role or a project in mind? Drop a message — I read every one."). Keep it under 2 lines; tone less formal than the CV, matching the About Me section.

### 8.2 Form fields (exactly 3)
| Field | name attr | type | required |
|---|---|---|---|
| Name | `name` | text | yes |
| Email | `email` | email | yes |
| Message | `message` | textarea | yes |

No subject field is rendered — the subject is fixed at "Contact from Portfolio" via Formspree's `_subject` special field (added programmatically on submit, hidden from the user).

Each field is built with a real `<label>` (associated via `htmlFor`/`id`), `aria-required="true"`, and the input tokens from Design System §6:
- `bg-surface` (`#12151C`)
- `border-subtle` border (`#2A2E3A`)
- `text-primary` text, `text-secondary` placeholder
- `focus:border-accent` + `focus:shadow-glow-sm` (Design System §6 input + §5 shadow)

### 8.3 Formspree submit
```js
const endpoint = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
const formData = new FormData(form)
formData.append('_subject', 'Contact from Portfolio') // locked subject

fetch(endpoint, {
  method: 'POST',
  headers: { Accept: 'application/json' },
  body: formData,
})
```
- The `_subject` field is appended on submit, never shown to the user — every email arrives with the subject "Contact from Portfolio".
- Endpoint and locked subject are read from `src/data/contact.js` (decoupled config), so the component never hardcodes the URL or subject string.
- **Env var guard:** if `import.meta.env.VITE_FORMSPREE_ID` is missing or equals the placeholder string, the form should render disabled with an inline message "Contact form is not configured" and a hint pointing to `.env` — never silently fail.

### 8.4 Submit button
- Warm CTA accent per Design System §6 "Button (Primary CTA)":
  - `bg-cta` (`#F2A93B`), `text-bg` (`#0A0C12`) — high contrast on the warm button.
  - `hover:bg-cta-hover` (`#D98A2E`), `hover:shadow-glow-sm`.
  - `rounded-md` (8px), `padding: space-3 x space-4` (12px 16px).
  - `font-display` (Space Grotesk 500).
- **Warm color is used ONLY on the submit button** in this section — nowhere else (Design System §2 usage rule + AGENTS.md guidance).

### 8.5 Success / error feedback
- Inline status `<p>` below the form:
  - **Idle:** no status text.
  - **Sending:** button shows a small spinner (CSS or Lucide `Loader2` with `animate-spin`) + disabled; status `<p>` says "Sending…" with `role="status"` `aria-live="polite"`.
  - **Success:** form clears; status `<p>` "Message sent — thank you!" in `text-accent-glow` (`#7BA3FF`); `role="status"` `aria-live="polite"`.
  - **Error:** status `<p>` "Something went wrong, please try again." in `text-cta` (`#F2A93B` — warm tone flags the issue without using red, which isn't in the palette); `role="alert"` `aria-live="assertive"`.
- Use Framer Motion for a subtle fade between states, disabled on `prefers-reduced-motion`.

### 8.6 `.env` template update
- Add to the `.env` template (gitignored — Phase 0 already ignores `.env`):
  ```
  # Formspree form ID — find it in your Formspree form's endpoint URL (the part after /f/)
  VITE_FORMSPREE_ID=your_form_id_here
  ```
- Do **not** commit a real form ID (Rules §16 — secrets never committed).

## Technical constraints

- **Accessibility (Rules §8 / Design System §7):**
  - Every input has a `<label>` programmatically associated (`htmlFor` ↔ `id`).
  - `aria-required="true"` on each input; inline validation message on error with `aria-describedby` linking to the status `<p>`.
  - Form is fully keyboard-submittable (Tab → fields → button → Enter).
  - Visible `:focus-visible` outline in `#5B8FFF` on fields and button.
  - Touch targets ≥44×44px for the submit button.
  - `prefers-reduced-motion: reduce` → spinner is non-animated or replaced by the text "Sending…"; status fade is instant.
  - Status messages use `role="status"` / `role="alert"` + `aria-live` so screen readers announce them.
- **Desktop-first, responsive (Rules §7):** form is readable at desktop and at 375px (stacked single-column, full-width inputs).
- **English only (Rules §6)** for all strings.
- **No new dependencies (Rules §15):** Formspree needs no npm package — it's a `fetch` POST.
- **No comments unless short and necessary (Rules §5).**
- **No commit / push (Rules §17).**
- **No secrets in code/repo (Rules §16):** the recipient email and the real form ID are **never** in source — only `VITE_FORMSPREE_ID` reads from `.env`, and the recipient lives in the Formspree dashboard.

## Acceptance criteria (DoD)

- [ ] Heading "Let's work together" and subtitle render.
- [ ] Form shows exactly 3 fields (name, email, message) — no visible subject field.
- [ ] Every input has an associated `<label>` and `aria-required`.
- [ ] Submit button uses the warm CTA tokens (`#F2A93B` bg, `#0A0C12` text) — and warm color appears nowhere else in the section.
- [ ] Locked subject: every submission delivers an email to `Edward_1298@hotmail.com` with the subject "Contact from Portfolio" (verified after the user configures Formspree).
- [ ] Success state clears the form and shows the accent-glow status message.
- [ ] Error state shows the warm status message and keeps the entered values.
- [ ] In-flight state disables the button and shows "Sending…".
- [ ] If `VITE_FORMSPREE_ID` is missing, the form renders disabled with "Contact form is not configured".
- [ ] `.env` template contains the `VITE_FORMSPREE_ID` placeholder + comment.
- [ ] Status messages use proper `role` + `aria-live` attributes.
- [ ] Tab reaches every field and the button in order; focus outline is visible in `#5B8FFF`.
- [ ] `prefers-reduced-motion: reduce` → no status fade animation; spinner is non-animated or replaced by text.
- [ ] Layout works at 375px (single-column stacked inputs, nothing overflows).
- [ ] `npm run dev` shows no console errors; `npm run build` succeeds.

## Verification

1. `npm run dev` → scroll to the Contact section → confirm heading, subtitle, and the 3-field form render.
2. Inspect `.env` template → confirm `VITE_FORMSPREE_ID` placeholder is present and `.env` is gitignored (`git status` shows `.env` as ignored).
3. Without setting the env var → reload → confirm the form renders disabled with "Contact form is not configured".
4. Set `VITE_FORMSPREE_ID` to a real Formspree form ID (configured to deliver to `Edward_1298@hotmail.com`) → reload → fill and submit the form.
5. Check the inbox → confirm an email arrived with subject "Contact from Portfolio" and the body contains the name, email, and message.
6. Trigger an error (e.g. temporarily set an invalid form ID) → submit → confirm the warm error status message appears and the entered values are preserved.
7. Submit successfully → confirm the form clears and the accent-glow success status appears.
8. Tab through the form → confirm every field and the button are reachable in order with a visible `#5B8FFF` focus outline.
9. DevTools → toggle `prefers-reduced-motion: reduce` → reload → submit → confirm no status fade animation.
10. DevTools → device toolbar → 375px width → confirm the form is a single-column stack with no overflow, and the submit button is ≥44px tall.
11. `npm run build` → confirm it completes without errors.