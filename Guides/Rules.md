# Rules

Binding rules for any agent working on this project. Read and follow before doing anything else.

---

## 1. Read Order & Context

1. **Before anything**, read these files **in this exact order**:
   1. `Guides/Rules.md` (this file)
   2. `Guides/Portfolio_initiative.md`
   3. `Guides/masterPlan.md`
   4. `Guides/Architecture.md`
   5. `Guides/Design_System.md`
2. Use these docs as the source of truth for product vision, phases, structure, and design tokens.
3. When in question, answer from the project context and files first. If not clear, **always ask the user** — never assume.

---

## 2. Code & Craft

4. **No vibe coding.** Everything must be written for a reason. If you can't justify why a piece of code exists, don't write it.
5. **Leave small, efficient comments** so anyone can understand what a specific part of the code does. Keep them short — don't write paragraphs.
6. **Official language for the project is English.** All code, comments, commit messages, docs, and communication are in English.
7. **Desktop-first, responsive.** The primary target is recruiters on a PC, so build for desktop first. But every component must also look nice and work well on mobile devices.
8. **Accessibility is not optional.** Respect `prefers-reduced-motion`, ensure keyboard navigation, visible focus states, and color contrast per `Design_System.md` section 7 — always.

---

## 3. Workflow & Changes

9. **Ask the user before making any changes** beyond what was explicitly requested. Don't surprise the user with unrequested modifications.
10. **Stay within the current phase.** Only work on the phase defined by the active spec in `specs/`. Don't jump ahead to future phases.
11. **When done with any changes, run the project** to make sure it works. If any errors appear after an implementation, fix them before considering the task complete.
12. **Follow the Governance protocol** in `Architecture.md` — update it whenever a new file or folder is created that isn't already mapped, in the same change.
13. **Keep guides in sync.** If a decision changes, update the relevant guide doc (`Portfolio_initiative`, `masterPlan`, `Architecture`, or `Design_System`) in the same change.
14. **Performance budget.** Keep the initial load light — lazy-init heavy effects (canvas, audio), lazy-load heavy sections. Don't regress the Lighthouse score.

---

## 4. Dependencies & Guardrails

15. **No new dependencies without approval.** The stack is locked in `Design_System.md`. Adding a library requires asking the user first.
16. **No secrets or personal data in the repo.** The contact form uses a client-side service (Formspree/EmailJS). Any endpoint IDs or keys go in environment variables (`/.env`), never in source.

---

## 5. Git & Commits

17. **Do not commit or push changes** to the git repo. Always wait for the user to do it, or for the user to explicitly ask you to do it.

---

## 6. Core Principles (from Portfolio Initiative)

18. **Fixed nav** with anchor links to each section — required for a long single-scroll page.
19. **Less text, more interaction** — details live on GitHub or in the CV.
20. **Performance-conscious** — canvas + audio + scroll animations together are heavy; keep the initial load light.
21. **Accessible** — respects `prefers-reduced-motion`, usable if any effect fails, sensible color contrast over the animated background.