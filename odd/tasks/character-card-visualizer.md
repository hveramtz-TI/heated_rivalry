# Character Card Visualizer

## Objective
Implement and mount the collectible-slab design in `CHARACTER-CARDS-DESIGN.md` using the current `characters.json` data and preserve the existing responsive roster grid.

## Problem
The design spec now describes a graded collectible-card visualizer, but `CharacterCard.tsx` is currently a plain name-and-bio stub. In addition, `CharactersSection` is not currently mounted in the home page, so a finished card would otherwise remain invisible.

## Why
The user approved proceeding from the reference-derived design document to implementation.

## Scope
- Rebuild `CharacterCard.tsx` as the acrylic slab/card composition defined by `CHARACTER-CARDS-DESIGN.md`.
- Pass a deterministic roster ordinal from `CharactersSection.tsx` for decorative card number/certification chrome.
- Mount `CharactersSection` before `SeasonsSection` in `app/page.tsx` so the visualizer is reachable on the home page.
- Render existing character data only: name, bio, cardArt, accent, and shields.

## Constraints
- Follow `CHARACTER-CARDS-DESIGN.md` and existing `DESIGN.md` tokens.
- No PSA, Pokémon, Corocoro, Nintendo, or other real brand marks; use Heated Rivalry identity only.
- Grade, serial, barcode, set line, and ordinal are fictional deterministic decoration and `aria-hidden`, never character facts.
- Preserve the current responsive 1/2/3-column CharactersSection grid.
- In `app/page.tsx`, only add the CharactersSection import/mount; preserve all other page composition.
- Hunter has only `id` and `name`: retain the slab shell, render the art placeholder and existing missing-content label, and omit badges without inventing details.
- Use the existing `Shield` component/API; do not modify shared components, data, or types.
- No code comments and no inline `style` props; Tailwind classes only.
- Keep the V1 static: do not restore GSAP, ScrollTrigger, TiltedCard, or add focusable controls.
- Preserve unrelated working-tree changes.

## Authorized Scope
- `frontend/components/cards/CharacterCard.tsx`
- `frontend/components/sections/CharactersSection.tsx`
- `frontend/app/page.tsx`

## Tasks
- [x] T1 (delegated): Implement the slab card and pass the stable roster ordinal.

## Acceptance Criteria
- Hollander and Rozanov render distinct red/blue slab accents, cardArt, Spanish bio, and the existing team/national shields with their data-provided alt text.
- Hunter renders a complete neutral slab with a decorative art placeholder and missing-content bio fallback, with no shield row or broken image.
- Card chrome is deterministic and absent from the accessibility tree; the real name/bio and shield alt text remain semantic.
- Bios are not truncated; the panel grows with its copy.
- The section grid and data contract remain unchanged, and the section appears in the home page before seasons.
- `npm run build` passes; lint introduces no new findings relative to the current baseline.

## Route and Delivery
- Route: delegated direct, one bounded writer.
- Trigger: three non-trivial source files are touched; source reading that prepares the edit belongs to the writer.
- Delivery strategy: ask-on-risk (default); forecast under 400 authored changed lines.
- Receipt-driven development: off (decided by global), confirmed before implementation; no RDD assessment is required.

## Checks
- `npm run build`
- `npm run lint`
- No test or typecheck script is declared; build runs the TypeScript check.
- Known lint baseline: `frontend/components/Videobackground.tsx` (`no-empty-object-type` error and unused `props` warning). The unused `Shield` warning in the current stub should disappear when the card uses it.

## Progress and Evidence
- T1 implemented in `frontend/components/cards/CharacterCard.tsx`, `frontend/components/sections/CharactersSection.tsx`, and `frontend/app/page.tsx`.
- `npm run build`: passed in the worker and parent spot check (TypeScript and static generation).
- `npm run lint`: only the known out-of-scope `Videobackground.tsx` findings remain (empty-object type error and unused `props` warning); the previous unused `Shield` warning in `CharacterCard.tsx` is gone.
- Independent read-only verification: PASS WITH NOTES; no candidate-caused blocker or should-fix finding. Browser visual and runtime image-loading checks were not run.
- `gentle-ai review assess` returned high/unassessable because pre-existing untracked files were undeclared. RDD is globally off, so no review lifecycle or consent was started; the independent technical verifier covered the high verification tier.
- Work-unit commit identity pending.
- Design source: `CHARACTER-CARDS-DESIGN.md`; reference image: `frontend/public/referenciaCard.jpg`.

## Next Step
Commit only the three authorized source files and this task document, then record the commit identity here and in the Engram mirror.
