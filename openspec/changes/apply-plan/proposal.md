# Proposal: Apply Plan — Data-Driven Single-Page Experience

> sdd-propose artifact for change `apply-plan`. Built on `openspec/changes/apply-plan/explore.md`
> (validated, file/line evidence), `PLAN.md`, `DESIGN.md`, and `openspec/config.yaml`.
> **Language contract:** this artifact is English; **all generated site content and UI copy
> (bios, synopses, section labels, nav, footer, aria-labels, missing-content states) MUST be
> Spanish** per binding decision 2.

## Intent

The landing page today is a hand-authored sequence of character-specific chapters
(`Hollander.tsx`, `Rozanov.tsx`, a `Hunter.tsx` stub) with content hard-coded in JSX,
unscoped global-selector GSAP tweens, no data or type layer, and no seasons, books, or
footer at all. PLAN.md — the user-approved specification — requires a complete,
data-driven single-page experience: a protected hero/header, one unified Characters
roster, a season browser, a books catalog, and a footer, with content separated from
presentation so future updates never touch animation or layout code. This change closes
that gap without inventing canon: every not-yet-supplied piece of content renders as an
explicit Spanish "contenido próximamente" state until the user populates the JSON data
files.

## Binding Product Decisions (user-resolved; verbatim scope authority)

All ten exploration-stage open questions are resolved. The following are **binding**:

1. **Roster:** exactly the 3 existing characters (Hollander, Rozanov, Hunter). Hunter
   ships with explicit missing-content state (no artwork/bio yet).
2. **Content language:** ALL site copy in Spanish (bios, synopses, books, footer).
   Migrate Rozanov's Spanish bio as-is and translate Hollander's English bio to Spanish.
3. **Content source:** typed JSON data files (e.g. `frontend/data/*.json`) that the user
   will populate later; images/logos are referenced by path from `frontend/public/`.
   TypeScript interfaces in `frontend/types/` describe the JSON shape; loaders
   validate/expose typed content. Missing optional content renders explicit Spanish
   "contenido próximamente" states, never invented canon.
4. **Books:** deep links to retailers only — each book entry in JSON has optional
   `purchaseUrl(s)`; no backend, no cart, no fabricated links.
5. **Footer:** static component (logo, internal section navigation, copyright, simple
   credits).
6. **Animation:** install `@gsap/react` and use `useGSAP` with scoped refs for all new
   section animations; keep the existing Header timeline as a protected boundary;
   ownership of its `.hollander` marginTop tween must transfer to the new Characters
   section (document this migration).
7. **Lint:** remediate the existing 7 errors and 13 warnings within this change (they
   live in files being migrated/removed anyway).
8. **Seasons:** structure exists (selector + upper timeline + horizontal episode rail
   with left/right buttons + native overflow); season/episode content comes from JSON,
   empty until user populates it.

## Scope

### In Scope

- `frontend/types/`: typed content interfaces — `Character`, `Season`, `Episode`, `Book`,
  plus supporting types for image sources, links, and purchase providers.
- `frontend/data/*.json`: empty-until-populated content files (roster, seasons,
  episodes, books) with asset paths pointing into `frontend/public/`; typed loader
  modules that validate shapes and expose safe typed access.
- `CharactersSection` + `CharacterCard`: one section rendering all three configured
  characters as informational cards (Hollander and Rozanov with migrated Spanish copy,
  Hunter in an explicit missing-content state); receives ownership of the `.hollander`
  55vh margin contract from the Header timeline.
- `SeasonsSection` with `SeasonSelector`, `SeasonTimeline`, `EpisodeRail`, `EpisodeCard`:
  accessible season selection, upper timeline, horizontal episode rail with prev/next
  buttons, native overflow scrolling, keyboard access, correct disabled boundaries.
- `BooksSection` + `BookCard`: books from JSON with cover, metadata, and optional
  retailer deep links only.
- `Footer`: static component — logo, internal section navigation (anchors), copyright,
  simple credits, Spanish copy.
- Migration of existing content: Rozanov's Spanish bio moved as-is into JSON; Hollander's
  English bio translated to Spanish and moved into JSON; then retire
  `Hollander.tsx`, `Rozanov.tsx`, `Hunter.tsx`, `Bio.tsx`, and dead remnants
  (`CardMobile.tsx`, `Profile.tsx`, unused `hollanderCard.png` import).
- Animation hardening: install `@gsap/react`; all new section timelines via `useGSAP`
  with scoped refs; `prefers-reduced-motion` gating (resting states, scrubbing disabled);
  central Lenis↔ScrollTrigger sync (`lenis.on('scroll', ScrollTrigger.update)`) in
  `LenisProvider.tsx`; `ScrollTrigger.refresh()` after dynamic content/image loads.
- Image policy: migrate `next.config.ts` from deprecated `images.domains` to
  `images.remotePatterns` for `static.wikia.nocookie.net` and `upload.wikimedia.org`
  (interim shield art) until local `public/` replacements are supplied.
- Lint remediation: bring `npm run lint` from the 7-errors/13-warnings baseline to clean
  (target: 0 errors, 0 warnings), mostly by deleting/migrating the offending files.
- Replace the `create-next-app` placeholder metadata in `frontend/app/layout.tsx` with
  real Spanish site title/description.

### Out of Scope

- **Character detail routes or separate detail pages** (single route only).
- **Backend, APIs, cart, or purchase flows** — books are retailer deep links only
  (decision 4: user chose deep links over dropshipping/checkout).
- **Inventing canon**: no fabricated bios, episode titles/dates/artwork, book metadata,
  purchase URLs, or footer destinations — missing content renders "próximamente".
- Replacing Lenis, the audio player (`Reproducer.tsx`), routing model, or the
  `DESIGN.md` visual identity.
- Adding a test framework (strict TDD disabled; none exists today).
- Touching `Header.tsx`'s timeline behavior beyond the single documented `.hollander`
  marginTop step transfer.

## Capabilities

> Contract with sdd-spec. `openspec/specs/` is currently empty, so every capability below
> is NEW; each gets a full spec at `openspec/changes/apply-plan/specs/<name>/spec.md`.

### New Capabilities

- `content-models`: TypeScript interfaces in `frontend/types/` + JSON content files in
  `frontend/data/` + validating loaders; asset references by `public/` path; Spanish
  "contenido próximamente" state contract for missing optional content.
  - AC: character/season/episode/book content exists only in JSON behind typed models;
    loaders reject malformed shapes at the boundary and never crash the page; data
    modules import no components or GSAP.
  - AC: an empty (unpopulated) JSON file renders the corresponding section skeleton with
    Spanish missing-content states, with zero invented values.
- `character-roster`: unified `CharactersSection` rendering every configured character
  (exactly Hollander, Rozanov, Hunter) as an informational card in one section.
  - AC: Rozanov's bio migrated verbatim (Spanish); Hollander's bio translated to Spanish;
    Hunter shows explicit artwork/bio "próximamente" state.
  - AC: no character detail route; the section owns the 55vh top offset formerly tweened
    by `Header.tsx` against `.hollander`, implemented inside its own scoped animation.
- `season-browser`: season selector + upper season timeline + horizontal episode rail
  (prev/next buttons, native overflow) driven entirely by JSON (empty until populated).
  - AC: selecting a season updates the timeline and the episode list below it.
  - AC: rail scrolls natively via touch, keyboard (scroll container focusable with named
    controls, visible `:focus-visible`), and buttons with correct disabled boundaries;
    GSAP never hijacks that overflow.
  - AC: with zero episodes in JSON, the section renders its Spanish "próximamente" state
    without broken controls.
- `book-catalog`: books section with title, cover, metadata, and optional retailer deep
  links (`purchaseUrl(s)`) only.
  - AC: no purchase link is rendered unless present in JSON; no entry without an
    authoritative URL shows any purchase affordance.
- `site-footer`: static footer with logo, internal section navigation, copyright, and
  simple credits, all in Spanish.
- `hero-header`: codifies the protected boundary — the existing scrubbed hero→collapse
  timeline, fixed positioning, video fade, and logo shrink remain functionally unchanged;
  its `.hollander` marginTop step is removed and re-owned by `character-roster`
  (documented migration).
  - AC: post-change scroll behavior is visually identical to today except the margin
    tween now originates from the Characters section.
- `motion-system`: site-wide animation governance — `@gsap/react` `useGSAP` with scoped
  refs for all new sections, client-only registration, cleanup on unmount,
  `prefers-reduced-motion` resting states, Lenis↔ScrollTrigger sync, and
  `ScrollTrigger.refresh()` after layout-affecting loads.
  - AC: zero global class selectors in new animation code; repeated cards animate per
    ref, not per instance-collision.
  - AC: with reduced motion enabled, all content is visible and navigable without
    movement.

### Modified Capabilities

None — `openspec/specs/` contains no existing specs; PLAN.md's `hero-header` "modified"
item is therefore introduced as a new spec codifying the preserved behavior above.

## Approach

Adopt exploration approach 1 (**scaffold-with-explicit-gap-states**): land typed content
models, section shells, and card primitives wired to whatever content is authoritative,
rendering explicit Spanish missing states for everything else. Old chapters migrate into
the data model slice-by-slice; the Header stays protected except for the one documented
tween transfer. Per decision 6, `@gsap/react` is approved and installed, so new sections
use `useGSAP({ scope })` instead of bare `useEffect` + `gsap.context`.

### Content / data architecture contract

- **JSON-as-content-source**: `frontend/data/characters.json`, `seasons.json`,
  `episodes.json` (or episodes nested in seasons), `books.json` — the single place the
  user edits copy and asset paths. Files ship with the three known characters and empty
  arrays for seasons/books until populated.
- **Typed shape**: interfaces in `frontend/types/content.ts` (et al.) mark every
  user-supplied field optional-with-explicit-state (`bio?: string`, `image?: string`,
  `purchaseUrls?: RetailerLink[]`); assets are `public/`-rooted path strings.
- **Validation strategy**: loaders (`frontend/data/` modules) narrow/validate parsed JSON
  against the interfaces with lightweight guards (no new runtime dependency), expose
  typed arrays, and degrade malformed or missing entries to the missing-content state
  rather than throwing at render time.
- **Spanish states**: one shared label constant (e.g. `"Contenido próximamente"`) used
  by every missing slot — cards, rail, catalog — so no component ever renders lorem,
  English placeholders, or invented facts.

### Task-planning guidance (sdd-tasks input)

Estimated ~1,200–1,700 changed lines total; **not viable as one PR**. Forecast as 5
stacked slices, each ≤400 changed lines, merged in this order (each child PR targets the
previous slice branch per stacked-to-main convention):

| # | Slice | Capability coverage | Est. lines |
|---|-------|--------------------|-----------|
| 1 | `content-models`: types + JSON + loaders + shared "próximamente" primitive | content-models | ~300–350 |
| 2 | `character-roster`: section + card, copy migration/translation, `.hollander` transfer, old chapter deletions, lint fixes in migrated/removed files | character-roster, hero-header (start) | ~350–400 |
| 3 | `season-browser`: selector, timeline, episode rail, a11y | season-browser | ~350–400 |
| 4 | `book-catalog` + `site-footer` + metadata polish | book-catalog, site-footer | ~250–350 |
| 5 | `motion-system`: `@gsap/react` wiring pass, reduced motion, Lenis sync, refresh, Header boundary regression guard, remaining lint to zero | motion-system, hero-header (guard) | ~200–300 |

Slices 2–4 ship minimal section-local animation via `useGSAP`; slice 5 is the hardening
pass, so no slice ever depends on "animation later" being a hidden defect. Content values
(book URLs, episode metadata) remain user-populated JSON and never gate a slice's merge.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/types/` | New | `Character`, `Season`, `Episode`, `Book`, image/link/purchase types |
| `frontend/data/` | New | JSON content files + typed validating loaders |
| `frontend/components/CharactersSection.tsx`, `CharacterCard.tsx` | New | Roster section; owns 55vh offset contract |
| `frontend/components/SeasonsSection.tsx`, `SeasonSelector.tsx`, `SeasonTimeline.tsx`, `EpisodeRail.tsx`, `EpisodeCard.tsx` | New | Season browser with native-overflow rail |
| `frontend/components/BooksSection.tsx`, `BookCard.tsx` | New | Catalog with deep links only |
| `frontend/components/Footer.tsx` | New | Static Spanish footer |
| `frontend/components/Header.tsx` | Modified | Remove only the `.hollander` marginTop tween (`Header.tsx:51-54`); timeline otherwise byte-stable |
| `frontend/components/LenisProvider.tsx` | Modified | `lenis.on('scroll', ScrollTrigger.update)` + rAF integration |
| `frontend/app/page.tsx` | Modified | Recompose: Header → Characters → Seasons → Books → Footer; drop dead `Bio` import |
| `frontend/components/Hollander.tsx`, `Rozanov.tsx`, `Hunter.tsx`, `Bio.tsx`, `CardMobile.tsx`, `Profile.tsx` | Removed | Content migrated to JSON/dead; fixes broken `@/public/hollanderCard.png` import |
| `frontend/next.config.ts` | Modified | `images.domains` → `images.remotePatterns` (wikia + wikimedia hosts) |
| `frontend/package.json` / lockfile | Modified | Add `@gsap/react` |
| `frontend/app/layout.tsx` | Modified | Real Spanish metadata |
| `openspec/specs/` (via archive) | New | 7 capability specs land after archive |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 400-line review budget exceeded (~1,200–1,700 lines total across slices) | High | 5 pre-forecast stacked slices (table above); sdd-tasks must carry `Decision needed before apply: Yes`, `Chained PRs recommended: Yes`, `400-line budget risk: High`; per ask-on-risk, no slice is implemented un-split |
| `.hollander` contract transfer: removing Header's marginTop tween could break first-section offset or leave an orphan selector | Medium | Transfer is an explicit, reviewed task in slice 2; CharactersSection re-implements the 55vh offset inside its own scoped `useGSAP`; acceptance test: first-viewport spacing identical pre/post |
| Lenis↔ScrollTrigger desync (none exists today; new dynamic sections multiply staleness) | Medium | Central sync in `LenisProvider` (slice 5, with interim safety in slices 2–4); `ScrollTrigger.refresh()` after content/image/font loads; stable reserved dimensions for cards |
| Deprecated `images.domains` warning on every Next 16.3.6 build; more remote hosts would widen it | High (certain warning) | Migrate to `images.remotePatterns` for the two wikia/wikimedia hosts in slice 2; new artwork is `public/`-path-only, so no allowlist growth |
| Remote artwork fragility (hotlinked wikia URLs can break/rate-limit at runtime) | Medium | Interim only: JSON references `public/` paths as the end state; `next/image` with sized fallback → "próximamente" art state on load error; user swaps in local assets |
| Reduced motion absent today; retrofits land last and get skipped | Medium | `motion-system` is a named capability with its own spec and slice; all new timelines gate behind a shared `usePrefersReducedMotion()` check from slice 2 onward |
| Empty seasons/books/footer sections look "unfinished" to stakeholders | Low | Explicit Spanish "próximamente" states are the *specified* product (decisions 3, 4, 8), not bugs; no canon invention is ever an acceptable fill |
| Deleting `type Props = {}` files mid-change regresses builds | Low | Deletions only after content migration in the same slice; `npm run build` gate per slice |

## Rollback Plan

No persisted state, backend, or migration exists — rollback is pure revert.
Revert in reverse slice order (5 → 1): each stacked PR is an independent `git revert`
of its merge/squash commit on the chain. Reverting slice 1 last restores the legacy
`Hollander`/`Rozanov`/`Hunter` chapter composition by restoring `page.tsx` plus the
deleted components from the base commit. The single riskiest revert point is slice 2's
`.hollander` transfer: rollback restores `Header.tsx` from its base commit (its one
deleted tween step is the exact migration recorded in the spec) and re-adds the old
`Hollander.tsx` that carries the `.hollander` class. `@gsap/react` removal is a one-line
`package.json` revert; the `images.remotePatterns` config change is
behavior-preserving and may remain after any rollback.

## Dependencies

- `@gsap/react` (new npm dependency, MIT; user-approved in decision 6).
- User population of `frontend/data/*.json` and `frontend/public/` artwork — non-blocking
  by design (Spanish "próximamente" states); blocking only for final content sign-off.
- Translated Hollander bio (produced inside this change from the existing English text —
  translation, not invention, and therefore canon-safe).

## Success Criteria

- [ ] Single route composes Header → Characters → Seasons → Books → Footer; audio player
      remains mounted and usable.
- [ ] Hero→Header collapse behavior visually/behaviorally identical; `.hollander` offset
      now owned and correctly applied by the Characters section.
- [ ] Exactly three roster cards: Hollander (Spanish translated bio), Rozanov (Spanish
      bio verbatim), Hunter (explicit Spanish missing-content state); no detail routes.
- [ ] All Character/Season/Episode/Book content flows from validated JSON loaders;
      editing copy requires no component or GSAP edits.
- [ ] Season browser works with empty JSON: selector/timeline/rail render, controls have
      accessible Spanish names, boundaries disable correctly, native overflow works with
      touch + keyboard.
- [ ] Books render retailer deep links only when present in JSON; zero fabricated URLs.
- [ ] Footer present: logo, section anchors, copyright, credits — Spanish.
- [ ] All new animation uses `useGSAP` with scoped refs, is client-only, cleans up, and
      honors `prefers-reduced-motion`; Lenis drives `ScrollTrigger.update`; no global
      selectors outside the protected Header.
- [ ] `npm run build` passes; `npm run lint` reaches **0 errors / 0 warnings** (baseline
      7/13 fully remediated); no `images.domains` deprecation warning in build output.
- [ ] Every merged slice's PR diff ≤ 400 changed lines (stacked-to-main chain of ~5 PRs).
