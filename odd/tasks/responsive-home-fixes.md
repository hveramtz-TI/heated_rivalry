# Responsive Home Fixes — Feature Tracker

## Objective
Apply the findings recorded in `RESPONSIVE-REVIEW.md` to the home page so mobile layout, touch interaction, reduced-motion behavior, and assistive-tech handling match the Web Interface Guidelines.

## Problem
The review found seven gaps across five clean files: a light-mode default that strands white headings, a missing skip link, a hero GSAP animation without a reduced-motion path, undersized mobile nav touch targets, an autoplay background video not hidden from assistive tech with no still fallback and eager preloading, and a fixed music player that can overlap content and focused elements.

## Why
The user asked to adjust the responsive mobile mode of the whole home and then to apply the documented findings.

## Scope
Allowed edit surfaces (no other file may change):

- `frontend/app/globals.css`
- `frontend/app/page.tsx`
- `frontend/components/Header.tsx`
- `frontend/components/Videobackground.tsx`
- `frontend/components/Reproducer.tsx`

Out of scope: `layout.tsx`, cards, sections other than Header, data files, and every unrelated dirty file already present in the worktree.

## Constraints
- No code comments (repository hard rule).
- No `style` prop or inline styles; Tailwind classes only, arbitrary values allowed.
- User-facing copy stays Spanish (existing site language).
- Before editing, consult the relevant guides under `frontend/node_modules/next/dist/docs/` (frontend/AGENTS.md).
- No test or typecheck script exists; `npm run lint` and `npm run build` from `frontend/` are the gates.
- The worktree carries unrelated uncommitted changes; the work-unit commit stages only the five files above.

## Tasks
Route: delegated direct — one bounded writer (writer trigger: 5 non-trivial files). Verification: writer self-verification + parent spot check; RDD off, risk tier read via `gentle-ai review assess` over the diff.

- [x] T1 — `globals.css`: make the dark palette the default (`--background`/`--foreground`) and set `color-scheme: dark` so white section text never sits on a light default; drop the now-redundant dark media override.
  - Check: dark defaults + `color-scheme: dark` present; light defaults and media override removed. Confirmed in diff.
- [x] T2 — `page.tsx`: add a Spanish skip link to `#main-content`, visually hidden until focused, above all z-layers.
  - Check: `href="#main-content"`, `sr-only focus:not-sr-only`, `focus:z-[300]`, rendered before Header. Confirmed in diff.
- [x] T3 — `Header.tsx`: honor `prefers-reduced-motion`; when reduce is active, set the compact hero end-state instantly (no scrub timeline) while nav visibility logic still works.
  - Check: `setupAnimated`/`setupReduced` split, `change` listener re-swaps setups, teardowns use `clearProps: "all"`. Confirmed in diff.
- [x] T4 — `Header.tsx`: bring mobile nav links to at least 44px tall hit areas with at least 8px gaps, mirroring the footer `min-h-11` convention; keep desktop row layout.
  - Check: anchors carry `min-h-11` + `px-3 py-2`, mobile `gap-2`, `sm:` row preserved. Confirmed in diff.
- [x] T5 — `Videobackground.tsx`: mark the video decorative for assistive tech, add a still `poster` fallback, switch `preload` off `auto`, and pause playback under `prefers-reduced-motion`.
  - Check: `aria-hidden="true"` wrapper, `poster="/episodeSectionBg.jpg"`, `preload="metadata"`, client reduced-motion pause effect. Deviation noted: inherited empty `type Props = {}` removed because eslint (`no-empty-object-type`) failed lint; behavior unchanged.
- [x] T6 — `Reproducer.tsx`: prevent the fixed player from covering page content by reserving clearance at page bottom (home wrapper) and move its inline safe-area positioning into Tailwind arbitrary-value classes.
  - Check: style prop removed (Tailwind arbitrary calc classes), `pb-52 md:pb-44` clearance on the home wrapper. Audio/aria behavior untouched.
- [x] T7 — Close: run `npm run lint` and `npm run build` in `frontend/`; record evidence; create one work-unit commit staging only the five files.
  - Check: both green (evidence below). Work-unit commit: `d66c5f3` on `feat/character-cards-slab` (5 files, +133/−69).
- [x] T8 — Regression from T3: runtime `TypeError: can't access property "_gsap", target is null` at the Header teardown. React detaches `useRef` values before passive effect cleanup runs, so the teardown's `gsap.set([logoRef.current, headerRef.current, videoBgRef.current], ...)` hit nulls on unmount (surfaced by Fast Refresh/unmount). Fix: capture the logo/header/videoBg elements at effect start and use the captured handles in both setups and both teardowns.
  - Check: lint exit 0, build passed with static prerender; fix commit `e4c59e2` (`fix(header): capture gsap targets at setup to survive ref detach on unmount`).
- [x] T9 — Follow-up request: on mobile the header nav becomes a menu opened by clicking the logo, displayed below the header. Implementation: logo wrapped in a `type="button"` disclosure (aria-expanded/aria-controls on mobile, SSR-safe via `useIsMobile(640)` aligned to the `sm` breakpoint); inline desktop nav switched to `hidden sm:flex`; new `#mobile-nav` fixed panel at `top-[100px]` with stacked 44px links; closes on logo re-tap, Escape, or link click.
  - Check: lint exit 0 (one iteration: `react-hooks/set-state-in-effect` rejected a breakpoint-close effect; removed — render guard `isMobile && menuOpen` suffices), build compiled + TS OK, HTTP 200 smoke with the button present in markup. Commit `4d9853f`.
- [x] T10 — Bug reported by user: logo toggle was clickable during the whole scroll. Now enabled only at the timeline end (same `progress >= 0.999` threshold as the compact nav): `syncCompact()` mirrors the threshold into `isCompact` state from onUpdate/initial evaluation/reduced path, the logo button is `disabled={isMobile && !isCompact}` (and the guard rejects early), and leaving the end state auto-closes an open menu.
  - Check: lint exit 0, build compiled + TS OK. Commit `3f7b54d` (`fix(header): enable logo menu toggle only at scroll timeline completion`).

## Acceptance Criteria
All seven review findings are resolved in source, lint and build pass, no unrelated file is modified, and the home keeps its current desktop visual identity.

## Delivery Strategy
`ask-on-risk` (default). Forecast: about 140 authored changed lines — a single work-unit commit; no chained PR planning needed unless the running count exceeds the budget.

## Progress & Verification Evidence
- Tracker created; writer delegated for T1–T6. (2026-10-05)
- Writer completed all six fixes; report status `completed`. (2026-10-05)
- `npm run lint` (writer): first run failed on inherited `type Props = {}` (`@typescript-eslint/no-empty-object-type`) in the rewritten Videobackground; type removed in scope; rerun passed, exit 0. Parent spot-check rerun: passed.
- `npm run build` (writer): passed — Next.js 16.3.6, compiled successfully, TypeScript finished, 4/4 static pages. Pre-existing warning outside scope: `images.domains` deprecated vs `images.remotePatterns` in `frontend/next.config.ts`.
- Route/verification record: delegated direct (writer trigger: 5 non-trivial files). RDD switch off (global) → no review lifecycle started. `gentle-ai review assess` over the change: tier `medium` (`executable_change`), first attempt `unassessable/high` due to unrelated untracked worktree files, resolved with the declared exclude inventory; writer self-verification + parent spot check accepted for medium.
- Work-unit commit: `d66c5f3` — `fix(home): resolve responsive review findings for mobile` on `feat/character-cards-slab`, exactly the five allowed files (+133/−69; ~202 authored lines, under the ~400 budget → `under_budget`, single slice).
- Uncommitted by design (parent decision): `RESPONSIVE-REVIEW.md` and this tracker — delivery of docs follows ordinary repository policy.
- Follow-ups noticed, out of scope: `frontend/components/cards/EpisodeCard.tsx` uses an inline `style` prop and a JSX block comment (repo-rule debt, unrelated dirty file); `next.config.ts` `images.domains` deprecation.
- Regression fix (T8): runtime null-ref crash in Header teardown after `d66c5f3`; captured element handles instead of `.current` at cleanup; lint/build green; commit `e4c59e2`. (2026-10-05)

## Acceptance Status
All seven review findings resolved and committed (`d66c5f3`). Remaining check is human: real-device pass at 320–430 px and tablet width.

## Next Step
Optionally review `d66c5f3` on a device/emulator; push/PR remain the user's decision under ordinary repository policy.
