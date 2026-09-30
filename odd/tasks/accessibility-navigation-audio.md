# ODD Tasks: Accessible Navigation and Audio Controls

Feature: `accessible-navigation-audio` · Branch: `feat/character-cards-slab` · Created: 2026-09-30

## Objective

Implement the first approved UI/UX roadmap slice: give the one-page site clear semantic orientation and compact section navigation after the cinematic hero collapses; make soundtrack playback predictable and accessible.

## Problem / Why

The section links are currently only in the footer, the page has no main landmark, skip link, or visible page heading, and first audio playback seeks to 5 seconds before a delayed effect seeks again to 7 seconds. The user approved starting with navigation and player reliability.

## Scope

- **In:** `frontend/app/page.tsx` (skip link and main landmark); `frontend/components/Header.tsx` (visible H1 using the existing logo and collapsed-state section navigation); `frontend/components/Reproducer.tsx` (single predictable play path, focus feedback, playback failure feedback, safe-area placement).
- **Out:** changes to `CharactersSection`, `CharacterCard`, the current T6 ScrollTrigger work, footer links, season/book data, hero-video behavior, typography/theme, Lenis configuration, and visual redesign of the approved slab cards.

## Constraints

- Preserve the cinematic hero/100px collapsed header transition and the accepted card/row layout.
- Header navigation targets the existing `#personajes`, `#temporadas`, and `#libros` anchors. Hidden navigation must not remain keyboard-focusable; do not hide it while it contains focus.
- Keep the footer navigation as a useful duplicate path. Prefer native in-page anchors and existing section scroll margins; do not add scroll-jacking or a new routing dependency.
- Audio remains user-started only. Preserve the current first-play cue at 5 seconds and resume from the saved pause position; remove the delayed jump to 7 seconds.
- Use Spanish interface copy. Do not swallow playback failures; provide concise, visible, actionable feedback.
- Preserve all unrelated dirty/untracked files, including the in-progress T6 edits and Next-generated agent files.
- Effective TDD: disabled, from Engram `sdd-init/heated_rivalry` (observation 909); no configured test runner was detected. Run the project’s existing build/lint plus manual interaction checks; do not invent a test command.

## Tasks

- [x] UX1 — Add the skip link, visible page H1 around the existing brand mark, `<main>` around the three content sections, and accessible header navigation that becomes available after hero collapse. Preserve footer links. Verify focus, hidden-state tab order, anchor positioning/history, and focus retention while scrolling back to the hero.
- [x] UX2 — Simplify audio playback to one initial seek/play path; retain pause/resume position; catch rejected playback and media errors with visible status feedback; add explicit focus-visible styling and safe-area-aware fixed placement. Verify pointer and keyboard behavior at desktop and mobile widths.

## Route

- UX1: delegated mapping completed before implementation because the change spans 4+ UI files and scroll/focus behavior. One delegated writer for the multi-file implementation.
- UX2: same writer, separate work-unit commit from UX1 because audio behavior is an independent change.
- Verification: build + lint, parent spot-check, and manual browser acceptance when a browser is connected. No RDD review is started if the user-owned switch remains off.

## Acceptance Criteria

- The page exposes one visible H1, one main landmark, and a skip link that is visible on keyboard focus and lands at main content.
- The header provides labeled links to personajes, temporadas, and libros after collapse; links are hidden and out of tab order while the full hero is shown; focus is not lost or hidden if scroll returns to the hero while a link is focused.
- Native anchor navigation preserves browser URL/history behavior and the fixed-header offset.
- First explicit play starts at 5 seconds once; pause/resume returns to the stored position; no delayed seek occurs.
- Playback rejection/error is visibly announced in Spanish; play and volume controls have visible keyboard focus; fixed controls respect safe areas and do not obscure essential content.
- `npm run build` passes; lint introduces no new findings. UX1's baseline was 2 errors / 3 warnings; after UX2 also removed the pre-existing Reproducer findings, only 1 error / 1 warning remain in untouched `Videobackground.tsx`.
- Existing T6 edits in `CharactersSection.tsx` and `odd/tasks/character-cards-slab.md` remain unchanged.

## Verification Commands

- From `frontend/`: `npm run build` → PASS.
- From `frontend/`: `npm run lint` → UX1 baseline 2 errors / 3 warnings; UX2 result 1 error / 1 warning, both in untouched `Videobackground.tsx`.
- Manual browser checks: keyboard-only skip/navigation/audio; deep link and scroll-back focus behavior; audio first play, pause, resume, and rejected-play feedback; viewport widths 375px and 1440px; reduced-motion remains unchanged in this slice.
- Confirm `git status` preserves the pre-existing T6 and generated Next agent-file changes; stage only intended UX files and this task document.

## Progress / Evidence

- 2026-09-30: User authorized this first roadmap slice (accessible navigation + audio reliability).
- Read-only mapping completed by delegated explorer. Next.js 16 layout/navigation and client/server component guides were consulted. Lenis currently uses native anchor defaults (`anchors` not enabled); this task retains native anchors and does not change Lenis configuration.
- TDD mode recorded as disabled; no test runner configured.
- UX1 implemented: added the skip link and main landmark, made the existing logo the page H1, and added compact section navigation that is inert/hidden until the existing header transition completes. If scrolling back hides the nav while a link has focus, it remains visible until focus leaves.
- UX1 verification: `npm run build` passed. `npm run lint` returned the existing 2 errors / 3 warnings (Reproducer and Videobackground). Built SSR HTML confirmed one H1, one main landmark, the skip link, all three section destinations, the initially inert/labeled header nav, and all three unchanged footer anchors. `git diff --check` passed.
- UX1 runtime limitation: `curl http://localhost:3000` found no running server, and no desktop browser is connected. Animation timing, keyboard focus transitions, and visual layout were not visually verified.
- UX1 work-unit commit: `6cd2244` (`feat(a11y): add skip link and collapsed section navigation`).
- UX1 rollback boundary: revert only `frontend/app/page.tsx` and `frontend/components/Header.tsx` to remove the skip link/main landmark/header H1/nav; keep the independent UX2 player change.
- UX2 implemented: removed the delayed seek, set the first-play cue once, resume from the captured pause time, wait for `play()` to resolve before setting the playing state, and announce playback/load failures in Spanish. Added visible focus states and safe-area-aware placement. Removed the existing unused empty props type and unused component parameter while updating this component.
- UX2 verification: `npm run build` passed. `npm run lint` reported 1 pre-existing error and 1 warning in untouched `Videobackground.tsx`; the prior Reproducer error and 2 warnings no longer appear. Built SSR HTML confirmed the audio element, labeled play/volume controls, polite status region, safe-area offsets, and the UX1 semantic/navigation structure. `git diff --check` passed.
- UX2 runtime limitation: no server is running at `localhost:3000`, and no desktop browser is connected. First-play/pause/resume timing, rejected playback behavior, keyboard focus appearance, and mobile safe-area layout were not interactively verified.
- UX2 rollback boundary: revert only `frontend/components/Reproducer.tsx` to remove the audio behavior changes without affecting page semantics or section navigation.
- UX2 work-unit commit: `f3c7edf` (`fix(audio): keep playback position predictable and accessible`).

## Next Step

Repeat browser-only checks when a desktop browser is available; no source changes remain for this slice.
