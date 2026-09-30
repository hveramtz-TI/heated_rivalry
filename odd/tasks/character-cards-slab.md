# ODD Tasks: Character Cards Slab Redesign

Feature: `character-cards-slab` · Branch: `feat/character-cards-slab` (stacked on `feat/apply-plan-4-books-footer` @ dab650f) · Created: 2026-09-30

## Objective
Restyle the three roster cards (`CharacterCard`) into a graded trading-card "slab" aesthetic: an acrylic case with an accent label strip and a graded inner card (the character art), per user request (reference: PSA-graded card image).

## Problem / Why
The user wants the roster cards to look like a graded card in a slab. Product decision (user-confirmed, 2026-09-30): **site identity only** — no real brand marks or names ("PSA", "Upper Deck", "Young Guns"). Decorative label chrome (card number, grade, cert, barcode) is fictional, deterministic, and derived in-component.

## Scope
- **In:** `frontend/components/cards/CharacterCard.tsx` (rebuild); minimal backward-compatible extension of `frontend/components/reactbits/tiltedCard.tsx` (optional content slot so the whole slab tilts as one object); one-line ordinal prop pass in `frontend/components/sections/CharactersSection.tsx` (existing map only).
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
- (pending — parent appends verification)

## Next step
T1 implementation by delegated writer.
