# ODD Tasks: Characters Grid Layout

Feature: `characters-grid-layout` · Branch: `feat/character-cards-slab` · Created: 2026-10-05

## Objective
Replace the alternating full-width character rows with a responsive grid so the roster reads as ordered and legible, while keeping the graded-slab card, its hover tilt, shields overlay, missing states, and per-item scroll motion.

## Problem / Why
User feedback (2026-10-05): the Characters section content distribution is not ordered or legible; the user explicitly requested a grid. The alternating row design (`md:max-h-[100dvh]`, mirrored rows, viewport-height width math) made each character a full-screen block with an uneven reading order.

## Scope
- **In:** `frontend/components/sections/CharactersSection.tsx`; `frontend/components/cards/CharacterCard.tsx`.
- **Out:** data, types, other sections, `tiltedCard.tsx`, `Shield.tsx`, `globals.css`, hero/header, motion of other sections.

## Constraints
- Preserve: graded-slab composition (label chrome, barcode, cert), shields overlay on the art, accent color fields, `TiltedCard` hover tilt, missing-content labels, `aria-hidden` decorative chrome, accessible `h3` name + bio.
- Grid: 1 column on mobile, 2 on `sm`, 3 on `lg`; equal-height cells; keep the section `h2` and intro; keep `id="personajes"`, `scroll-mt-28`, `max-w-6xl` and existing paddings.
- Card cell reads vertically: slab centered, name under it, bio below; consistent alignment and readable line length; no alternating/mirrored logic, no `max-h-[100dvh]` row cap, no viewport-height width formula.
- Motion: preserve per-item entrance/exit ScrollTrigger behavior (same timings/eases: enter 0.8 `power2.out`, exit 0.6 `power2.in`, ±64px, opacity) now applied to grid items; keep the 55vh offset scrub and its final-layout bounds compensation, the reduced-motion gate, scoped `useGSAP`, and the deep-link settle logic. Update the compensation function to work on grid items.
- Spanish site copy unchanged; code identifiers/comments in English. No new dependencies.

## Tasks
- [x] T1 — Grid layout + card cell redesign + per-item motion adaptation in the two files.
- [x] T2 — User-revised container (2026-10-05): flex instead of grid — `flex w-full flex-col gap-[15px] p-8`, cards row `flex flex-col gap-[15px] md:flex-row`, wrappers `h-full md:min-w-0 md:flex-1`; `mx-auto`/`max-w-6xl`/grid classes removed. CharacterCard vertical cell unchanged.

## Route and delivery
- **Route:** delegated direct; one writer (writer trigger: 2 non-trivial files).
- **TDD:** no test or typecheck script is declared; no meaningful deterministic RED. Verify with `npm run build`, `npm run lint`, and built-HTML assertions.
- **Delivery:** `ask-on-risk`; forecast ~120–200 authored lines; one work-unit commit.
- **RDD:** global on. Last provider boundary: `19446ad`; previous review candidate (`7a37de5` range) was superseded by this change before consent was answered — no review started. Assess this work-unit commit after it lands.

## Acceptance criteria
- Roster renders as a grid (1/2/3 columns) with equal-height cells and no alternating rows.
- Each cell: slab, name `h3`, bio; no missing-content regression; no horizontal overflow.
- Per-item entrance/exit motion still runs with the same timing; reduced motion shows content at rest; deep links settle items.
- `npm run build` passes; lint stays at the known baseline (`Videobackground.tsx` 1 error / 1 warning).

## Checks
- Run from `frontend/`: `npm run build`
- Run from `frontend/`: `npm run lint`
- Built-HTML assertions in `frontend/.next/server/app/index.html`: grid container classes, three `h3` names, no `md:max-h-[100dvh]`/`flex-row-reverse` remnants, heading intact.

## Progress / Evidence
- T1 complete. Work-unit commit: `2de3148` (`feat(characters): switch roster to responsive grid`).
- Writer: container `grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12`, header `col-span-full`; card is a vertical stack (slab, `h3` `text-3xl md:text-4xl`, bio); mirrored/max-h/width-formula removed; motion kept with row→item rename only. +48/−53 = 101 changed lines.
- Writer checks: `npm run build` PASS; `npm run lint` exact baseline (`Videobackground.tsx` 1 error / 1 warning); built HTML: grid classes present, 3 `h3`s in data order (Hollander, Rozanov, Hunter), heading intact, forbidden remnants zero.
- Parent spot-check: `npm run build` PASS.
- T2 complete (user revised the grid to a flex row). Work-unit commit: `162dc7c` (`feat(characters): flex row roster container with 15px gaps`). Writer checks: `npm run build` PASS; lint baseline; built HTML: `flex w-full flex-col gap-[15px] p-8`, inner `flex flex-col gap-[15px] md:flex-row`, wrappers `h-full md:min-w-0 md:flex-1`, no grid remnants, 3 articles intact. Parent spot-check: `npm run build` PASS.
- Browser visual acceptance (breakpoints, equal-height alignment, tilt, motion feel) still pending; no browser connected.

## Next Step
Assess the work-unit commits under RDD (boundary `19446ad`); browser visual acceptance later.
