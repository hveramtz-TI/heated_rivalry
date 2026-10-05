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
- Receipt-driven development: on (global). Committed assessment for base `bc1ddb8` returned medium risk, `review_due: true` (`slice_budget_reached`), 5 files and 487 changed lines with untracked files excluded.
- The exact preflight froze target `sha256:1d22c1d5ce4ec14a2fc7a4981f07fdf1b227b2469ae552d63c2d0e9e9285c436` and START returned a `consent/v3` envelope for lineage `review-29f86faa4041b9f2` with choices `granted` and `declined`.
- This runtime does not expose the native consent question UI, so no continuation was invoked; the envelope was relayed to the user. The user then disabled receipt-driven development globally (the envelope's own off-path), so the pending consent will not be resolved and no review record exists. The candidate had covered both recent work units (`a005773` rail and background, `c0f1691` selector) plus the docs commits between.

## Next Step
No open review work. Delivery follows ordinary repository policy; `gentle-ai review mode enable` would be required to resume any review lifecycle.
