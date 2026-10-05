# Fix build errors after frontend refactor

## Objective

Make `npm run dev` and `npm run build` run cleanly in `frontend/` after the in-progress refactor left broken imports, a missing shared constant, and empty modules.

## Problem

`next build` failed with:

- `app/page.tsx` imports `SeasonsSection.tsx` with an explicit `.tsx` extension; the file was 0 bytes (not a module).
- `app/page.tsx` imports `BooksSection`; the file was 0 bytes (not a module).
- `components/cards/BookCard.tsx` and `components/cards/EpisodeCard.tsx` import `MISSING_CONTENT_LABEL` from `@/data/ui`, which no longer existed.
- `components/sections/CharactersSection.tsx` maps `characters.json`; inferred `accent: string` is not assignable to `CharacterAccent`.

## Scope

- Recreate the shared label module `frontend/data/ui.ts`.
- Repair the broken imports and the JSON-to-type boundary on existing files.
- Implement `SeasonsSection` and `BooksSection` (currently empty) using the existing cards and the per-domain types.
- Out of scope: `SeasonSelector.tsx` and `EpisodeRail.tsx` (stay empty), the `images.domains` deprecation warning in `next.config.ts`, and migrating the two existing `style=` usages.

## Tasks

- [x] T1 Recreated `frontend/data/ui.ts` exporting `MISSING_CONTENT_LABEL = "Contenido próximamente"` (comment-free).
- [x] T2 Fixed the `SeasonsSection` import extension in `frontend/app/page.tsx`.
- [x] T3 Fixed the JSON-to-`Character[]` boundary in `frontend/components/sections/CharactersSection.tsx` and added the `personajes` anchor.
- [x] T4 Implemented `frontend/components/sections/SeasonsSection.tsx` (`temporadas` anchor, seasons from JSON, `EpisodeCard` grid).
- [x] T5 Implemented `frontend/components/sections/BooksSection.tsx` (`libros` anchor, books from JSON, `BookCard` grid, empty state with the shared label).
- [x] T6 Verification: `npm run build` exits 0 with no TypeScript errors; `npm run lint` reports only 1 error + 1 warning in `frontend/components/Videobackground.tsx` (present at HEAD, unmodified, outside the allowed surfaces); zero lint findings in the changed files.

## Constraints

- No comments in code (hard rule).
- No `style` prop or inline styles; Tailwind utilities through `className` only.
- No new dependencies, no `any`, no `@ts-ignore`.
- Do not modify files outside the allowed edit surfaces.

## Acceptance criteria

- `npm run build` exits 0 with no TypeScript errors; only the pre-existing `images.domains` deprecation warning remains. Met.
- Footer anchors `#temporadas` and `#libros` resolve; `#personajes` does not render because the pre-existing `app/page.tsx` does not mount `CharactersSection` (out of scope).
- No files outside the allowed surfaces changed. Met.

## Route and checks

- Route: delegated direct (`gentle-ai-worker`); writer reported `partial` only for the pre-existing lint failure; parent spot check re-ran `npm run build` (exit 0).
- RDD mode: on (global). Native preflight returned `consent_required` for candidate lineage `review-b753f00f0660633b` (medium risk, 59 files, 4950 changed lines). This runtime does not expose the native `question` UI required for `gentle-ai.review-integration.consent/v3`, so no consent choice was invoked and no review record exists; the consent request is pending and unanswered.
- Tests: none declared; no test runner. Checks were `npm run build` and `npm run lint`.
- Known non-blocking gaps (not authorized): `next.config.ts` still uses deprecated `images.domains`; `SeasonSelector.tsx` and `EpisodeRail.tsx` remain empty; `Reproducer.tsx` and `EpisodeCard.tsx` keep two pre-existing `style=` usages; root `AGENTS.md` still cites deleted `frontend/data/guards.ts` and `frontend/types/content.ts`.
