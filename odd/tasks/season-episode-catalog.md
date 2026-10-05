# ODD Tasks: Season Episode Catalog

Feature: `season-episode-catalog` · Branch: `feat/character-cards-slab` · Created: 2026-10-05

## Objective
Add the user-approved six Season 1 episode titles and synopses, and show the confirmed Season 2 as upcoming without inventing release details.

## Problem / Why
The season browser currently has no catalog entries. The user supplied Spanish episode content and confirmed Season 2 is upcoming, so the existing data-driven section can now present approved content.

## Scope
- **In:** `frontend/data/seasons.json`; `frontend/types/content.ts`; `frontend/data/seasons.ts`; `frontend/components/sections/SeasonSelector.tsx`; `frontend/components/sections/SeasonTimeline.tsx`.
- **Out:** books/catalog content, release dates, artwork, episode descriptions not supplied, unrelated page redesign or animation changes.

## Constraints
- Preserve user-provided Spanish titles and synopses exactly.
- Add no air dates, artwork, or Season 2 episodes without approved content.
- Season 2 must be visible as “Próximamente” and unavailable for selection until episodes exist.
- Keep Season 1 selected by default; preserve existing season selector and timeline behavior for available seasons.
- Project has no declared frontend test or typecheck script; do not claim standalone test coverage.

## Tasks
- [ ] T1 — Populate Season 1 episodes and represent confirmed Season 2 as upcoming across typed data, loader, selector, and timeline.

## Route and delivery
- **Route:** delegated direct; five non-trivial implementation files require one writer.
- **Trigger evidence:** source/schema/UI exploration established five coordinated files; reading prepares the write.
- **TDD:** no test script or dedicated test runner is declared, so no meaningful deterministic RED is available; validate through the loader-backed production build and focused source/content assertions.
- **Delivery strategy:** `ask-on-risk` (default); estimated authored diff is under 400 lines, so no chain strategy is needed for this task.
- **RDD:** global mode was `on` at task start; assess the work-unit commit after implementation.

## Acceptance criteria
- Season 1 has six ordered episodes with the exact supplied Spanish titles and synopses.
- Season 2 appears after Season 1 in the season timeline and selector, labeled “Próximamente”; selector option is disabled.
- Season 1 remains initially selected and its six episodes render through existing validated loaders.
- No unapproved dates, images, episode data, or purchase data are introduced.
- `npm run build` succeeds; lint result is recorded against current baseline.

## Checks
- Run from `frontend/`: `npm run build`
- Run from `frontend/`: `npm run lint`
- Focused JSON/loader/SSR assertions for episode order, exact copy, Season 2 disabled/upcoming state, and Season 1 default selection.

## Progress / Evidence
- T1 implementation complete; commit and RDD assessment pending.
- Writer verification: `npm run build` passed; inline JSON checks confirmed exact episode content/order, Season 2 upcoming state, and absence of unapproved dates/artwork; built-HTML checks confirmed all six entries, disabled upcoming option, and Season 1 selection.
- Parent spot-check: `npm run build` passed again; Next.js 16.3.6 warned that `images.domains` is deprecated. Generated build writes stayed under `frontend/.next/`.
- `npm run lint` before and after implementation produced the same unrelated baseline: error `no-empty-object-type` in `frontend/components/Videobackground.tsx:3` and unused `props` warning at line 5.
- No standalone tests run; frontend package declares no test or typecheck script.

## Next Step
Record the work-unit commit and RDD assessment outcome. Browser visual acceptance remains a separate user-facing follow-up.
