# ODD Tasks: Character Cards Slab Redesign

Feature: `character-cards-slab` · Branch: `feat/character-cards-slab` (stacked on `feat/apply-plan-4-books-footer` @ dab650f) · Created: 2026-09-30

## Objective
Restyle the three roster cards (`CharacterCard`) into a graded trading-card "slab" aesthetic: an acrylic case with an accent label strip and a graded inner card (the character art), per user request (reference: PSA-graded card image).

## Problem / Why
The user wants the roster cards to look like a graded card in a slab. Product decision (user-confirmed, 2026-09-30): **site identity only** — no real brand marks or names ("PSA", "Upper Deck", "Young Guns"). Decorative label chrome (card number, grade, cert, barcode) is fictional, deterministic, and derived in-component.

## Scope
- **In:** `frontend/components/cards/CharacterCard.tsx` (rebuild); minimal backward-compatible extension of `frontend/components/reactbits/tiltedCard.tsx` (optional content slot so the whole slab tilts as one object); one-line ordinal prop pass in `frontend/components/sections/CharactersSection.tsx` (existing map only); `frontend/components/Shield.tsx` (optional `alt` prop; T4); T5: `CharactersSection` grid → vertical stack + `CharacterCard` alternating row layout (`max-h-[100dvh]`).
- **Out:** data files, types, other components, `globals.css`, slice-5 motion work, real brand marks, new animations/ScrollTriggers.

## Constraints (hard)
- Props remain compatible; root stays a single `<article>` (GSAP entrance targets the section wrapper — no transforms on card root).
- Informational only: no links, buttons, handlers, or focusable elements on the card.
- Missing states preserved: `MISSING_CONTENT_LABEL` for missing name/bio/art; shields row omitted when empty; no `<img>` for missing art.
- Lint baseline: exactly 2 errors / 3 warnings — no growth. `npm run build` must pass.
- Spanish body copy rules; slab chrome strings are proper nouns/grading terms only.
- `tiltedCard.tsx` extension must be backward compatible (its only consumer is `CharacterCard`, verified by grep).

## Tasks
- [x] T1 — Slab composition: acrylic case + accent label (set line, name, `#NNN`, `GEM MINT 10`, white lower band with decorative barcode + "HR" monogram + 8-digit cert) + rimmed art slot with missing-art panel; label region `aria-hidden`.
- [x] T2 — Whole-slab tilt: minimal optional-slot extension of `tiltedCard.tsx` + card wiring; moderate tilt/scale values.
- [x] T3 — Verification: build PASS; lint exactly 2/3; brand-strings grep zero; no focusables added; dev HTTP smoke; report.
- [x] T4 — Shields overlay (user feedback 2026-09-30): move `shields` (team + nationality) from the info-block row onto the photo, bottom-left, as small badges; drop the info-block row; `Shield` gains optional `alt` fed from `ImageRef.alt`.
- [x] T5 — Characters section row layout (user feedback 2026-09-30 #2): section = auto-height vertical stack; each article = desktop row, `max-h-[100dvh]`, even positions card+name left / description right, odd mirrored; name stays under the card; description readable column; mobile stacks.

## Route
T1/T2: one delegated writer (`general`), single writer thread. T3: writer runs checks; parent spot-check; user visual acceptance.

## Acceptance criteria
- Static look reads as a graded slab; whole slab tilts as one object on hover (no motion without mouse).
- Name, shields, bio and all fallbacks preserved; nothing focusable; no new links.
- Build passes; lint unchanged (2/3); zero brand-name hits.

## Checks
- `npm run build` (frontend/) → PASS
- `npm run lint` (frontend/) → 2 errors / 3 warnings (exact baseline)
- `grep -rniE "psa|upper deck|young guns" frontend/components frontend/app frontend/data` → zero hits
- Dev smoke on :3000 if running; no new server errors.

## Progress / Evidence
- Writer: T1/T2 done. `9105f48` `feat(reactbits): optional content slot for tiltedCard` (backward-compatible `content?: ReactNode`; absent slot keeps prior behavior). Slab commit (this one) rebuilds `CharacterCard` (acrylic case, accent label `Heated Rivalry`/name/`#NNN`/`GEM MINT 10`, white band barcode + HR monogram + cert `80000000 + ordinal*1357911`, rimmed 300x400 art, missing-art panel), tilts with `rotateAmplitude=9` / `scaleOnHover=1.04`, label chrome `aria-hidden`, tooltip dropped; `CharactersSection` map line passes `number={index + 1}`.
- Writer: T3 checks — `npm run build` PASS (`/` prerendered static); `npm run lint` exactly 2 errors / 3 warnings (same Reproducer/Videobackground baseline); brand + focusable greps zero hits; temp dev server on `:3000` returned 200 with 3 cards and correct chrome (`#001/#002/#003`, certs `81357911/82715822/84073733`, eager/lazy art, no `<img>` for Hunter), then stopped. No browser was connected, so hover-tilt was verified by source/SSR only.
- Parent (2026-09-30): verification appended — independent gate on `129aac0`: `npm run build` PASS; `npm run lint` 2/3 (exact baseline, zero new); diff limited to the 4 intended files; RDD off (global) and `gentle-ai review assess` returned high/unassessable (runtime not eligible for immutable receipt review — no review was started, per the disabled switch). Fresh-context independent verifier: ALL PASS — scope, content preservation, accent parity (byte-identical classes), label determinism (`#NNN`, cert `80000000+n*1357911`, pure-CSS barcode), `tiltedCard` backward-compat, SSR sanity (3 articles, certs, 300×400, eager×1, no focusables, perspective), greps zero; no blockers or should-fix items. Not verifiable without a browser: hover tilt feel, sheen, GSAP interplay.
- Dev-state: `next dev` (Next 16.3.6) regenerates `frontend/AGENTS.md` and `frontend/CLAUDE.md` on every run (untracked; currently present while the dev server runs). Disable with `agentRules: false` if undesired.
- Writer: T4 done — `shields` moved onto the art as an `absolute bottom-3 left-3` badge row inside the rim (`relative` added), images 40px via consumer descendant utilities (`[&_img]:h-10/w-10`, `[&>div>div]:p-1/border/rounded-xl`) + `drop-shadow`, each badge fed `ImageRef.alt`; `Shield` gained optional `alt` (default `"Shield"`), info-block row removed, Hunter renders no overlay. Checks on the running `:3000` dev server (not restarted): build PASS, lint 2/3, focusable + brand greps zero, SSR shows 3 imgs (art + 2 data alts) + overlay for Hollander/Rozanov, 0 imgs/none for Hunter, old row gone, Tailwind override rules present in served CSS.
- Parent (2026-09-30, T4): delta verification appended — `npm run lint` re-run = 2/3 (exact baseline) + SSR spot-check on the live server (2 overlay rows, 4 data alts present, old row 0 hits, no leftover `alt="Shield"`); `gentle-ai review assess` (base `31f552b`) → high/unassessable (runtime not eligible for immutable receipt review; RDD off, no review started). Independent verifier (pass 2, same session as pass 1 but scoped to the delta): ALL PASS — scope exactly 3 files, overlay inside the tilt content, conditional per data (Hunter none), row removal clean, `Shield.alt` backward-compatible, no regressions (certs/images/perspective/figcaption), greps zero. Nit: badge sizing couples to Shield's internal DOM via descendant variants (documented). Visual badge feel still pending user acceptance.
- Writer: T5 done — section container is now `flex w-full max-w-6xl flex-col gap-16 px-6 py-24 md:gap-24 md:px-8` (width/padding/`id`/`scroll-mt-28`/`aria-label`/wrapper refs + GSAP entrance untouched); article = a row capped by `md:max-h-[100dvh]` with exactly one direction utility per article (`md:flex-row-reverse` on odd `number`, `md:flex-row` on even), card zone width `min(40%, 75dvh - 18rem)` (Tailwind dropped the redundant `100%` term; 24rem ≈ non-art vertical budget, ×0.75 → 3:4 art width), name centred (`text-center`) directly under the slab inside the card zone, description in its own `w-full md:min-w-0 md:flex-1` column with `max-w-prose` + `md:items-center`; below `md` everything stacks. Checks on the running `:3000` (not restarted): build PASS, lint 2/3, focusable + brand greps zero, SSR shows stack container (no `grid`), mirroring `REVERSE / row / REVERSE`, `max-h-[100dvh]` on all 3, name in DOM order right after `</figure>`, no focusables; certs/alts/eager-lazy/perspective (×3)/no-figcaption unchanged.
- Writer: T5 note — `md:max-h-[100dvh]` is scoped to `md`+ on purpose: on mobile the stacked card+name+bio is taller than the viewport, and an unscoped cap would let the article box clip/overlap the next one.
- Parent (2026-09-30, T5): delta verification appended — `gentle-ai review assess` (base `bbcdd27`) → high/unassessable (runtime not eligible for immutable receipt review; RDD off, no review started); `npm run lint` re-run = 2/3 (exact baseline). Independent verifier (pass 3): PASS overall with one should-fix defect — articles #1/#3 emitted BOTH `md:flex-row` and `md:flex-row-reverse` (rendering correct only via Tailwind CSS order). Corrected in `4272cce` (exactly one direction utility per article: odd `md:flex-row-reverse`, even `md:flex-row`; doc evidence line fixed). Post-fix targeted re-check (parent): per-article class tokens = reverse / plain / reverse, exactly one each; build PASS; dev server untouched. Also re-checked via SSR: section stack (no grid), `md:max-h-[100dvh]` ×3, name right after `</figure>` ×3, `max-w-prose` present. Visual row rhythm/alternation still pending user acceptance.

## Next step
Visual re-acceptance of T5 on the running dev server (`localhost:3000`); after that, slice 5 (motion hardening) or PR-chain planning for the stacked slices.
