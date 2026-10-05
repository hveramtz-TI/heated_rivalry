# Season Selector

## Objective
Restore a working season selector in the seasons section: pick a season and see that season's heading and episode rail, without changing the recently accepted rail and background presentation.

## Problem
`frontend/components/sections/SeasonSelector.tsx` is empty and the section currently shows every season stacked; the accepted site design expects a selector that owns the displayed season.

## Why
User feedback after accepting the rail and background: the season selector is missing.

## Scope
- Recreate SeasonSelector as a client radio-group picker with accessible group semantics, 44px targets, disabled upcoming season, and keyboard support.
- SeasonsSection owns the selected-season state and renders the selector plus only the selected season (heading and rail).
- Preserve the section id, background image, overlay, responsive spacing, and EpisodeRail integration.

## Constraints
- Do not add code comments; style with Tailwind classes only (no inline styles).
- Keep the current data architecture (JSON plus typed models) and the accepted rail and background look.
- Do not modify EpisodeRail, EpisodeCard, data files, or unrelated sections.
- Keep technical artifacts in English; UI copy stays in Spanish as specified.

## Authorized Scope
- `frontend/components/sections/SeasonSelector.tsx`
- `frontend/components/sections/SeasonsSection.tsx`

## Tasks
- [x] T1 (delegated): Recreate the picker and wire the selected-season state.

## Acceptance Criteria
- Selector renders one native radio per season inside a labeled group with a visible focus indicator and 44px minimum targets.
- Upcoming seasons render disabled with a "Proximamente" meta; available seasons show their episode-count meta.
- Selecting a season swaps the displayed season block; the first season is selected by default.
- The section keeps the background image, overlay, `id="temporadas"`, and rail behavior.
- Production build passes and no new lint findings are introduced.

## Route and Delivery
- Route: delegated direct, one bounded writer (two non-trivial files).
- Trigger: the write spans two source files, so the writer trigger applies.
- Delivery strategy: ask-on-risk (default). Forecast: under 400 authored changed lines.
- Receipt-driven development: on (global); committed assessment after the work-unit commit.

## Checks
- `npm run build`
- Known baseline lint failures, out of scope: `frontend/components/Videobackground.tsx` empty-object type error and unused `props`, plus an unused `Shield` warning in `frontend/components/CharacterCard.tsx`.

## Progress and Evidence
- T1 implemented: `SeasonSelector.tsx` recreated as a client radio group with sr-only legend, 44px pills, `peer-checked` inversion, `peer-focus-visible` 2px white outline, episode-count meta, and disabled "Proximamente" option; `SeasonsSection.tsx` now owns `selectedId` state and renders only the selected season block while preserving the background, overlay, and rail.
- `npm run build`: passed (compiled, TypeScript, 4/4 static pages).
- `npm run lint`: exact known baseline, 1 error and 2 warnings, all out of scope (`Videobackground.tsx` type error and unused `props`; unused `Shield` in `CharacterCard.tsx`); no findings in the edited files.
- Browser-based keyboard and visual checks were not run.
- Receipt-driven development: on (global); committed assessment and commit identity pending.

## Next Step
Delegate T1, verify the build, commit the work unit, then record RDD outcome and commit identity here and in the Engram mirror.
