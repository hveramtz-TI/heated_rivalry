# Episode Rail and Seasons Background

## Objective
Render each season's episodes in an accessible, horizontally scrollable rail and use the supplied episode image as the full-width SeasonsSection background without changing the current section composition.

## Problem
EpisodeCard exists, but EpisodeRail is empty and SeasonsSection currently renders episodes in a grid. The provided section background image is not applied.

## Why
The requested rail better presents episode cards as a sequence, while the supplied background gives the seasons section its intended visual treatment.

## Scope
- Add a native horizontal episode rail that composes the existing EpisodeCard.
- Replace the per-season episode grid with the rail while preserving empty-season behavior and current content.
- Apply `/episodeSectionBg.jpg` as a full-width background with a dark overlay for text contrast.

## Constraints
- Preserve unrelated working-tree changes and the current data/component architecture.
- Do not restore the previous rail implementation or its removed selector, timeline, animation, or data-loader dependencies.
- Do not add code comments or inline JSX styles; use Tailwind classes.
- Keep horizontal overflow inside the rail; the page itself must not overflow horizontally.
- The rail must be keyboard-focusable, semantically named, and have a visible focus indicator.
- Keep technical artifacts in English.

## Authorized Scope
- `frontend/components/sections/EpisodeRail.tsx`
- `frontend/components/sections/SeasonsSection.tsx`

## Tasks
- [x] T1 (delegated): Implement EpisodeRail and integrate it with the full-width SeasonsSection background.

## Acceptance Criteria
- EpisodeRail accepts the current typed episode data and renders each episode through EpisodeCard.
- The rail uses native horizontal scrolling and card snapping, remains contained on narrow screens, and is keyboard reachable with an accessible name and visible focus treatment.
- SeasonsSection retains season headings, years, and the existing empty-season behavior.
- The background image covers the full section width; a dark overlay keeps existing light text readable.
- No files outside the authorized scope are changed by the implementation.

## Route and Delivery
- Route: delegated direct, one bounded writer.
- Trigger: the implementation changes two non-trivial source files, so the writer trigger applies; the source read needed for implementation belongs to that writer.
- Delivery strategy: ask-on-risk (default). Forecast: under 400 authored changed lines; no chain decision is currently required.
- Receipt-driven development: on (global), observed before implementation.

## Checks
- `npm run lint`
- `npm run build`
- No test or typecheck script is declared in `frontend/package.json`; use lint and build as the available checks.

## Progress and Evidence
- T1 implementation completed in `frontend/components/sections/EpisodeRail.tsx` and `frontend/components/sections/SeasonsSection.tsx`.
- Current source baseline: EpisodeRail is empty; SeasonsSection renders episodes in a grid and has no background image.
- `npm run build`: passed in the worker and in the parent spot check; TypeScript and static generation completed.
- `npm run lint`: failed on the existing `components/Videobackground.tsx` empty-object type error, with its unused `props` warning and an unrelated unused `Shield` warning in `components/CharacterCard.tsx`; neither file is in scope.
- Browser-based visual, keyboard, and contrast checks were not run.
- Work-unit commit: `a00577310a289989f9d2316d73150bb4453bdc2e` (`feat(seasons): add episode rail and image background`).
- RDD was on globally. The initial committed-only assessment with base `c1648461` failed (unresolvable revision, `git_command_failed`, `next_action: stop`). The base was rebuilt as `bc1ddb8` with committed-only and untracked excluded: medium risk, `review_due: true` (`slice_budget_reached`), covering `a005773`, `dcfe21f`, and `c0f1691`; target `sha256:1d22c1d5ce4ec14a2fc7a4981f07fdf1b227b2469ae552d63c2d0e9e9285c436`, lineage `review-29f86faa4041b9f2`.
- START returned a `consent/v3` envelope; this runtime lacks the native consent UI, so no continuation was invoked. The user then disabled receipt-driven development globally (the envelope's own off-path). No review record or receipt exists.

## Next Step
No open review work for this commit. Delivery follows ordinary repository policy; `gentle-ai review mode enable` would be required to resume any review lifecycle.
