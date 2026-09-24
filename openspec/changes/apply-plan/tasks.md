# Tasks: Apply Plan — Data-Driven Single-Page Experience

> sdd-tasks artifact for change `apply-plan`. Derived from `proposal.md` (5-slice
> mapping), the 7 delta specs under `specs/`, `design.md` (D1–D8 + File Changes
> table), and `explore.md`. **Artifact language: English; all site copy produced
> by these tasks (bios, labels, aria-names, footer) is Spanish** per binding
> decision 2.
>
> **Path authority:** design D1 (`components/sections/`, `components/cards/`,
> `lib/`, `data/guards.ts`) supersedes the proposal's flatter "Affected Areas"
> paths. All commands run from `frontend/` unless stated otherwise.
>
> **Verification regime (no test framework exists — do not add one):** per task
> = `npm run build` + `npm run lint`; per slice = the grep checklist below plus
> manual browser acceptance (`npm run dev`) where relevant. Lint baseline
> 7 errors / 13 warnings (`openspec/testing-capabilities.md` (read-only) rows
> 41–43) → target 0 / 0 at slice-5 exit. Threat matrix is **N/A** (design), so
> there are no RED-test tasks.
>
> **Shared slice-exit grep suite** (run at every slice boundary; each spec
> scenario names its own grep):
> - `grep -rn "from \"@/components" frontend/types frontend/data` → zero hits (import purity)
> - `grep -rn "gsap" frontend/types frontend/data` → zero hits
> - `grep -rn "Contenido próximamente" frontend --include="*.tsx" --include="*.ts"` → only `frontend/data/ui.ts`
> - `grep -n "hollander" frontend/components/Header.tsx` → zero hits after slice 2a
> - `grep -rn "lenis.on(\"scroll\"" frontend/components` → exactly one hit (LenisProvider) after slice 5

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,500–1,900 (additions+deletions; lockfile excluded as generated) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2a → PR 2b → PR 3 → PR 4 → PR 5 (6 stacked slices; slice 2 split for budget) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

> **Per-slice line forecast** (grounded in the design File Changes table and
> measured legacy sizes — Hollander 98, Rozanov 110, Hunter 16, Bio 14,
> CardMobile 12, Profile 15, Separator 19, Header 84, LenisProvider 24,
> page 19, layout 39, next.config 13, tiltedCard 151, Reproducer 78,
> Videobackground 22):
>
> | Slice | Est. changed lines | ≤400? | Contingency seam |
> |-------|-------------------|-------|------------------|
> | 1 content-models | ~320–400 | Yes (tight) | If diff >400: PR 1a `types/`+`data/` (~285), PR 1b `lib/motion.ts`+`lib/images.ts` (~80) — both purely additive |
> | 2a roster build | ~280–350 | Yes | — (mandatory split of slice 2) |
> | 2b retire legacy | ~265–290 | Yes (pure deletions) | — |
> | 3 season-browser | ~360–430 | **Borderline** | If diff >400: PR 3a markup+empty-states (`SeasonsSection`/`SeasonSelector`/`SeasonTimeline`/`EpisodeCard`, ~230–270), PR 3b interaction (`EpisodeRail` logic, transitions, a11y polish, ~130–170) |
> | 4 books+footer+metadata | ~230–300 | Yes | — |
> | 5 motion hardening | ~140–220 | Yes | — |
>
> Slice 2 **must** ship as two stacked PRs (2a creates + transfers, 2b deletes):
> combined ~545–640 lines exceeds the budget in one diff. Every sub-PR remains
> a coherent, independently revertible unit per work-unit-commits.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Typed content layer: types + JSON + guards + loaders + label + motion/images libs; zero page impact | PR 1 | `npm run build && npm run lint` (+import-purity greps) | N/A — no runtime surface yet; verified by compile + source inspection (design D3 accepts build-time JSON syntax gate) | `git revert` of PR 1 squash commit; nothing else references the new files |
| 2a | Characters roster mounts; Spanish copy migrated into JSON; `.hollander` 55vh contract transferred; Header minus 4 lines; page recomposed | PR 2a | `npm run build && npm run lint` | `npm run dev` → side-by-side hero-scroll parity vs base commit (desktop + reduced-motion emulation) | Revert PR 2a **as one commit** (Header lines + offset wrapper must revert together, design Migration note); page falls back to legacy chapters |
| 2b | Legacy chapters/dead files deleted; their lint offenses disappear | PR 2b | `npm run build && npm run lint` | `npm run dev` → page renders unchanged from 2a | Revert PR 2b restores deleted files from base; build passes because 2a already dropped their consumers |
| 3 | Full season browser: selector/timeline/rail/cards, native overflow, boundaries, a11y, empty states | PR 3 (seam 3a/3b if >400) | `npm run build && npm run lint` | `npm run dev` → keyboard-only + touch-emulation rail pass; empty-JSON state; AT walkthrough | Revert PR 3 removes `components/sections/Season*` + `Episode*` + the page.tsx mount line; data layer untouched |
| 4 | Books catalog + Footer + real Spanish metadata; final page composition | PR 4 | `npm run build && npm run lint` | `npm run dev` → footer anchor landings (native jump acceptable pre-5), empty-catalog state, `lang="es"` | Revert PR 4 removes Books/Footer/layout-metadata edits; page.tsx returns to Header→Characters→Seasons |
| 5 | Motion governance: `@gsap/react`, Lenis↔ScrollTrigger sync, refresh strategy, `remotePatterns`, surviving-file lint to 0/0 | PR 5 | `npm run build && npm run lint` (must be 0/0) | `npm run dev` → full-page reduced-motion emulation; scrub smoothness; anchor smoothing; image optimizer still serves shields | Revert PR 5 restores old LenisProvider/config; `remotePatterns` revert is optional (behavior-preserving, may survive any rollback) |

## Commit & Chain Guidance (all slices)

- **stacked-to-main:** branch per slice (`feat/apply-plan-1-content-models`,
  `-2a-roster-build`, `-2b-retire`, `-3-seasons`, `-4-books-footer`,
  `-5-motion`). Each child PR targets the previous slice's branch; merges flow
  to `main` in order 1 → 2a → 2b → 3 → 4 → 5. Rebase each child when its base
  merges.
- **Work-unit commits:** inside a branch, commit per logical unit with
  conventional-commit messages (`feat(...)`, `refactor(...)`, `chore(...)`,
  `build(...)`, `content(...)` as appropriate); squash-merge each PR so the
  merge commit == the rollback unit. No AI attribution lines.
- **Commit artifacts with code:** the slice's `[x]` checkbox updates in this
  `tasks.md` ride in that slice's final commit (per work-unit-commits), keeping
  progress next to the diff that earned it.
- Never mix slices: slice-N-only files stay out of slice-M branches.

---

## Slice 1: content-models — typed data layer (PR 1, additive, zero page impact)

Specs: content-models (all five requirements). Depends on: nothing. Creates the
layer every later slice imports.

- [ ] 1.1 Create `frontend/types/content.ts` with the exact Interfaces/Contracts surface from design D2/D3: `ImageRef`, `RetailerLink`, `CharacterAccent` (`"rivalryRed" | "electricBlue" | "neutral"`), `Character`, `Episode`, `Season`, `Book` — every user-supplied content field optional, asset fields typed as path strings. `types/` imports nothing. Spec: content-models — "Typed Content Interfaces" (scenarios: strict compile; absent content representable). Verify: `npm run build` (tsc via Next passes; no implicit-any in `frontend/types/`).
- [ ] 1.2 Create `frontend/data/ui.ts` exporting the single shared constant `MISSING_CONTENT_LABEL = "Contenido próximamente"` (Spanish site copy per decision 2; this literal is the one allowed occurrence repo-wide). Spec: content-models — "Shared Spanish Missing-Content State" (scenario: single source of the label). Verify: grep the literal across `frontend/` → only this file; `npm run build && npm run lint`.
- [ ] 1.3 Create `frontend/lib/images.ts` exporting `ALLOWED_REMOTE_HOSTS = ["static.wikia.nocookie.net", "upload.wikimedia.org"] as const` — the one allowlist consumed later by `guards.ts` (this slice) and `next.config.ts` (slice 5). Spec: motion-system — "Image Allowlist Migrated To remotePatterns" (allowlist-single-source half; config migration itself is 5.4). Verify: `npm run build`.
- [ ] 1.4 Create `frontend/data/guards.ts` with hand-written, never-throwing validators per design D3: `isRecord`, `asString` (non-empty trimmed), `asAssetPath` (leading-slash public path OR `https://` URL whose hostname ∈ `ALLOWED_REMOTE_HOSTS` from `frontend/lib/images.ts` (read-only)), `asIsoDate`, and a numeric coercion helper for `Episode.number` / `Book.pages`. No new runtime dependency (zod rejected in D3). Spec: content-models — "Validating Loaders With Fail-Soft Degradation" (boundary half). Verify: `npm run build && npm run lint` (new files contribute 0 offenses).
- [ ] 1.5 Create `frontend/data/characters.json` with exactly the 3 known characters (decision 1): full entries for `hollander`/`rozanov` carrying `name`, `portrait` + `cardArt` as public-rooted web paths (leading-slash values pointing at `frontend/public/hollanderCard.jpg` — the correct `.jpg`, killing the `hollanderCard.png` typo contract), `accent`, and `shields` as `ImageRef[]` with the existing remote URLs and **Spanish** `alt` text (e.g. "Escudo del Montreal Metros"); `bio` fields **omitted** (copy migration is task 2.2); `hunter` entry is `{"id":"hunter","name":"Hunter"}` only. Plus create `frontend/data/seasons.json` and `frontend/data/books.json` shipping `[]` (decision 8: structure exists, content user-populated). Spec: content-models — "JSON As The Single Content Source"; character-roster — "Migrated Spanish Copy" (roster-completeness half). Verify: `npm run build` (Turbopack static JSON import resolves; malformed JSON is an accepted build-time failure per D3).
- [ ] 1.6 Create the three loader modules `frontend/data/characters.ts`, `frontend/data/seasons.ts`, `frontend/data/books.ts` exporting `getCharacters(): Character[]`, `getSeasons(): Season[]`, `getBooks(): Book[]` — pure, synchronous, never-throwing; per-entry `normalize*` that validates each field independently (non-object or zero-recognizable-fields entry degrades to `{ id: "char-<i>" }`-style gap entry, **never dropped**, so array length always equals JSON length; seasons/episodes use the same pattern with `episodes: []` on absence/invalid). Validation runs inside the exported functions, not at module scope (D3). Spec: content-models — "Validating Loaders With Fail-Soft Degradation" (scenarios: well-formed / malformed fails soft / empty file renders skeleton); "Data Layer Independence" (loaders import only `@/types/content`, `./guards`, `./<file>.json`). Verify: `npm run build && npm run lint`; inspection: no throw path, no `@/components` or `gsap` imports.
- [ ] 1.7 Create `frontend/lib/motion.ts` (design D7): `getPrefersReducedMotion()` (SSR-safe `matchMedia` wrapper, false on server), `usePrefersReducedMotion()` (state + change listener), `requestScrollTriggerRefresh()` (module-level ~100 ms debounced `ScrollTrigger.refresh()`). This is the **single** reduced-motion gate every new timeline consumes from slice 2 onward. Spec: motion-system — "Reduced-Motion Resting States" (scenario: gate is shared, not duplicated) — creation half; slice 5 wires/audits consumers. Verify: `npm run build && npm run lint`.
- [ ] 1.8 Slice 1 exit gate + commit: run the shared grep suite (import purity of `frontend/types/` and `frontend/data/`; label single-source). `npm run build` passes; `npm run lint` stays at the 7/13 baseline (new files add **zero** offenses). Commit on branch `feat/apply-plan-1-content-models` as PR 1 (conventional commit, e.g. `feat(content): typed JSON data layer, guards, loaders, shared motion gate`). If the diff lands >400 lines, split at the forecast seam (1a types+data / 1b lib files).

## Slice 2a: character-roster — build, migrate, transfer (PR 2a)

Specs: character-roster (all six requirements), hero-header (margin-step removal),
content-models consumption. Depends on: Slice 1 merged.

- [ ] 2.1 Adapt `frontend/components/reactbits/tiltedCard.tsx` in place (design D4): (a) raw `motion.img` → `motion.create(Image)` (next/image with explicit `width`/`height` + `sizes`) so `public/` art and allowlisted remote shields pass the optimizer; (b) mobile warning default-off (`showMobileWarning = false`) and notice text becomes a prop — no hard-coded English remains; (c) `imageSrc` widens to `string | undefined` and renders a fixed-aspect `aspect-[3/4]` placeholder panel with `MISSING_CONTENT_LABEL` and **no `<img>` element** (Hunter state). **Spike first** (design Open Question 3): confirm `motion.create(Image)` on React 19; documented fallback = keep `<motion.img>` for remote shields only, local art via sibling next/image. Spec: character-roster — "Cards Are Informational Only"; content-models — "Shared Spanish Missing-Content State". Verify: `npm run build`; dev-server hover on a temporary usage or Storybook-free scratch check (no new dev-only files committed).
- [ ] 2.2 Migrate Spanish copy into `frontend/data/characters.json`: Rozanov's bio from `frontend/components/Rozanov.tsx` (read-only; lines 91–93) **verbatim** (no rewording); Hollander's bio translated from `frontend/components/Hollander.tsx` (read-only; lines 89–91) — translation only, no facts added or omitted. Hunter gains no content fields. Spec: character-roster — "Migrated Spanish Copy" (scenarios: verbatim / translated / Hunter gap state). Verify: manual text diff vs the two source files; `npm run build`; grep that no bio literals appear in any `.tsx` (content-models "No canon literals").
- [ ] 2.3 Create `frontend/components/cards/CharacterCard.tsx` (design D4 layout): flat accent-gradient field (`rounded-[15px]`, no visible border), TiltedCard art slot (`loading="lazy"` except first card), name (`text-4xl md:text-6xl font-bold`), shields row via existing `frontend/components/Shield.tsx` (read-only; reused, not modified) omitted entirely when `shields` is absent/empty, bio or per-slot `MISSING_CONTENT_LABEL`. Props-typed `Character`; no links/buttons/handlers; all text permanently visible; tooltip `captionText` = character name only when `cardArt` exists; unknown/absent accent → `"neutral"`. Spec: character-roster — "Cards Are Informational Only"; "One Data-Driven Roster Section". Verify: `npm run build && npm run lint`.
- [ ] 2.4 Create `frontend/components/sections/CharactersSection.tsx` (`"use client"`; design D6): `<section id="personajes" className="scroll-mt-28 overflow-hidden …">` > offset `div` > cards grid from `getCharacters()`. Owns the 55vh contract: `useGSAP(() => {…}, { scope: rootRef })` with ScrollTrigger on the **unmarginated section root** (`start: "top top"`, `end: "+=50%"`, `scrub: true`) tweening `marginTop: "55vh"` (`ease: "power1.out"`) on the **inner wrapper** — margin never on the trigger element (feedback-loop guard, design Risks). Reduced-motion branch: `gsap.set(offsetRef, { marginTop: "55vh" })`, no scrub. Entrance tweens target card-wrapper refs only (opacity/y), per-card, never global selectors. Spec: character-roster — "One Data-Driven Roster Section", "Ownership Of The 55vh Offset Contract" (both scenarios incl. reduced motion); motion-system — "Scoped useGSAP For All New Animations". Verify: `npm run build && npm run lint`; grep: no `.hollander`, no unscoped selectors in the new file.
- [ ] 2.5 In `frontend/components/Header.tsx` delete **exactly** lines 51–54 — the trailing `.to(".hollander", { marginTop: "55vh" … })` step (the preceding step keeps its `, 0)` position; cleanup block stays; byte-stable otherwise, protected boundary). Spec: hero-header — "Single Documented Margin-Step Removal"; "Protected Hero→Collapse Timeline Behavior" (scenario: timeline integrity by inspection). Verify: `git diff` of Header.tsx shows only the 4-line deletion; `npm run build`.
- [ ] 2.6 **Decision needed before apply: Yes** — D6 `end: "+=50%"` tuning verification (design Open Question 1), performed during this slice: run `npm run dev`, render base commit and this branch side by side, scroll the hero slowly, and confirm the offset growth window visually matches the old Header-driven scrub. **The concrete choice to make:** keep the literal `end: "+=50%"` or replace it with the tuned value (e.g. `"+=55%"` or a pixel end) that achieves parity — acceptance is visual parity, not constant match (character-roster "Spacing identical after transfer"). Record the chosen value in the PR description and mark this task with it. Do not merge slice 2 with an unverified offset.
- [ ] 2.7 Recompose `frontend/app/page.tsx`: drop imports of `Hollander`, `Rozanov`, `Hunter`, `Separator`, and the dead `Bio` import (fixes its unused-import warning); mount Header → CharactersSection (interim composition; Seasons/Books/Footer land in slices 3–4 — the full-header-to-footer route manifest scenario is a slice-4 completion criterion, not verifiable here). `page.tsx` stays a Server Component. Spec: character-roster — "One Data-Driven Roster Section" (scenario: rebuild the page composition, progressive). Verify: `npm run build` route summary lists the root route only (character-roster "No Character Detail Routes" — no detail route added).
- [ ] 2.8 Slice 2a exit gate + commit: browser parity checklist — hero collapse visually identical (hero-header scenario); first-section spacing identical pre/post at settled state (task 2.6 value); three cards render (Hollander Spanish translated bio, Rozanov verbatim, Hunter all-slots label); no console errors; player still mounted. `npm run build && npm run lint` — lint may only **shrink** (Bio warning fixed); legacy files still present keep their offenses until 2b. Commit PR 2a (`feat(characters): data-driven roster with migrated Spanish copy; transfer .hollander offset`). The Header-deletion + CharactersSection-offset tasks (2.4/2.5/2.7) must be one revertible merge unit.

## Slice 2b: character-roster — retire legacy chapters (PR 2b, pure deletions)

Depends on: Slice 2a merged (consumers already dropped; content already
migrated — deletions never precede migration, proposal risk table).

- [ ] 2.9 **Decision needed before apply: Yes** — Separator.tsx deletion scope (design Open Questions item 2). Deleting `frontend/components/Separator.tsx` is NOT in the proposal's removal list but falls out of the 2.7 recomposition + the 0/0 lint mandate (it holds 1 of the 7 baseline `type Props = {}` errors and is unrendered dead code). **The concrete choice to make:** (a) **delete it in task 2.10** (design's honest-remediation recommendation — dead code holding a lint error), or (b) **keep it** and take the documented fallback: a lint-only Props fix deferred to task 5.7, leaving the file unused. Record the decision here; the downstream task (2.10 inclusion vs 5.7) depends on it.
- [ ] 2.10 Delete the retired components — `frontend/components/Hollander.tsx` (its broken `@/public/hollanderCard.png` import and the `.hollander` class die here), `frontend/components/Rozanov.tsx`, `frontend/components/Hunter.tsx`, `frontend/components/Bio.tsx`, `frontend/components/CardMobile.tsx`, `frontend/components/Profile.tsx`, plus `frontend/components/Separator.tsx` **only if 2.9 chose deletion**. Public assets (`separator.jpg`, orphan `44ab2a59-*.jpg`) stay — asset deletion is user territory (design File Changes note). Spec: character-roster — "Retirement Of Legacy Chapter Components" (scenario: clean build after deletions). Verify: `npm run build` (zero unresolved imports).
- [ ] 2.11 Slice 2b exit gate + commit: `npm run build && npm run lint`; expected lint shrink — remaining offenses originate ONLY from surviving files (`Reproducer.tsx`, `Videobackground.tsx`, and `Separator.tsx` if 2.9 kept it). Run `npm run lint` and record the exact counts in the PR description as the handoff baseline for slices 3–5 ("no growth" gate). Grep suite: `.hollander` gone from `frontend/components/`; no bio/episode/book literals anywhere in `frontend/components/`. Dev-server smoke: page unchanged from 2a. Commit PR 2b (`refactor(characters)!: retire legacy chapter components after JSON migration`).

## Slice 3: season-browser (PR 3; split seam 3a/3b if diff >400)

Specs: season-browser (all seven requirements); motion-system consumption
(scoped useGSAP, shared RM gate, refresh helper). Depends on: Slices 1–2
(loaders for `Season`; label constant; `lib/motion.ts`).

- [ ] 3.1 Create `frontend/components/sections/SeasonSelector.tsx` (design D5): `fieldset > legend` with native `input type="radio"` (`peer sr-only`) + `<label>` pills — free keyboard arrow-group operation; option names come from season `name` only (absent → `MISSING_CONTENT_LABEL`, never "Season 1" invention); with zero seasons renders one disabled option showing the label. Spanish accessible names throughout. Spec: season-browser — "Season Selection Updates Timeline And Episodes" (keyboard scenario), "Empty-Until-Populated Season Browser", "Accessible Section Landmark And Headings". Verify: `npm run build && npm run lint`; keyboard tab-through in dev.
- [ ] 3.2 Create `frontend/components/sections/SeasonTimeline.tsx`: static `<ol>` of season nodes from props with `aria-current="true"` active indication (transform-only active animation allowed); empty seasons → bare track, no nodes, no error. Spec: season-browser — "Season Selection Updates Timeline And Episodes". Verify: `npm run build`.
- [ ] 3.3 Create `frontend/components/cards/EpisodeCard.tsx`: fixed-width snap child (`w-[280px] md:w-[320px] shrink-0 snap-start`) with reserved slots — artwork (next/image sized; absent → `MISSING_CONTENT_LABEL` panel; remote `onError` → same panel per D8), number, `title`, `airDate` formatted via `Intl.DateTimeFormat("es")`, `synopsis` — every empty slot consumes `MISSING_CONTENT_LABEL`; no content literals; receives `Episode` by props (never imports `@/data` except `@/data/ui`). Spec: season-browser — "JSON-Driven Browser Structure"; content-models — "Shared Spanish Missing-Content State". Verify: `npm run build && npm run lint`.
- [ ] 3.4 Create `frontend/components/sections/EpisodeRail.tsx` (design D5 — the interaction core): container `overflow-x-auto snap-x snap-mandatory scrollbar-hidden` + `data-lenis-prevent` + `tabIndex={0}` + `role="region"` + `aria-label="Listado de episodios"`; if Tailwind offers no `scrollbar-hidden` utility, add it in `frontend/app/globals.css` (tiny edit). Prev/next plain buttons with `aria-label="Episodios anteriores"` / `"Episodios siguientes"`, `focus-visible:ring-2` on rail+buttons, `scroll-padding-right` on the rail. `update()` boundary logic (1px tolerance; `max ≤ 1` ⇒ both disabled) driven by passive `scroll` listener (rAF-throttled), `ResizeObserver` on rail + content row, on mount, and after every season switch; activation = `scrollBy({ left: ±(firstCard.offsetWidth + columnGap), behavior: reduced ? "auto" : "smooth" })`. Empty state: label panel + both buttons disabled (not removed). **Hard rule: never tween `scrollLeft`; no pin/`containerAnimation`/wheel-preventDefault.** Documented fallback: switch `snap-mandatory` → `snap-proximity` if trailing-edge sticking appears on mobile emulation (design Open Question 2). Spec: season-browser — "Native Overflow Scrolling Preserved" (all three scenarios), "Prev/Next Buttons With Correct Boundary States" (all three), "Empty-Until-Populated Season Browser". Verify: `npm run build && npm run lint`; grep the file for `scrollLeft` as tween target → none.
- [ ] 3.5 Create `frontend/components/sections/SeasonsSection.tsx` (`"use client"`; `id="temporadas"`, `scroll-mt-28`): owns `useState(selectedId)` defaulting to first season id; data via `getSeasons()`; composes SeasonSelector / SeasonTimeline / EpisodeRail by props (rail owns scrolling, not data). `useGSAP({ scope: rootRef, dependencies: [selectedId] })`: entrance timeline `start: "top 75%"`, `toggleActions: "play none none none"`, opacity/y stagger on card wrappers only; season-transition `fromTo` top-level tween (0.3 s, 0.04 stagger) skipped entirely under `getPrefersReducedMotion()`; call `requestScrollTriggerRefresh()` after the transition settles and wire it to card image `onLoad`. Section heading "Temporadas" (Spanish chrome lives here, not in `data/`). Spec: season-browser — "Season Transition Motion" (reduced-motion + non-trapping scenarios), "Accessible Section Landmark And Headings"; motion-system — "Refresh After Layout-Affecting Changes" (season-switch scenario). Verify: `npm run build && npm run lint`.
- [ ] 3.6 Mount `<SeasonsSection />` after Characters in `frontend/app/page.tsx`. Spec: character-roster — "One Data-Driven Roster Section" (composition progresses toward Header→Characters→Seasons→Books→Footer). Verify: `npm run build`.
- [ ] 3.7 Slice 3 exit gate + commit: browser acceptance on the empty (`[]`) seasons.json — heading + label render, selector + both buttons disabled, zero console exceptions, page scroll unaffected (season-browser "Empty seasons" scenario); temporarily populate `frontend/data/seasons.json` (read-only acceptance fixture — revert before commit) with 2 seasons × 4 episodes to verify selection switches timeline+rail, boundaries disable correctly at both ends, touch/keyboard/buttons scroll natively, focus-visible rings present; reduced-motion emulation → instant resting states. `npm run build && npm run lint` (no new offenses vs 2b's recorded counts). Commit PR 3 (`feat(seasons): season browser with accessible native-overflow episode rail`). If diff >400, split per the forecast seam (3a = 3.1–3.3+3.5+3.6 shells; 3b = 3.4 rail logic + 3.7 acceptance).

## Slice 4: book-catalog + site-footer + metadata (PR 4)

Specs: book-catalog (all four requirements), site-footer (all four),
layout metadata (design File Changes). Depends on: Slices 1–3.

- [ ] 4.1 Create `frontend/components/cards/BookCard.tsx`: title, cover (next/image sized; absent → `MISSING_CONTENT_LABEL` slot; supplied title still displays), metadata (`published` via `Intl.DateTimeFormat("es")`, `pages`), description slot; **retailer links render iff `purchaseUrls` entries exist in JSON** — each as `<a href={url}>` with Spanish accessible name marking it an external destination (e.g. "Comprar en <provider> (enlace externo)"); zero affordance when the array is absent/empty (not a disabled button, not a placeholder URL). Props-typed `Book`. Spec: book-catalog — "JSON-Driven Book Cards" (missing-cover scenario), "Retailer Deep Links Only When Authoritative" (both scenarios), "Spanish Catalog Copy And Missing Metadata". Verify: `npm run build && npm run lint`.
- [ ] 4.2 Create `frontend/components/sections/BooksSection.tsx` (`"use client"`; `id="libros"`, `scroll-mt-28`, heading "Libros"): grid from `getBooks()`; `[]` → heading + shared-label panel, no card shells; scoped `useGSAP` entrance (opacity/y on wrappers) gated by `getPrefersReducedMotion()`; image `onLoad` → `requestScrollTriggerRefresh()`. Spec: book-catalog — "JSON-Driven Book Cards" (empty-catalog scenario); motion-system — "Scoped useGSAP For All New Animations". Verify: `npm run build && npm run lint`; grep: no hard-coded retailer URL / cart / checkout anywhere (`grep -rniE "cart|checkout|amazon|bookdepository" frontend/components frontend/data` → hits only from user-supplied JSON in dev, none committed).
- [ ] 4.3 Create `frontend/components/sections/Footer.tsx`: static (zero `@/data` imports), site logo, `<nav>` with in-page anchors `#personajes` / `#temporadas` / `#libros` — targets match the ids created in slices 2–4 (Lenis smooth scrolling of these anchors arrives in 5.2; today they land via native jump — still fully functional), Spanish copyright line and simple credits (site identification/attribution only; no entity names absent from the repo), `focus-visible` states, mobile→desktop reflow. Spec: site-footer — all four requirements ("No invented destinations" grep: every `href` starts with `#`). Verify: `npm run build && npm run lint`.
- [ ] 4.4 Modify `frontend/app/layout.tsx`: replace the `create-next-app` placeholder metadata with real Spanish site title + description, and set `<html lang="es">` (baseline found `lang="en"`; content language per decision 2). Reproducer/LenisProvider mounting untouched (hero-header "Persistent Audio Player Contract"). Spec: proposal Success Criteria (metadata item); site-footer copy-consistency rationale. Verify: `npm run build`; dev: `<title>`/`<html lang>` inspected.
- [ ] 4.5 Modify `frontend/app/page.tsx` to the **final composition**: Header → CharactersSection → SeasonsSection → BooksSection → Footer (Reproducer stays mounted via layout). Spec: character-roster — "One Data-Driven Roster Section" (full route scenario); hero-header — "Persistent Audio Player Contract" (survives restructure). Verify: `npm run build` route summary equals the root route only; scroll top-to-bottom in dev.
- [ ] 4.6 Slice 4 exit gate + commit: empty-catalog acceptance (`books.json` `[]` → label state, zero console noise); temporarily populate `frontend/data/books.json` (read-only acceptance fixture — revert before commit) with one linked + one unlinked entry to verify link-iff-present and external accessible name; footer anchors land with headings clear of the 100px fixed header (`scroll-mt-28` does this independent of Lenis); keyboard pass through footer in reading order. `npm run build && npm run lint` (no growth). Commit PR 4 (`feat(site): books catalog, footer, real Spanish metadata`).

## Slice 5: motion-system hardening (PR 5 — governance pass, config, lint to zero)

Specs: motion-system (all six requirements), hero-header (guard). Depends on:
slices 1–4 merged. This is the final PR; it owns the 0/0 lint exit.

- [ ] 5.1 Install `@gsap/react` (decision 6): `npm install @gsap/react` — touches `frontend/package.json` + lockfile (lockfile is generated; excluded from the 400-line authored count). Spec: motion-system — "Scoped useGSAP For All New Animations" (dependency-at-boundary scenario). Verify: `npm run build && npm run lint`; static prerender of the root route succeeds (registration client-only).
- [ ] 5.2 Rewrite `frontend/components/LenisProvider.tsx` to the design-D7 canonical form: `gsap.registerPlugin(ScrollTrigger)` at module top; under `usePrefersReducedMotion()` → **no Lenis instance at all** (native instant scroll); else `new Lenis({ lerp: 0.1, anchors: true })` + **exactly one** `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add(onTick)` (replaces the hand-rolled rAF; `gsap.ticker.lagSmoothing(0)`) + `ScrollTrigger.refresh()` on `window load` and `document.fonts.ready` + full cleanup (`removeEventListener`, `ticker.remove`, `lenis.destroy`). No `scrollerProxy` (deliberately skipped, D7). **Behavior check** (design Open Question 4): verify `anchors: true` smooth-hashes on 1.3.17 with the fixed header; documented fallback = context-exposed `lenis.scrollTo(hash)` on footer click — never `preventDefault` duplication. Spec: motion-system — "Central Lenis↔ScrollTrigger Sync" (+ sync scenario), "Refresh After Layout-Affecting Changes". Verify: grep `lenis.on("scroll"` → exactly one hit repo-wide; dev: scrubbed Header + section reveals track scroll with no stuck playheads; footer anchors smooth.
- [ ] 5.3 `useGSAP` wiring audit across slices 2–4: confirm every new timeline in `frontend/components/sections/` uses `useGSAP` with `{ scope: rootRef }`, cleanup is automatic, triggers attach to top-level timelines only, per-card tweens target refs, every timeline branches on the shared `getPrefersReducedMotion()`, and `requestScrollTriggerRefresh()` is called from season transitions + card `onLoad`s (wired in 3.4/3.5/4.2 — this task is review + fixes, expected near-zero diff; add the missing call anywhere found absent). Registration order guard: `gsap.registerPlugin(useGSAP, ScrollTrigger)` at module top of each consumer. Spec: motion-system — "Scoped useGSAP", "Guaranteed Cleanup On Unmount" (season-switch re-mount scenario: no console errors afterwards), "Reduced-Motion Resting States" (full-page scenario). Verify: grep suite — zero global class selectors in new animation code, one matchMedia source (`frontend/lib/motion.ts`); DevTools reduced-motion emulation → entire page readable/navigable with zero movement; season-switch unmount check.
- [ ] 5.4 Migrate `frontend/next.config.ts` from `images.domains` to `images.remotePatterns` generated from `ALLOWED_REMOTE_HOSTS` in `frontend/lib/images.ts` (design D8; `pathname: "/**"`). **Placement note:** the design's Migration paragraph suggested this in S2; this plan follows the session delivery mapping and ships it here — interim builds keep the deprecated-but-working `domains` config, so no slice depends on the move. The `frontend/components/Hollander.tsx`/`Rozanov.tsx` remote-shield consumers are gone (2b), but shield art still flows through JSON → TiltedCard/Shield via next/image, keeping the allowlist exercised. Spec: motion-system — "Image Allowlist Migrated To remotePatterns" (both scenarios). Verify: `npm run build` output contains **no** `images.domains` deprecation warning; dev: shields render through the optimizer; request to a non-allowlisted host rejected.
- [ ] 5.5 Lint-only fix in `frontend/components/Reproducer.tsx` (protected boundary exception per design): drop `type Props = {}` + unused `props` (signature becomes `() =>`); add the missing dep — `useEffect` deps `[playing]` → `[playing, pausedAt]`. **pausedAt safety analysis (must be restated in the PR description):** `pausedAt` changes only while `playing === false` (pause handler), and the effect body arms the timer only when `playing === true`; the closure captured on the `playing→true` transition already holds the latest `pausedAt`, so the re-arm on the `playing→false` change hits the early-return and is a proven no-op — playback behavior unchanged; the fix removes the stale-closure class of defect (resume offset) rather than introducing one. Playback logic, magic offsets, Spanish labels, mount point all untouched. Spec: hero-header — "Persistent Audio Player Contract" (survives + stacking scenarios). Verify: dev: play → pause → resume preserves position and never double-advances; volume works; `npm run lint`.
- [ ] 5.6 Lint-only fix in `frontend/components/Videobackground.tsx`: drop the empty `Props` type/parameter (same treatment, minus the deps issue). Video markup otherwise untouched (protected). Verify: `npm run build && npm run lint`.
- [ ] 5.7 **Conditional on 2.9 choosing (b):** lint-only Props fix in `frontend/components/Separator.tsx` (file stays, unused). Skip entirely if 2.9 chose deletion. Verify: `npm run lint`.
- [ ] 5.8 Final verification sweep (the slice-5 exit is the change's Success-Criteria exit): `npm run build` → passes, zero `images.domains` warning, route manifest with the root route only; `npm run lint` → **0 errors / 0 warnings** (baseline 7/13 fully remediated); grep suite complete (import purity; single label; single scroll-sync listener; single RM gate; no `.hollander`; no cart/retailer literals; no global selectors in new anim code); full browser acceptance — hero parity, 55vh spacing, three cards, empty seasons/books states, rail touch+keyboard+buttons, footer anchors smooth under collapsed header, player usable at all scroll positions, reduced-motion full-page pass. Spec: every capability's manual scenarios; motion-system all requirements.
- [ ] 5.9 Commit PR 5 (`fix(motion): central Lenis/ScrollTrigger sync, remotePatterns, @gsap/react wiring; lint to zero`) — mark 5.x checkboxes in this file in the same PR; if any earlier slice left its `[x]` marks uncommitted, they land here. Post-merge: all five PRs target main in order per the chain guidance.

## Traceability: slice → capability requirements

| Slice | Capability | Requirements covered |
|-------|-----------|----------------------|
| 1 | content-models | Typed Content Interfaces; JSON Single Source; Validating Loaders; Shared Spanish Label; Data Layer Independence |
| 2a/2b | character-roster; hero-header | One Data-Driven Roster; Migrated Spanish Copy; Informational Cards; No Detail Routes; 55vh Ownership; Legacy Retirement; Margin-Step Removal; Protected Timeline |
| 3 | season-browser | JSON-Driven Structure; Selection Updates Panes; Native Overflow; Prev/Next Boundaries; Empty-Until-Populated; Transition Motion; Landmark A11y |
| 4 | book-catalog; site-footer | JSON Book Cards; Deep Links Iff Authoritative; Spanish Catalog Copy; Content Image Policy; Static Footer; Anchor-Only Nav; Spanish Copyright/Credits; Accessible Footer |
| 5 | motion-system; hero-header | Scoped useGSAP; Guaranteed Cleanup; Central Sync; Refresh Strategy; RM Resting States; remotePatterns; Audio Player Contract (guard) |

## Review Workload Forecast

- **Estimated total changed lines:** ~1,500–1,900 authored (additions+deletions; generated lockfile excluded).
- **Per-slice line forecast:** S1 ~320–400 · S2a ~280–350 · S2b ~265–290 (deletions) · S3 ~360–430 (seam → 3a ~230–270 + 3b ~130–170) · S4 ~230–300 · S5 ~140–220.
- **Suggested work-unit split:** PR 1 → PR 2a → PR 2b → PR 3 (optional 3a/3b seam) → PR 4 → PR 5 — 6 stacked PRs, each ≤400 except S3's contingency, which splits at the named seam.
- **Decision needed before apply:** two explicit gate tasks — 2.6 (`end: "+=50%"` tuning, verified during slice 2) and 2.9 (Separator deletion scope) — plus the ask-on-risk chain confirmation before slice 1 starts.

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High
