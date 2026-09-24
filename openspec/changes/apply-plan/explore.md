# Exploration: apply-plan

> sdd-explore artifact for change `apply-plan`. Generated 2026-09-24 from PLAN.md,
> DESIGN.md, openspec/config.yaml, and direct inspection of the frontend code.
> Note: the openspec convention lists this artifact as `exploration.md`; the
> orchestrator directed it be persisted as `explore.md`. Downstream phases should
> read this exact path.

## Current State

The app is a single-route (`frontend/app/page.tsx`) cinematic landing page composed of
hand-written, character-specific full-screen chapters with GSAP ScrollTrigger reveals,
a Lenis smooth-scroll provider, and a persistent audio player mounted in the root layout.

### Page composition (verified)

`frontend/app/page.tsx:8-19` renders, in order: `Header` → `Hollander` → `Separator` →
`Rozanov` → `Separator` → `Hunter`. It also imports `Bio` without using it (dead import).

- **Header** (`frontend/components/Header.tsx`): fixed full-screen hero with looping
  video (`Videobackground`, `/H2.mp4` 18.9 MB), centered logo, and one scrubbed GSAP
  timeline (start `1% top` → end `bottom 50%`) that collapses logo to 150×80, shrinks
  header/video to 100 px height, black-fades the video, and **animates the global
  selector `.hollander` marginTop to `55vh`** (`Header.tsx:51-54`). This is a hidden
  cross-component contract: the protected header boundary currently reaches into the
  first character section. Cleanup only kills the timeline + ScrollTrigger
  (`Header.tsx:57-60`); no `gsap.context` scope.
- **Hollander** (`frontend/components/Hollander.tsx`) and **Rozanov**
  (`frontend/components/Rozanov.tsx`): near-duplicate chapters. Each registers
  ScrollTrigger at render time (`Hollander.tsx:15`), uses a `useEffect` timeline with
  **unscoped global class selectors** (`.shield-hollander-1`, `.imageHollander`,
  `.shield-3`, `.rozanov-description`, `.imageRozanov`), hard-coded biographical copy
  (Hollander's bio in English, Rozanov's in Spanish), a per-character Tailwind gradient,
  and two `Shield` images whose `imageSrc` are **remote wikia/wikimedia URLs**.
  Layout content lives inside a generic `Bio` wrapper (`min-h-screen flex … text-4xl`).
- **Broken asset import**: `Hollander.tsx:6` imports `@/public/hollanderCard.png`, but
  `frontend/public/` contains only `hollanderCard.jpg` (git-tracked list confirms). The
  binding (`holladnerCard`, also a typo) is never used, so `npm run build` still passes
  (verified: compiles, TypeScript finishes, static pages generated) — but the import is
  a latent break the moment anyone references it.
- **Hunter** (`frontend/components/Hunter.tsx`): a stub rendering the literal text
  "Hunter" inside `Bio`; no data, no animation, no image.
- **Reproducer** (`frontend/components/Reproducer.tsx`): fixed bottom-right audio player
  (`z-200`, `/soundtrack.mp4` 5.8 MB), play/pause + volume range, Spanish `aria-label`s
  ("Pausar música" etc.), resume-position logic with magic offsets (5 s/7 s). Mounted
  once in `frontend/app/layout.tsx:34` inside `LenisProvider`. Its auto-play comment is
  misleading: the timer only plays when `playing` is already true, so nothing autoplays.
- **LenisProvider** (`frontend/components/LenisProvider.tsx`): Lenis `lerp 0.1` with its
  own rAF loop. **No ScrollTrigger↔Lenis sync** anywhere (`lenis.on('scroll',
  ScrollTrigger.update)` absent — grep confirmed) and no `ScrollTrigger.refresh()` calls.
- **Unused/vestigial components**: `CardMobile.tsx` (placeholder div), `Profile.tsx`
  (references nonexistent `/profile.jpg` fallback), `reactbits/tiltedCard.tsx` (fully
  implemented Motion-based tilted card with tooltip — matches DESIGN.md §"Cards and
  containers" but is imported by nothing).
- **Orphan public assets**: four unreferenced `44ab2a59-*.jpg` downloads (0.3–3.5 MB
  each) and unused local `hollanderCard.jpg` / `rozanovCard.jpg` (likely the intended
  game-board card art for the two characters).
- **Types and data**: `frontend/types/` and `frontend/data/` do **not exist**. All
  content today is inline JSX literals. No `Character`/`Season`/`Episode`/`Book`
  interfaces anywhere. No footer component exists at all; no season/episode/book data
  exists anywhere in the repo.

### Configuration (verified)

- `frontend/next.config.ts:5-10`: `images.domains` allowlist
  (`static.wikia.nocookie.net`, `upload.wikimedia.org`). `npm run build` prints:
  **"`images.domains` is deprecated in favor of `images.remotePatterns`"** on Next 16.3.6.
- `frontend/package.json`: `gsap 3.14.2`, `lenis 1.3.17`, `motion 12.26.2`, next 16.3.6,
  react 19.3.0. **`@gsap/react` is NOT installed** (node_modules checked), so the
  preferred scoped `useGSAP` hook is unavailable without a dependency addition.
- `frontend/app/layout.tsx:17-20`: metadata is still the
  `create-next-app` placeholder ("Create Next App").
- `frontend/app/globals.css`: only Tailwind 4 import + light/dark tokens; the body font
  is overridden to Arial (documented in DESIGN.md §3). **No
  `prefers-reduced-motion` handling anywhere** in app or components (grep confirmed).
- Uncommitted dependency bumps exist in the working tree (`git diff` on
  `frontend/package.json`: next/react 16.1.1/19.2.3 → ^16.3.6/^19.3.0).

### Quality baseline (verified this session)

- `npm run lint`: **7 errors, 13 warnings** — exactly the recorded baseline
  (`openspec/testing-capabilities.md:41-43`). Dominant classes:
  `@typescript-eslint/no-empty-object-type` on `type Props = {}` (7 files) and unused
  vars/imports (`use`, `props`, `Bio`, `Image`, `holladnerCard`).
- `npm run build`: **passes** (TypeScript check included).
- No test runner, strict TDD disabled (config + testing-capabilities).

## Validation of PLAN.md against actual code

| PLAN.md claim | Verdict | Evidence |
|---|---|---|
| Preserve Header hero→collapse transformation | Exists, but coupled | `Header.tsx` timeline works; its `.hollander` marginTop tween must be re-owned or the selector must survive the restructure |
| Replace character chapters with one data-driven Characters section | Partially exists | Only Hollander+Rozanov have real content; Hunter is a stub; zero data modules; TiltedCard is a ready (unused) card primitive |
| Seasons section with timeline + episode rail | Does not exist | No seasons/episodes data, components, or styles anywhere |
| Books section with purchase info | Does not exist | No book content at all; plan forbids inventing purchase URLs |
| Footer | Does not exist | No footer component or destinations supplied |
| Typed interfaces in `frontend/types/`, data in `frontend/data/` | Does not exist | Both directories absent |
| Remote images compatible with Next image policy | Exists but fragile | `images.domains` allowlist works today yet is deprecated on Next 16; new hosts (book retailers, episode art CDN) not configured |
| Scoped animation + cleanup guidance | Not followed today | All three animated files use global selectors in bare `useEffect`s; only `tl.kill()`/`scrollTrigger.kill()`, no `ctx.revert()`; `@gsap/react` absent |
| Reduced motion | Not implemented today | Zero matches for `prefers-reduced-motion` |
| Audio player remains mounted | Exists | Layout-mounted Reproducer; no changes required by plan |
| 400-line budget | At risk | See Approaches/sizing below — restructuring 4 components + 5 new section areas + types + data far exceeds 400 changed lines in one PR |

## Approaches

1. **Scaffold-with-explicit-gap-states** (recommended)
   Land typed content models, section shells, reusable card primitives, and the season
   browser wired to *whatever content is authoritative*, rendering PLAN.md's
   "explicit missing-data states" for undecided rosters/seasons/books/footer fields.
   Old chapters are migrated into the data model slice-by-slice; Header stays untouched
   except transferring ownership of its `.hollander` margin tween.
   - Pros: unblocks spec/design now; honors "no invented canon"; each capability
     (`content-models` → `character-roster` → `season-browser` → `book-catalog` +
     `site-footer`) is a natural stacked PR under ~400 lines.
   - Cons: sections look unfinished until content lands; requires disciplined
     placeholder states (no lorem/canon guessing).
   - Effort: High (but split across 4–5 reviewable slices).

2. **Content-gated single implementation**
   Wait for the user to supply roster, seasons/episodes, books, and footer data, then
   implement in one pass.
   - Pros: no placeholder churn; final state visible in one review.
   - Cons: 1 000+ line review blows the budget anyway; pipeline stalls on the open
     decisions; contradicts stacked-to-main delivery.
   - Effort: High, undivided.

3. **Refactor-first, features-later**
   Only extract types/data modules and convert Hollander/Rozanov/Hunter into
   data-driven cards in this change; defer seasons/books/footer to follow-up changes.
   - Pros: smallest safe increment (~2 PRs); validates scoping pattern against the
     Header collision early.
   - Cons: PLAN.md explicitly bundles the sections into one change; splitting is
     allowed by stacked delivery but narrows this change's acceptance criteria.
   - Effort: Low/Medium.

Animation mechanics common to all approaches (per gsap-react / gsap-scrolltrigger
skills + PLAN.md): keep `Header.tsx` byte-for-byte stable except the margin-tween
transfer; new sections use `gsap.context(() => {…}, sectionRef)` + `ctx.revert()`
unless the user approves adding `@gsap/react` (`useGSAP` + `scope`); every per-card
tween targets refs or scoped selectors, never `.shield-3`-style globals; ScrollTrigger
on top-level timelines only; `ScrollTrigger.refresh()` after card/rail content and
image loads; sync Lenis via `lenis.on('scroll', ScrollTrigger.update)`; gate all motion
behind a shared `usePrefersReducedMotion()`-style check and show resting states.

## Recommendation

Approach 1, delivered as stacked PRs targeting ≤400 changed lines each, ordered:
(1) `types/` + `data/` scaffolds + reduced-motion/context helpers, (2) Characters
section + card primitive (migrate Hollander/Rozanov, retire old chapter components,
fix the broken `hollanderCard.png` import, decide `remotePatterns` migration),
(3) Seasons section with accessible episode rail, (4) Books + Footer, (5) page
composition + metadata/style polish. Content-gated items (books URLs, episode
metadata, footer destinations, full roster) must be supplied by the user **before
slice 2/4/5 finalize**, not invented. Before spec, get answers to the decision list
below — several acceptance criteria in PLAN.md are literally unsatisfiable without them.

## Unresolved product decisions (must confirm before spec/design)

1. **Roster**: which characters are "complete"? Only Hollander and Rozanov have content;
   Hunter is a stub; are there more (the four orphan `44ab2a59-*.jpg` files — are they
   artwork, and for whom)? Exact approved fields per card (name, role, team/national
   shields, bio text, image, links?).
2. **"Game-board-style" cards**: confirm the visual reference — reuse
   `reactbits/tiltedCard.tsx` (exists, unused, matches DESIGN.md) or a new card design?
   Do cards have actions (expand, external links) beyond information display (PLAN.md
   leaves this open)?
3. **Copy language**: existing bios are mixed English (Hollander) / Spanish (Rozanov),
   Reproducer labels are Spanish. One language, or per-content locale? Affects every
   data module and aria-label.
4. **Seasons**: which seasons, order, default selection? Approved episode titles,
   summaries, dates, artwork, and links (none exist in repo)?
5. **Books**: which titles, covers, and **authoritative purchase providers/URLs** —
   plan forbids fabricated links, so this blocks the Books slice content.
6. **Footer**: navigation, social, legal, and attribution destinations (none supplied).
7. **Remote images**: keep hotlinking wikia/wikimedia (fragile) or localize the two
   flags/logos into `public/`? Migrate `images.domains` → `images.remotePatterns` now,
   and which new hosts (book covers) are approved?
8. **`@gsap/react`**: approve adding the dependency for `useGSAP` (skill-recommended,
   MIT) or stay on `gsap.context` + manual `ctx.revert()`?
9. **Lint baseline**: remediate the 7 errors/13 warnings in this change or track
   separately (PLAN.md leaves it open)?
10. **`.hollander` spacing contract**: after the restructure, who owns the 55 vh offset
    (Header keeps the tween against a new section id, or CharactersSection sets its
    own margin and the Header timeline drops the step)?

## Risks

- **400-line budget: HIGH.** Full restructure estimated at ~1 200–1 700 changed lines
  (types+data ~350, characters ~250, seasons ~450, books+footer ~350, composition/
  deletions ~300). Under `ask-on-risk` this MUST be split into stacked slices at
  sdd-tasks; a single PR is not viable.
- **Animation scoping collisions**: today every animated element is targeted by global
  class from a bare `useEffect`. Mapping characters→cards will make repeated selectors
  animate all instances at once; `Header`'s `.hollander` tween silently targets
  nothing (or the wrong node) after the restructure. Mitigation: refs/`gsap.context`
  scope per section, explicit ownership transfer of the margin tween, cleanup via
  `ctx.revert()`.
- **Lenis + ScrollTrigger desync**: no `lenis.on('scroll', ScrollTrigger.update)` wiring
  and no `refresh()` after dynamic content; adding a season-transition and rail-adjacent
  triggers multiplies the staleness. Mitigation: central sync + refresh hooks.
- **Deprecated image policy**: `images.domains` warns on every build in Next 16.3.6;
  more remote hosts without `remotePatterns` widens an allowlist the framework
  discourages. Hotlinked wikia URLs can also break or rate-limit at runtime.
- **Reduced motion absent**: no current `prefers-reduced-motion` support; scrubbed
  timelines + Lenis smooth scroll violate it by default. Must be built, not retrofitted
  last.
- **Episode-rail accessibility**: horizontally scrolling region is unfocusable by
  keyboard without explicit design (role/aria-label + tabindex scroll container, named
  prev/next buttons, correct disabled boundaries, visible `:focus-visible`); GSAP
  transitions must not trap or hijack that scroll (plan mandates native overflow).
- **Content void**: seasons, episodes, books, footer, roster completeness are all
  zero-data today; five acceptance criteria are blocked on user input — any pressure to
  "fill in" values conflicts with the no-invented-canon rule.
- **Existing lint failures** (7 errors/13 warnings) mean CI-style green lint is
  impossible without an explicit baseline-vs-new-regression policy.
- **Performance surface**: 18.9 MB hero video, 5.8 MB audio, ~1 MB character PNGs, plus
  a full catalog of cards/episodes if eager-loaded; keep section-level lazy reveals and
  `next/image` sizing discipline.
- **Dead-code traps**: `hollanderCard.png` missing-file import passes Turbopack only
  while unused; `Profile.tsx` fallback `/profile.jpg` also does not exist. Cleanup must
  accompany migration or these resurface as build breaks.

## Ready for Proposal

**Yes — with conditions.** The technical scope (types, data modules, section
components, animation scoping, image policy, reduced motion, a11y rail) is fully
grounded in code and ready for proposal/spec. The orchestrator should tell the user
that the ten product decisions above — roster completeness, seasons/episodes/books/
footer content, card design/actions, copy language, remote-image policy, `@gsap/react`
approval, and lint-baseline scope — must be answered before or during proposal, and
that sdd-tasks must forecast this as a stacked-slice delivery (est. 4–5 PRs ≤ 400 lines
each), since the change cannot fit one review budget and the no-invention rule blocks
finalizing content-bearing slices.
