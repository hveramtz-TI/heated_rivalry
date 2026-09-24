# Design: Apply Plan — Data-Driven Single-Page Experience

> sdd-design artifact for change `apply-plan`. Answers to `proposal.md` (binding
> decisions 1–8), the 7 capability specs under `specs/`, `PLAN.md`, and the
> `DESIGN.md` visual identity (this document governs structure/mechanism, never
> look-and-feel — `DESIGN.md` remains the visual source of truth). File/line
> evidence cites `explore.md` and direct inspection performed during this phase.
> **Language contract:** this artifact is English; all user-visible site copy it
> names is Spanish (binding decision 2).

## Technical Approach

Scaffold-with-explicit-gap-states (proposal approach 1): a new bottom layer
(`types/` + `data/` + `lib/`) exposes validated typed content to a new middle
layer of section/card components (`components/sections/`, `components/cards/`),
which compose into the single route (`page.tsx`) as
Header → Characters → Seasons → Books → Footer →(persistent) Reproducer.
Motion is governed site-wide: `@gsap/react` `useGSAP` with section-root scopes
for every new timeline, one shared reduced-motion gate, and Lenis↔ScrollTrigger
sync centralized in `LenisProvider`. The legacy chapters are deleted after
their copy migrates into JSON; the protected Header timeline loses exactly one
documented step (the `.hollander` marginTop tween), whose visual contract
transfers into CharactersSection's own scoped animation.

Spec mapping: `content-models` → D1–D3; `character-roster` → D1, D4, D6;
`season-browser` → D5; `book-catalog` + `site-footer` → D1, D8; `hero-header` →
D6/D7 boundary rules; `motion-system` → D7, D8; `rules.design` (config) —
rationale per decision, protected boundary explicit in "Protected Boundaries".

## Verified Baseline (design inputs)

Confirmed by direct inspection during this phase:

| Fact | Evidence |
|---|---|
| Page composes Header → Hollander → Separator → Rozanov → Separator → Hunter; `Bio` imported unused | `frontend/app/page.tsx:8-19` |
| Header tweens global `.hollander` `marginTop:"55vh"` as its final timeline step | `frontend/components/Header.tsx:51-54` |
| `mt-screen` on `.hollander`/`.rozanov` is **never generated** by Tailwind 4.3.3 — no `.mt-screen` rule exists in compiled `.next` CSS (only `.h-screen`/`.min-h-screen` carry `100vh`) | build CSS grep, this phase |
| ⇒ Effective margin contract is **scrubbed 0 → 55vh**, not 100vh → 55vh | corollary of the two rows above |
| Lenis `lerp 0.1` with a hand-rolled rAF loop; **no** `ScrollTrigger.update` sync, no `refresh()` | `frontend/components/LenisProvider.tsx:7-21` |
| Lenis 1.3.17 supports `anchors?: boolean \| ScrollToOptions` | `node_modules/lenis/dist/lenis.d.ts:234` |
| `@gsap/react` NOT installed | `node_modules/@gsap` absent |
| Deprecated `images.domains` with the two wikia/wikimedia hosts | `frontend/next.config.ts:5-10` |
| Broken import `@/public/hollanderCard.png` (file is `.jpg`), binding unused → build still passes | `Hollander.tsx:6`; `public/` listing |
| Lint baseline 7 errors / 13 warnings: `type Props = {}` errors in CardMobile, Hollander, Hunter, Reproducer, Rozanov, **Separator**, **Videobackground**; unused-var warnings incl. `Bio` in `page.tsx`; `Reproducer.tsx:36` missing `pausedAt` dep | `npm run lint` this phase |
| `reactbits/tiltedCard.tsx` implements the DESIGN.md card pattern (perspective tilt, `rounded-[15px]`, 4px white/charcoal tooltip, spring resets) but uses raw `<img>` and a hard-coded **English** mobile-warning string (`tiltedCard.tsx:104-107`) | file read |
| Rozanov Spanish bio (`Rozanov.tsx:91-93`), Hollander English bio (`Hollander.tsx:89-91`) — migration sources | file reads |
| tsconfig `paths: {"@/*": ["./*"]}`, `resolveJsonModule: true` | `frontend/tsconfig.json:12,21-23` |
| No `prefers-reduced-motion` handling anywhere; metadata is create-next-app placeholder; `<html lang="en">` | `globals.css`, `layout.tsx:17-20,28` |

## Architecture Decisions

### Decision: D1 — Folder structure, naming, and import aliases

**Choice**:
```
frontend/
├── types/
│   └── content.ts             # Character, Season, Episode, Book, ImageRef, RetailerLink, CharacterAccent
├── data/
│   ├── ui.ts                  # MISSING_CONTENT_LABEL = "Contenido próximamente" (single source)
│   ├── guards.ts              # hand-written validators (unknown → typed), never throws
│   ├── characters.json        # ships the 3 known characters (Hunter: name only)
│   ├── characters.ts          # loader: getCharacters(): Character[]
│   ├── seasons.json           # ships [] until user populates (episodes nested per season)
│   ├── seasons.ts             # loader: getSeasons(): Season[]
│   ├── books.json             # ships [] until user populates
│   └── books.ts               # loader: getBooks(): Book[]
├── lib/
│   ├── motion.ts              # usePrefersReducedMotion(), getPrefersReducedMotion(), requestScrollTriggerRefresh()
│   └── images.ts              # ALLOWED_REMOTE_HOSTS (single source; consumed by next.config.ts and guards)
├── components/
│   ├── sections/
│   │   ├── CharactersSection.tsx
│   │   ├── SeasonsSection.tsx # owns selectedSeason state
│   │   ├── SeasonSelector.tsx
│   │   ├── SeasonTimeline.tsx
│   │   ├── EpisodeRail.tsx
│   │   ├── BooksSection.tsx
│   │   └── Footer.tsx
│   ├── cards/
│   │   ├── CharacterCard.tsx
│   │   ├── EpisodeCard.tsx
│   │   └── BookCard.tsx
│   ├── reactbits/tiltedCard.tsx   # adapted in place (see D4)
│   └── (kept: Header, LenisProvider, Reproducer, Shield, Videobackground)
└── app/page.tsx               # recomposed; remains a Server Component composing client sections
```

- New section/card files use PascalCase filenames matching the default-exported
  component (`CharactersSection.tsx`), consistent with existing components.
- `types/` and `data/` live at the `frontend/` level (proposal decision 3
  literally names `frontend/types/`, `frontend/data/`); `lib/` and `components/sections|cards`
  are new subfolders, not a reorganization — flat legacy components stay put.
- Import alias convention: all new files import exclusively via `@/`
  (`@/types/content`, `@/data/characters`, `@/lib/motion`,
  `@/components/cards/CharacterCard`). `resolveJsonModule` already allows
  `@/data/characters.json` from the loader module (loaders import their own
  JSON; components never import JSON directly). Existing relative imports in
  untouched files are not rewritten (diff-budget protection).

**Alternatives considered**: (a) flat `components/` for everything (matches
today's layout but buries 12 new files among 11 legacy ones and makes the
deletion set vs. section set hard to review); (b) feature folders
(`characters/`, `seasons/`, `books/`) — fewer files per folder but splits each
section from its cards and diverges from PLAN.md's named component boundaries.
(c) CSS Modules or a styles folder — project convention is Tailwind-only.

**Rationale**: `sections/` vs `cards/` mirrors PLAN.md's stated component
boundaries 1:1, keeps every 400-line PR diff scannable (slice = folder), and
`lib/motion.ts` + `data/ui.ts` provide the single-source points the
motion-system and content-models specs mandate (shared reduced-motion gate,
shared Spanish label). `types/content.ts` as one file matches the four-model
surface; splitting into per-model files would add import churn without value.

### Decision: D2 — JSON schema contract

**Choice**: exact shapes below. Rules: `id` is the only guaranteed field
(loader-synthesized when absent, see D3); every user-supplied content field is
optional so "not yet populated" is representable without sentinels
(content-models spec); asset fields are **string paths**: a leading `/` means
`public/`-rooted (the end state), an `https://` URL on an allowlisted host is
the interim shield exception (D8) — guards reject every other value.

```jsonc
// frontend/data/characters.json — final shipped state (slice 2 completes copy)
[
  {
    "id": "hollander",
    "name": "Hollander",
    "bio": "<Spanish translation of Hollander.tsx:89-91 — no added/omitted facts>",
    "portrait": "/hollander.png",
    "cardArt": "/hollanderCard.jpg",
    "accent": "rivalryRed",
    "shields": [
      { "src": "https://static.wikia.nocookie.net/game-changers-series/images/f/f9/Montreal_Metros_Logo.png/revision/latest?cb=20260102102951",
        "alt": "Escudo del Montreal Metros" },
      { "src": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg",
        "alt": "Bandera de Canadá" }
    ]
  },
  {
    "id": "rozanov",
    "name": "Rozanov",
    "bio": "<Rozanov.tsx:91-93 migrated verbatim, Spanish>",
    "portrait": "/rozanov.png",
    "cardArt": "/rozanovCard.jpg",
    "accent": "electricBlue",
    "shields": [ /* Boston Raiders + Russian flag, same ImageRef shape */ ]
  },
  { "id": "hunter", "name": "Hunter" }   // decision 1: name only → every slot shows the shared label
]
```

```jsonc
// frontend/data/seasons.json — ships as [] (decision 8: structure only)
// Populated shape:
[
  { "id": "temporada-1", "name": "<season name from JSON>", "year": "2026",
    "episodes": [
      { "id": "t1e1", "number": 1, "title": "<from JSON>", "airDate": "YYYY-MM-DD",
        "synopsis": "<from JSON>", "artwork": "/episodes/t1e1.jpg" }
    ] }
]
```

```jsonc
// frontend/data/books.json — ships as []
[
  { "id": "<slug>", "title": "<from JSON>", "cover": "/books/cover.jpg",
    "description": "<from JSON>", "published": "YYYY-MM-DD", "pages": 384,
    "purchaseUrls": [ { "provider": "<retailer name>", "url": "https://<authoritative link only>" } ] }
]
```

- Nested episodes (not a separate `episodes.json`) because the only consumer
  queries episodes per selected season; a second file would force a
  join/foreign-key convention inside a hand-rolled loader with no benefit
  (proposal explicitly permits either — "nested in or keyed by seasons").
- `airDate`/`published` are ISO `YYYY-MM-DD` strings formatted at render with
  `Intl.DateTimeFormat("es")` (display-only; no fabricated calendar text in JSON).
- `accent` is a closed union `"rivalryRed" | "electricBlue" | "neutral"` that
  maps inside CharacterCard to the Tailwind gradient pair from DESIGN.md §4.
  This keeps *style tokens in code* and *content in JSON*: a new character with
  an unknown accent gets `"neutral"` (dark cinematic base), never a JSX-edited
  gradient. Chapter color fields are never invented in JSON.
- `ImageRef.alt` is Spanish site copy living in JSON (content, decision 2),
  e.g. `"Escudo del Montreal Metros"`.
- **Shared label location**: `frontend/data/ui.ts` →
  `export const MISSING_CONTENT_LABEL = "Contenido próximamente";`.
  Every missing slot (card art, bio, episode title/synopsis, book cover,
  selector option, rail empty state, catalog empty state) consumes this one
  constant (content-models spec "Single source of the label"). One-off static
  strings (section headings `"Personajes"/"Temporadas"/"Libros"`, footer copy,
  aria-labels like `"Episodios siguientes"`) are UI chrome and live in the
  components that render them — they are not content and MUST NOT leak into
  `data/` (keeps the data layer canon-only).

**Alternatives considered**: MDX/CMS-style structured docs (no tooling exists;
decision 3 names typed JSON); per-locale files (single language is binding);
required-field schemas with `null` sentinels (would force invented values at
migration time — optional fields make absence the representable default).

### Decision: D3 — Loader/validation strategy: hand-written guards

**Choice**: one loader module per JSON file exposing a pure, synchronous,
never-throwing API:

```ts
// data/guards.ts (excerpt)
export function isRecord(v: unknown): v is Record<string, unknown>
export function asString(v: unknown): string | undefined   // non-empty trimmed string or undefined
export function asAssetPath(v: unknown): string | undefined // "/"-path OR https URL whose hostname ∈ ALLOWED_REMOTE_HOSTS
export function asIsoDate(v: unknown): string | undefined
// characters.ts
export function getCharacters(): Character[]  // never throws, never returns null
```

Per-entry normalization (`normalizeCharacter(raw, index): Character`): each
field is validated independently; a non-object entry, or any entry with zero
recognizable fields, degrades to `{ id: "char-<index>", name: undefined }` —
the card then renders the shared label in the name slot too. Valid siblings of
a malformed entry are untouched (content-models "Malformed entry fails soft").
`getCharacters()` maps `characters.json as unknown[]`, drops nothing, so entry
count always equals JSON array length; season/episode normalization is the
same pattern (`episodes: []` when absent/invalid). Loaders run at module scope
in `data/*.ts`? **No** — inside the exported functions, called once per client
hydration from the section; results are plain data (cheap), and function
scoping keeps the fail-soft path exception-safe without top-level throw risk.

**Zod rejected**: the content-models spec is normative — loaders "MUST NOT add
a new runtime validation dependency". Beyond compliance: the validated surface
is ~15 fields across 3 files with every field optional, so a ~60-line guard
module covers it with zero bundle cost, while zod adds ~13 KB gz to the client
bundle and a schema-duplicates-the-interfaces maintenance tax (no `z.infer`
win because interfaces in `frontend/types/` are the spec-mandated source of
truth that `data/` must import *nothing* from — inverting zod to derive types
would put runtime deps in `types/`).

**Error behavior**: malformed JSON *syntax* (a file that won't parse) is a
build-time failure under `resolveJsonModule` (webpack/Turbopack static import)
— this is accepted and documented to the user: the spec's fail-soft contract
covers *entry-level* corruption; a syntactically broken file is not shippable
content and `npm run build` is the per-slice gate. Dev-editing a broken file
surfaces a build error, not a blank page at runtime. (Alternative: runtime
`fetch` of JSON — rejected: adds loading states, client/server double fetch,
and breaks SSR text content for no benefit on a static site.)

**Types location**: all interfaces in `frontend/types/content.ts` (only place
they are declared). Loaders import them; components import them; `types/`
imports nothing (content-models "Import purity": no `components/`, no `gsap`
imports under `types/` or `data/` — enforced by review + grep).

**Alternatives considered**: class-based models with validation in
constructors (heavier, fights `resolveJsonModule` typing); `asserts` functions
that throw + caller try/catch (violates "never crash the page"); dropping
malformed entries (violates "appears only in the Spanish missing-content
state" — the slot must still exist).

### Decision: D4 — Character card visual model: adapt `reactbits/tiltedCard.tsx` in place

**Choice**: `CharacterCard` composes the existing `TiltedCard` as the art
layer; three minimal adaptations to the primitive, all inside its existing
file:

1. Replace raw `motion.img` with `motion.create(Image)` (next/image, explicit
   `width`/`height` + `sizes`) so `public/` art and allowlisted remote shields
   go through the Next optimizer (also makes the allowlist actually enforced —
   raw `<img>` bypasses it).
2. Localization + default-off for the mobile notice: the hard-coded English
   "This effect is not optimized for mobile…" string becomes
   `showMobileWarning = false` and the notice text becomes a prop (no default
   English remains anywhere, satisfying the all-Spanish-copy rule); the static
   fallback DESIGN.md §7 demands is simply "no tilt on touch" — already true
   (mouse-event-driven), so no notice is required.
3. `imageSrc` typing widens to `string | undefined`: when the art slot is
   empty (Hunter) TiltedCard renders a placeholder panel — a fixed-aspect
   surface (`aspect-[3/4]`, matching a game-card ratio) with
   `MISSING_CONTENT_LABEL` centered and **no `<img>` element at all**
   (character-roster "no guessed source"), keeping the tilt frame so the grid
   rhythm doesn't change.

`CharacterCard` layout (game-board stat display): a bordered-less,
`rounded-[15px]` field using the accent gradient (DESIGN.md §4 "no visible
card border" for chapter containers → cards stay flat color fields), containing
in normal flow: the tilted art (TiltedCard, fixed `aspect-[3/4]` slot,
`loading="lazy"` for non-first cards), then the info block — name
(`text-4xl md:text-6xl font-bold`), shields row (reuse existing `Shield`
component, `ImageRef[]` from JSON; **row omitted entirely when the array is
empty/absent** — an absent shields array is not a visible "slot"), then bio
(`max-w-lg` body copy) or `MISSING_CONTENT_LABEL` per empty slot. All text is
permanently visible (character-roster "no hover-only information" and "no
interactive elements"): tilt/scale/tooltip are decoration on `figure`, the card
ships zero links/buttons/handlers beyond hover motion. Tooltip is enabled only
when `cardArt` exists and carries the character's own name as `captionText`
(passed from props, never a new string).

**Alternatives considered**: (a) extract a shared tilt primitive from
tiltedCard into a new file then re-skin — doubles the diff for one consumer;
(b) new simpler non-tilted card — contradicts DESIGN.md ("tilted cards use
perspective depth…", §4) and PLAN.md's "game-board-style" ask while
`titledCard.tsx` sits ready-but-unused (explore.md flags it as exactly the
matching primitive); (c) full React-Porter rewrite to `@react-three` depth —
out of scope/perf budget.

**Risks accepted**: TiltedCard is `motion` (framer) while sections animate with
GSAP — accepted: hover motion stays in `motion` (per DESIGN.md spring rule),
scroll/entrance motion is GSAP `useGSAP`; the two never target the same
property on the same node (tilt drives `rotateX/rotateY/scale` on the inner
motion.div; GSAP animates `opacity/y` on the card wrapper only).

### Decision: D5 — Episode rail: native overflow-x + scroll-snap, buttons step card-width

**Choice**:
- Container: `overflow-x-auto snap-x snap-mandatory scrollbar-hidden` with
  `flex gap-*`, children `snap-start shrink-0` at fixed widths
  (e.g. `w-[280px]` mobile → `md:w-[320px]`), `data-lenis-prevent` so Lenis'
  wheel handler yields to horizontal trackpad/touch intent inside the rail.
- Prev/next: plain `<button type="button">` with Spanish accessible names
  (`aria-label="Episodios anteriores"` / `"Episodios siguientes"`) placed
  beside/above the rail (not overlaid on content). Activation calls
  `rail.scrollBy({ left: ±step, behavior: reduced ? "auto" : "smooth" })`
  where `step = firstCard.offsetWidth + gapPx` (gap read once from
  `getComputedStyle(rail).columnGap`) — one *visible card increment* per the
  season-browser spec. `snap-mandatory` + card-width step keeps scroll offsets
  aligned; the last-card partial overflow case is handled by
  `scroll-padding-right` on the rail rather than switching to `proximity`.
- Disabled-state detection (single `update()` fn):
  `max = scrollWidth - clientWidth`; prev disabled ⇔ `scrollLeft <= 1`;
  next disabled ⇔ `scrollLeft >= max - 1`; `max <= 1` ⇒ **both** disabled
  (no-overflow case, spec-required). `update()` runs on: `scroll` (passive
  listener, rAF-throttled via `requestScrollTriggerRefresh`-style throttle),
  `ResizeObserver` on the rail + content row (container and card resizes),
  after every season switch, and once on mount. The 1 px tolerance guards
  subpixel `scrollLeft` on zoomed displays.
- Keyboard: the rail div is `tabIndex={0}` + `role="region"` + Spanish
  `aria-label="Listado de episodios"` → native Left/Right arrow scrolling when
  focused; buttons remain independently tabbable in reading order
  (selector → prev → rail → next); visible `:focus-visible` rings via Tailwind
  `focus-visible:ring-2 focus-visible:ring-white` on rail, buttons, selector.
- GSAP policy (never fights native scroll): `useGSAP({ scope: rootRef })`
  entrance timeline tweens **only** `opacity`/`y` (with `stagger`) on the card
  wrappers, ScrollTrigger on the top-level timeline
  (`start: "top 75%"`, `toggleActions: "play none none none"`). Season
  transition: `useGSAP` with `dependencies: [selectedId]` — on change,
  `gsap.fromTo(cardRefs, {opacity:0,y:12}, {opacity:1,y:0,stagger:0.04,duration:0.3})`
  as a top-level tween. The rail's `scrollLeft` is **never** a tween target;
  no `pin`, no `containerAnimation`, no `preventDefault` on wheel/touch —
  checked directly against the season-browser "Animation does not own scroll
  position" scenario. All motion gated by `getPrefersReducedMotion()` (D7):
  when reduced, timelines are skipped and content renders at rest.
- Empty state (seasons `[]`): selector renders one disabled option showing
  `MISSING_CONTENT_LABEL`; timeline renders its track with no nodes; rail body
  shows the shared label panel; both direction buttons `disabled` (not
  removed — layout stays stable). `update()` on mount yields max ≤ 1 ⇒ both
  disabled with zero listeners throwing.

**Alternatives considered**: GSAP `containerAnimation` fake-horizontal (PLAN.md
rejects it — manual native scrolling is a hard requirement); `ScrollSnap`
carousel libs (new dependency for ~60 lines of browser-native code);
`scroll-snap-type: proximity` (weaker card alignment with the one-card step
rule; kept as documented fallback if last-card snapping feels sticky — see
Risks).

**Season selection control**: `fieldset > legend` ("Temporadas" hidden or
visible heading) with native `<input type="radio" class="peer sr-only">` +
`<label>` pills — keyboard operable for free (arrow keys within the radio
group) satisfying "operable by pointer and keyboard", with Spanish accessible
names coming from season `name` (absent name → option shows
`MISSING_CONTENT_LABEL`, never "Season 1"-style invention). `SeasonsSection`
owns `useState(selectedId)` defaulting to the first season id; cards receive
season data strictly by props (PLAN.md boundary: rail owns scrolling, not
data). `SeasonTimeline` renders an `<ol>` of season nodes with an
`aria-current="true"` active indication — static markup, transform-only
active-state animation allowed.

### Decision: D6 — `.hollander` margin transfer: exact mechanism

**Before** (base commit, verified): `Header.tsx:19-54` builds one scrubbed
timeline (`trigger: headerRef`, `start: "1% top"`, `end: "bottom 50%"`) whose
final step (lines 51-54) tweens the **global** `.hollander` `marginTop` to
`"55vh"` at `ease: "power1.out"`, position 0. Because `mt-screen` compiles to
nothing, the resting margin is `0`; the visual contract is: *margin scrubs
0 → 55vh across the same scroll range as the hero collapse* (~0 → ~50vh of
scroll, bounded by the fixed full-viewport header).

**After**: Header.tsx loses exactly lines 51-54 (the trailing `.to()`; the
preceding step keeps its `, 0)` position so the rest of the timeline is
byte-stable). CharactersSection re-implements the contract scoped to itself:

```tsx
<section ref={rootRef} id="personajes" className="scroll-mt-28 …">   {/* stable: no margin */}
  <div ref={offsetRef}>                       {/* animated spacer wrapper */}
    <div className="characters-grid …">{cards}</div>   {/* keeps gradient background */}
  </div>
</section>

useGSAP(() => {
  if (getPrefersReducedMotion()) {            // resting = final spacing, no scrub
    gsap.set(offsetRef.current, { marginTop: "55vh" });
    return;
  }
  const tl = gsap.timeline({
    scrollTrigger: { trigger: rootRef.current, start: "top top", end: "+=50%", scrub: true },
  });
  tl.to(offsetRef.current, { marginTop: "55vh", ease: "power1.out" }, 0);
}, { scope: rootRef });
```

- The `marginTop` lives on an **inner wrapper** while the ScrollTrigger targets
  the **unmarginated section root** — this breaks the measure-twice feedback
  loop that animating the trigger's own position creates (root stays pinned at
  document y=0 because the Header is fixed; `start: "top top"` ⇒ progress 0 at
  scroll 0, matching the old `"1% top"` ≈ 0). `end: "+=50%"` reproduces the
  old ~50vh scroll window (header bottom "bottom 50%" of a 100vh fixed
  element); exact `end` value is tuned during slice-2 browser
  side-by-side verification, and the spec's acceptance test is visual parity,
  not a source-level constant match.
- The gradient background sits on the *content* side of the offset wrapper
  (margin area shows page background above the section — identical to today's
  look where 55vh of body black shows above the red gradient), per DESIGN.md
  §5; `overflow-hidden` on the section root.
- Dead `mt-screen` class dies with the deleted files — **not** ported (it is a
  no-op; porting it would change behavior to a real 100vh start margin).
- Reduced motion: static `55vh` final spacing satisfies the character-roster
  "Offset under reduced motion" scenario (final spacing reached without
  scrubbed movement, content visible).
- Rollback (one reviewable step, proposal risk table): restore
  `Header.tsx:51-54` from base and re-add `.hollander`-carrying markup; the
  CharactersSection offset wrapper + tween are a self-contained delete.

**Alternatives considered**: keep Header's tween retargeted to `#personajes`
(rejected — hero-header spec forbids Header reaching outside its component);
static `pt-[55vh]`/`mt-[55vh]` only (fails the *visual identity* acceptance:
today the spacing grows progressively during collapse; a static margin would
jump the section up against the shrinking header); CSS
`position: sticky` tricks (unbounded visual change, worse rollback).

### Decision: D7 — Lenis↔ScrollTrigger central sync + reduced-motion gate (single owner: `LenisProvider.tsx`)

**Choice** — `LenisProvider` becomes the only place in the app that touches
global scroll plumbing:

```tsx
"use client";
gsap.registerPlugin(ScrollTrigger);                 // idempotent; sections re-register safely
useEffect(() => {
  if (prefersReducedMotion) return;                 // native instant scroll; no Lenis instance at all
  const lenis = new Lenis({ lerp: 0.1, anchors: true });     // anchors → footer #hash nav handled natively (verified option @1.3.17)
  lenis.on("scroll", ScrollTrigger.update);         // required sync (spec: exactly one listener)
  const onTick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(onTick);                          // single rAF owner; replaces the hand-rolled loop
  gsap.ticker.lagSmoothing(0);
  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);          // late images/fonts
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return () => { window.removeEventListener("load", onLoad); gsap.ticker.remove(onTick); lenis.destroy(); };
}, [prefersReducedMotion]);
```

- `gsap.ticker` drives `lenis.raf` instead of a second `requestAnimationFrame`
  loop: one rAF, and `ScrollTrigger.update` lands in the same frame as
  Lenis' position change (the canonical Lenis+GSAP integration; the hand-rolled
  loop and this are mutually exclusive).
- `ScrollTrigger.scrollerProxy` is **not** needed and deliberately skipped:
  Lenis 1.x scrolls the real window (no transform-based body wrapping), so
  ScrollTrigger's native viewport math stays correct; `lenis.on('scroll',
  ScrollTrigger.update)` is the documented requirement (skill
  gsap-scrolltrigger "Refresh and Cleanup" / scrollerProxy notes). Rejected
  alternative to be re-evaluated **only** if scroll-linked jitter appears on a
  low-end device, which would indicate a different scroller model than 1.3.17.
- Refresh strategy (motion-system "Refresh After Layout-Affecting Changes"):
  (1) `load` + `document.fonts.ready` here; (2) `lib/motion.ts` exports
  `requestScrollTriggerRefresh()` — a module-level debounce (one `setTimeout`
  ~100 ms) — called by `SeasonsSection` after the season-transition settles
  and by card image `onLoad` (covers the late-populated-content case the
  window-load path misses); (3) every card reserves fixed aspect/dimension
  slots (D4/D5) so image swaps don't move triggers in the first place —
  refresh becomes a safety net, not a reflow chaser.
- Trigger creation order follows mount order top-to-bottom (Characters →
  Seasons → Books) so no `refreshPriority` config is needed (gsap-scrolltrigger
  best practice); documented as a review rule for future sections.
- Reduced motion gate (`lib/motion.ts` — the single shared check the
  motion-system spec demands):

  ```ts
  export function getPrefersReducedMotion(): boolean          // matchMedia wrapper, SSR-safe (returns false on server)
  export function usePrefersReducedMotion(): boolean          // useState + change listener; LenisProvider consumes this
  export function requestScrollTriggerRefresh(): void         // debounced refresh helper
  ```

  LenisProvider uses `usePrefersReducedMotion()`; every new section timeline
  branches on `getPrefersReducedMotion()` inside its `useGSAP` body. `Header`
  and `Reproducer` are unchanged (protected boundary exemption). Grep confirms
  one source of the decision; ad-hoc `matchMedia` per component is forbidden
  (spec scenario "Motion gate is shared, not duplicated").

### Decision: D8 — Image strategy: `remotePatterns` for the two interim hosts, `public/`-path art as the end state

**Choice**:

```ts
// frontend/lib/images.ts — single source of truth
export const ALLOWED_REMOTE_HOSTS = ["static.wikia.nocookie.net", "upload.wikimedia.org"] as const;

// frontend/next.config.ts
import { ALLOWED_REMOTE_HOSTS } from "./lib/images";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: ALLOWED_REMOTE_HOSTS.map(hostname => ({
      protocol: "https" as const, hostname, pathname: "/**",
    })),
  },
};
```

- `pathname: "/**"` covers the wikia `revision/latest?cb=…` and wikimedia
  `wikipedia/commons/...` shapes (query strings are not pattern-matched; the
  wildcard path covers them).
- `lib/images.ts` is also what `guards.ts` re-validates against
  (`asAssetPath`) — one allowlist for both the build-time config and the
  runtime data layer; the config imports an app module (supported:
  `next.config.ts` executes in Node). Rejected: duplicating the host list in
  two places (drift risk silently opens the "policy error at runtime" failure).
- **next/image usage rules**: card covers/art/portraits and shields render via
  `next/image` with explicit `width`/`height` + `sizes` (rail/catalog grids
  declare breakpoints), `loading="lazy"` for everything except the first
  character card (`priority`-free: it's below the first viewport behind the
  hero; no section image earns `priority`). Every remote slot has an
  `onError` path → component state flips to the `MISSING_CONTENT_LABEL`
  placeholder panel (fragile hotlink risk, proposal risk table: wikia can
  break/rate-limit). Local `public/` art has no failure path beyond build
  resolution.
- **Interim vs future**: shield `ImageRef.src`s ship as the existing remote
  URLs (canon art today); end state is `/shields/*.png` under `public/`,
  swapped **inside JSON only** — no component change, and since guards +
  config forbid host growth, the allowlist cannot widen within this change
  (motion-system spec). The `characters.json` portrait/cardArt fields reference
  the existing `public/hollanderCard.jpg`, `public/rozanovCard.jpg`,
  `hollander.png`, `rozanov.png` — the `hollanderCard.png` typo dies with the
  deleted file; JSON's `.jpg` path is the correct reference.

## Interfaces / Contracts

```ts
// frontend/types/content.ts
export interface ImageRef {
  /** public/-rooted path ("/x.png") or https URL on an ALLOWED_REMOTE_HOSTS host */
  src: string;
  /** Spanish alt text (site copy lives in JSON) */
  alt: string;
}
export interface RetailerLink { provider: string; url: string } // url present ⇔ affordance rendered
export type CharacterAccent = "rivalryRed" | "electricBlue" | "neutral";
export interface Character {
  id: string;                       // loader-synthesized ("char-<i>") when absent
  name?: string;                    // ""/undefined → card shows MISSING_CONTENT_LABEL
  bio?: string;
  portrait?: string;                // public/ path, oversized art (chapters) — optional
  cardArt?: string;                 // public/ path, game-board card face — optional
  accent?: CharacterAccent;         // unknown/absent → "neutral"
  shields?: ImageRef[];             // absent/empty → shields row omitted entirely
}
export interface Episode {
  id: string;                       // loader-synthesized when absent
  number?: number; title?: string; airDate?: string; // ISO YYYY-MM-DD
  synopsis?: string; artwork?: string;
}
export interface Season {
  id: string; name?: string; year?: string;
  episodes: Episode[];              // invalid/absent → [] (never throws)
}
export interface Book {
  id: string; title?: string; cover?: string; description?: string;
  published?: string; pages?: number;
  purchaseUrls?: RetailerLink[];    // the ONLY source of purchase affordances
}
```

```ts
// frontend/data/*.ts — loader surface (pure, client+server safe, never throws)
export function getCharacters(): Character[];
export function getSeasons(): Season[];
export function getBooks(): Book[];

// frontend/data/ui.ts
export const MISSING_CONTENT_LABEL = "Contenido próximamente";

// frontend/lib/motion.ts
export function getPrefersReducedMotion(): boolean;
export function usePrefersReducedMotion(): boolean;
export function requestScrollTriggerRefresh(): void;

// frontend/components/sections — props contracts (state flows top-down)
CharactersSection: {}                       // pulls getCharacters() itself
SeasonsSection: {}                          // owns selectedSeasonId state
EpisodeRail: { season: Season | undefined } // scrolling only, no data ownership
BooksSection: {}                            // pulls getBooks()
Footer: {}                                  // static, zero data-layer imports (site-footer spec)
```

Props rule: sections call loaders; cards receive data strictly by props and
never import from `@/data/*` except `@/data/ui` (the shared label). That keeps
"updating copy requires editing JSON only" verifiable at the card level.

## Data Flow

```
frontend/public/*  ──┐ (path strings)
data/*.json ──(static import @build)──► data/guards.ts ──► loaders: getCharacters/getSeasons/getBooks
                                                        │ typed[], malformed → label-state entries
                                                        ▼
 app/layout.tsx (Server) ─► LenisProvider (Client: scroll plumbing + RM gate)
   app/page.tsx (Server) ─► Header (protected)
                         ─► CharactersSection (Client) ─► CharacterCard* ─► TiltedCard/Shield
                         ─► SeasonsSection   (Client, selected-season state)
                                 ├─► SeasonSelector / SeasonTimeline (props)
                                 └─► EpisodeRail ─► EpisodeCard*    (native scroll; GSAP: opacity/y only)
                         ─► BooksSection     (Client) ─► BookCard*  (link iff purchaseUrl present)
                         ─► Footer           (Client-free; static anchors #personajes|#temporadas|#libros)
   Reproducer (Client, untouched playback) ◄─ layout mounts once, fixed z-200
```

Anchor navigation: Footer `<a href="#personajes">` etc. → Lenis
(`anchors: true`) resolves the hash client-side with the same smoothing as
page scroll; sections carry `scroll-mt-28` (~112 px) so the collapsed fixed
header (100 px) never covers target headings. Server side still emits plain
hash links (no JS needed for correctness).

## Protected Boundaries (explicit, per config rule)

- `Header.tsx` timeline: byte-stable except deletion of `.to(".hollander", …)`
  (lines 51-54). No easing/trigger/step edits; cleanup (`tl.scrollTrigger?.kill();
  tl.kill()`) stays. Its `.hollander` dependency is severed by deletion, not
  retargeting.
- `Reproducer.tsx`: playback logic untouched; only the lint trio changes
  (D-Migration) — `type Props = {}` → no Props type (drop the empty-object
  declaration, remove the unused `props` parameter, keep the component
  signature `() =>`), and `useEffect` deps `[playing]` → `[playing, pausedAt]`.
  Dep-add safety analysis: `pausedAt` only changes while pausing
  (`playing === false`), and the timer body requires `playing === true`, so
  re-arming after a pause is a proven no-op; playback is unchanged — satisfies
  "MUST NOT modify its playback logic".
- `Videobackground.tsx` / `Separator.tsx`: same no-`Props` lint treatment
  (Separator's deletion, below, moots its fix).
- GSAP usage inside Header stays `useEffect`-based — it is exempted from the
  `useGSAP` migration (motion-system spec names it the only exempt code).

## File Changes

| File | Action | Description |
|---|---|---|
| `frontend/types/content.ts` | Create | All content interfaces (D2/D3 contracts above) |
| `frontend/data/characters.json` | Create | 3 known characters; Hunter name-only; Spanish bios in slice 2 |
| `frontend/data/seasons.json` | Create | Ships `[]` |
| `frontend/data/books.json` | Create | Ships `[]` |
| `frontend/data/ui.ts` | Create | `MISSING_CONTENT_LABEL` |
| `frontend/data/guards.ts` | Create | Hand-written validators (D3) |
| `frontend/data/characters.ts` `seasons.ts` `books.ts` | Create | Typed, never-throwing loaders |
| `frontend/lib/motion.ts` | Create | Shared reduced-motion gate + debounced refresh helper |
| `frontend/lib/images.ts` | Create | `ALLOWED_REMOTE_HOSTS` single source |
| `frontend/components/sections/CharactersSection.tsx` | Create | Roster landmark `id="personajes"`; owns 55vh offset transfer (D6) |
| `frontend/components/sections/SeasonsSection.tsx` | Create | Landmark `id="temporadas"`, selected-season state, transition timeline |
| `frontend/components/sections/SeasonSelector.tsx` | Create | Radio-group fieldset, Spanish names, disabled-empty state |
| `frontend/components/sections/SeasonTimeline.tsx` | Create | `<ol>` nodes + active indication |
| `frontend/components/sections/EpisodeRail.tsx` | Create | Native overflow + snap + buttons (D5) |
| `frontend/components/cards/CharacterCard.tsx` | Create | Game-board card (D4) |
| `frontend/components/cards/EpisodeCard.tsx` | Create | Art slot/title/date/synopsis with per-slot labels |
| `frontend/components/cards/BookCard.tsx` | Create | Cover/metadata; link iff `purchaseUrl` present |
| `frontend/components/sections/BooksSection.tsx` | Create | Catalog landmark `id="libros"` + empty state |
| `frontend/components/sections/Footer.tsx` | Create | Logo, anchors nav, ©, credits (Spanish, static) |
| `frontend/components/reactbits/tiltedCard.tsx` | Modify | next/image, `showMobileWarning=false` default, missing-art placeholder (D4) |
| `frontend/components/Header.tsx` | Modify | Delete lines 51-54 (the `.hollander` tween step) only |
| `frontend/components/LenisProvider.tsx` | Modify | Central sync + ticker + anchors + refresh + RM gate (D7) |
| `frontend/app/page.tsx` | Modify | Recompose Header → Characters → Seasons → Books → Footer; drop `Bio`/`Separator`/chapter imports |
| `frontend/app/layout.tsx` | Modify | Metadata: real Spanish title/description; `<html lang="es">` |
| `frontend/next.config.ts` | Modify | `domains` → `remotePatterns` via `ALLOWED_REMOTE_HOSTS` |
| `frontend/package.json` + lockfile | Modify | Add `@gsap/react` |
| `frontend/components/Hollander.tsx` | Delete | Content migrated to JSON (incl. its `.hollander` class); broken `hollanderCard.png` import dies here |
| `frontend/components/Rozanov.tsx` | Delete | Spanish bio migrated verbatim to JSON |
| `frontend/components/Hunter.tsx` | Delete | Replaced by JSON name-only entry + CharacterCard gap state |
| `frontend/components/Bio.tsx` | Delete | Only consumers were the deleted chapters |
| `frontend/components/CardMobile.tsx` | Delete | Dead placeholder (`<div>CardMobile</div>`) |
| `frontend/components/Profile.tsx` | Delete | Dead; references nonexistent `/profile.jpg` |
| `frontend/components/Separator.tsx` | Delete | Unrendered after recomposition; leaving it keeps a lint error + dead code (decision: removal is the honest lint remediation) |
| `frontend/components/Reproducer.tsx` | Modify | Lint-only: drop `type Props = {}`/unused `props`, add `pausedAt` dep |
| `frontend/components/Videobackground.tsx` | Modify | Lint-only Props fix |

Kept untouched (assets): `public/44ab2a59-*.jpg` orphans, `separator.jpg`
(asset deletion is user-population territory — out of scope; only code retires).
Kept: `Shield.tsx` (reused by CharacterCard), `Reproducer.tsx` playback,
`Videobackground.tsx` video markup, `header`/`hero` assets, fonts.

## Testing Strategy

No test framework exists (config: `strict_tdd: false`, `test_command: null`);
per the specs' verification notes, every scenario maps to a cheaper gate:

| Layer | What to test | Approach |
|---|---|---|
| Static | Type safety of models + loaders | `npm run build` (Turbopack + `tsc` via Next) per slice; zero errors in `types/`+`data/` |
| Static | Lint budget | `npm run lint` per slice, tracking 7/13 → 0/0 at slice-5 exit (baseline in `openspec/testing-capabilities.md:41-43`) |
| Inspection | Data-layer purity; no canon literals; single missing-label; no `.hollander`/global selectors in new anim code; exactly one `ScrollTrigger.update` listener | `grep` checklist in slice verification steps (each spec scenario names its grep) |
| Integration (browser) | Header parity; 55vh offset identical pre/post; season switch updates timeline+rail; rail touch/keyboard/buttons + disabled boundaries; books link iff JSON; footer anchors land under fixed header; audio player survives | Manual acceptance against base commit, side-by-side, desktop + mobile emulation |
| A11y | Spanish names, focus-visible rings, radio-group keyboard, rail `role/aria-label`, disabled controls announced | Keyboard-only + screen-reader walkthrough per season-browser/site-footer specs |
| RM | Reduced-motion emulation (DevTools Rendering) | Full page loads + navigates with zero scrubbed movement; Lenis disabled; static 55vh offset |

## Migration / Rollout

Slice-by-slice ordering is the migration (stacked PRs, 2 → main chain per
proposal): **S1 content-models** (types/JSON/loaders/ui/motion lib — additive,
zero page impact) → **S2 character-roster** (copy migration into JSON,
sections/cards mount, Header 4-line deletion + D6 transfer in the same PR,
chapter deletions, remotePatterns migration, lint of deleted files) → **S3
season-browser** → **S4 books+footer+metadata** (page.tsx already recomposed
in S2; S4 fills the remaining regions) → **S5 motion hardening** (useGSAP
audit pass, RM gate everywhere, Lenis sync finalization, refresh helper,
Reproducer/Videobackground lint to zero). No data migration, no feature flags,
no persisted state — pure code rollout; `npm run build` is the per-slice merge
gate.

Rollback is reverse-order `git revert` per stacked PR (proposal rollback plan
holds). Design-specific notes: S2's D6 pair (Header 4 lines + Characters
offset wrapper) must revert as one commit; if only the Characters half reverts,
the section loses spacing silently — acceptance test re-run required on revert.
`remotePatterns` is behavior-preserving and survives any rollback.

## Threat Matrix

N/A — this change touches no routing (single `/` route preserved), no shell
commands, subprocesses, VCS/PR automation, executable-file classification, or
process-integration boundary. Data flow is build-time JSON → React props.

## Risks / Rollback (design-specific)

| Risk | Likelihood | Mitigation |
|---|---|---|
| `scroll-snap` `mandatory` + programmatic `scrollBy` fight each other near the trailing edge (partial last card) | Medium | One-card step keeps snap points aligned; `scroll-padding-right`; acceptance test on mobile emulation; documented fallback: `snap-proximity` (one-class change) if sticking appears |
| Lenis `anchors:true` behaves differently than expected on 1.3.17 (hash + fixed header overlap) | Medium | `scroll-mt-28` on all section landmarks fixes overlap independently of Lenis; fallback = onClick `lenis.scrollTo(hash)` via context-exposed instance — one component boundary, never `preventDefault` duplication |
| Margin-tween trigger feedback if the offset wrapper is misapplied (margin on root = self-referential progress) | Medium | D6 fixes ownership: trigger=root, margin=inner wrapper; side-by-side acceptance test is the merge gate for S2 |
| SSR/client boundary drift: a section forgetting `"use client"` while importing `@gsap/react` fails the static prerender of `/` | Medium | Every `sections/*` and `cards/*` file starts with `"use client"`; `app/page.tsx` stays Server; loaders import no React — build catches all three violations at prerender |
| Turbopack JSON import edge (dev HMR staleness after hand-editing `data/*.json`) | Low | Next dev watches imported JSON; acceptance: edit a bio in S2 and confirm reload; rebuild (`npm run build`) is the merge gate regardless |
| `motion.create(Image)` in tiltedCard: motion/next image wrapper interaction on React 19 | Medium | S2 spikes it early; fallback = keep `<motion.img>` for remote shields only and local art via a sibling next/image (documented D4 fallback) |
| `@gsap/react` registration order (`useGSAP` used before `registerPlugin` in a client chunk) | Low | `gsap.registerPlugin(useGSAP, ScrollTrigger)` at module top of each consumer file (idempotent, cheap) |
| Hotlinked shield URLs break at runtime | Medium | D8 `onError` → MISSING_CONTENT_LABEL placeholder; local `public/` swap is a JSON-only edit |
| Removing Header lines 51-54 disturbs the timeline duration/positions | Low | The step sits at `, 0)` — deletion cannot shift other steps' start times; timeline-parity acceptance check (hero-header spec) |

## Open Questions

- [ ] Non-blocking, recorded with fallbacks for sdd-tasks/sdd-apply:
      (1) D6 `end: "+=50%"` exact value — tuned during slice-2 browser
      side-by-side (acceptance = visual parity, not constant match);
      (2) `snap-mandatory` → `snap-proximity` fallback if trailing-edge
      sticking appears (one-class change); (3) `motion.create(Image)` spike in
      tiltedCard early in slice 2 (fallback: keep `<motion.img>` for remote
      shields only); (4) Lenis `anchors: true` behavior check on 1.3.17 with
      the documented context-based `lenis.scrollTo` fallback.
- [ ] Scope addition flagged for approval: `Separator.tsx` deletion is not in
      the proposal's removal list but falls out of recomposition + the 0/0
      lint mandate (leaving it = dead code holding one of the 7 baseline
      errors). Surfaced for sdd-tasks to encode explicitly; if rejected, the
      fallback is a lint-only Props fix in slice 5 and the file stays unused.
