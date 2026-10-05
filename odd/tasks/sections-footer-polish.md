# ODD Tasks: Sections and Footer Polish

Feature: `sections-footer-polish` · Branch: `feat/character-cards-slab` · Created: 2026-10-05

## Objective
Improve the UI and UX of the Characters, Seasons, and Books sections and the footer. Where content is missing (Books today), show a designed skeleton/template with clearly labeled examples that the owner fills in later.

## Problem / Why
- Characters has no visible section heading; card titles are `h3` directly after the page `h1` (UX audit, 2026-10-05).
- Episode cards repeat the generic missing-content label for absent artwork and air dates, so the approved Season 1 rail reads as broken.
- Episode rail arrows (40x40) and season pills are below the 44x44 touch-target guidance.
- Books renders a single generic missing-content panel; the owner wants a skeleton/template with examples to fill later.
- Footer is minimal: compact link targets, no return-to-top, flat hierarchy.

## Scope
- **In:** `frontend/components/sections/CharactersSection.tsx`, `frontend/components/cards/CharacterCard.tsx` (only if needed for heading hierarchy), `frontend/components/cards/EpisodeCard.tsx`, `frontend/components/sections/EpisodeRail.tsx`, `frontend/components/sections/SeasonSelector.tsx`, `frontend/components/sections/SeasonTimeline.tsx`, `frontend/components/sections/SeasonsSection.tsx`, `frontend/components/sections/BooksSection.tsx`, `frontend/components/cards/BookCard.tsx`, new `frontend/data/books.example.json` (template, not loaded), `frontend/components/sections/Footer.tsx`.
- **Out:** hero/header, Lenis/global reduced-motion, audio player, `globals.css` font change, catalog content beyond approved data, invented books/links/social/legal destinations, new dependencies.

## Constraints
- Preserve accepted designs: graded slab cards, alternating character rows, T6 per-row ScrollTrigger behavior and its 55vh hero-offset geometry.
- No invented canon: book examples are visibly labeled as examples/template and never presented as real catalog data; no purchase links.
- Spanish site copy, neutral register; code/comments in English.
- Keep reduced-motion gates, focus-visible states, semantic landmarks; touch targets at least 44x44.
- Lint must not grow beyond the current baseline (1 error / 1 warning in untouched `Videobackground.tsx`).

## Tasks
- [ ] T1 — Characters: visible level-2 "Personajes" heading with short intro; coherent heading hierarchy; preserve slab/rows/T6 animation geometry.
- [ ] T2 — Seasons: designed episode-art placeholder instead of missing label; omit absent air date; season meta (episode count); 44px rail controls and season pills; clear upcoming-season presentation.
- [ ] T3 — Books: empty-state skeleton/template grid with labeled examples and owner-facing status copy; BookCard hides absent optional fields instead of repeating labels; `books.example.json` documents the fillable shape.
- [ ] T4 — Footer: structured layout (brand, navigation, credits), 44px link targets, "Volver arriba" link, fan-site disclaimer; no invented destinations.

## Route and delivery
- **Route:** delegated direct; one writer for all four tasks (2+ non-trivial files; reading prepares writes).
- **TDD:** no test or typecheck script is declared; no meaningful deterministic RED. Verify with `npm run build`, `npm run lint`, and built-HTML assertions.
- **Delivery:** `ask-on-risk`; forecast ~380 authored lines. One work-unit commit per task (disjoint paths). Running count plus pending `5993add` slice (120 lines) feeds RDD `review_due`.
- **RDD:** global on. `5993add` assessed medium / `under_budget` (base `a68c849`, committed-only, untracked excluded per user "ninguno"); stays pending in the slice.
- **Generated output:** `frontend/.next/**` writes from `npm run build` are authorized build artifacts.

## Acceptance criteria
- Characters exposes a visible `h2` before character titles; T6 row animations and layout unchanged.
- Season 1 episode cards show no missing-content label for absent art/date; controls and pills meet 44x44.
- Empty Books shows a template grid with examples clearly marked as examples, plus a status message; real books render normally when JSON has entries.
- Footer has 44x44 link targets, return-to-top, and no invented external destinations.
- `npm run build` passes; lint unchanged from baseline.

## Checks
- Run from `frontend/`: `npm run build`
- Run from `frontend/`: `npm run lint`
- Built-HTML assertions in `frontend/.next/server/app/index.html` for headings, episode cards, Books template, footer links.

## Progress / Evidence
- Season catalog commit `5993add`: RDD medium / `under_budget`; pending in slice.

## Next Step
Delegate T1–T4 to one writer; verify; commit per task.
