# Proposal: Apply the Heated Rivalry Single-Page Content Plan

## Intent

Extend the existing cinematic Heated Rivalry landing page into a complete,
data-driven single-page experience. The page should preserve the current Hero-
to-Header transformation while making the character roster, seasons, episodes,
books, and site footer discoverable without detail pages. The plan separates
content from presentation so future content updates do not require rewriting
animation or layout code.

## Scope

### In scope

- Preserve the existing `Header` hero video/logo transformation and its GSAP
  `ScrollTrigger` timeline.
- Replace the current character-specific page composition with one Characters
  section that renders every configured character as an informational,
  game-board-style card in the same section.
- Add a Seasons section with an accessible season selector, an upper season
  timeline, and a horizontally scrollable episode list below it.
- Support native manual episode overflow scrolling plus previous/next controls,
  touch input, keyboard operation, and disabled boundary states.
- Use GSAP timelines and `ScrollTrigger` for section entrances and season
  transitions without taking control away from the episode scroller.
- Add a Books section with series books and explicit purchase information.
- Add a Footer with the approved navigation, social, legal, and attribution
  content once those product decisions are supplied.
- Define typed TypeScript interfaces and separate data modules from
  presentation components for `Character`, `Season`, `Episode`, `Book`, and
  related content.
- Account for responsive layouts, visible focus, semantic landmarks, reduced
  motion, the existing audio player, remote images, client-only animation,
  scoped animation cleanup, and the current lint baseline.

### Out of scope

- Character detail routes or separate detail pages.
- Inventing canon, episode metadata, book purchase destinations, or missing
  artwork when authoritative content is unavailable.
- Replacing the existing audio player or soundtrack behavior.
- Replacing Lenis, introducing a new routing model, or redesigning the entire
  visual identity documented in `DESIGN.md`.
- Adding a test framework or claiming workspace-wide test coverage where none
  exists.

## Capabilities

### New capabilities

- `character-roster`: A unified, data-driven Characters section with
  informational cards for all configured characters.
- `season-browser`: Season selection, timeline context, episode browsing, and
  horizontal manual navigation.
- `book-catalog`: Series books with title, metadata, cover, and purchase
  information.
- `site-footer`: A structured footer with approved links and supporting site
  information.
- `content-models`: Typed domain interfaces and independently maintained data
  modules for page content.

### Modified capabilities

- `hero-header`: Preserve the current Hero-to-Header behavior while integrating
  it into the expanded page composition.

## Content and data architecture

Create a small domain model under `frontend/types/` and static content modules
under `frontend/data/`. At minimum, define typed `Character`, `Season`,
`Episode`, and `Book` interfaces, plus supporting types for image sources,
links, labels, and purchase providers. Data modules must contain content and
asset references only; they must not import presentation components or GSAP.

Presentation components consume the typed arrays through props. Proposed
boundaries are `CharactersSection`/`CharacterCard`,
`SeasonsSection`/`SeasonSelector`/`SeasonTimeline`/`EpisodeRail`/`EpisodeCard`,
`BooksSection`/`BookCard`, and `Footer`. Existing character components should
be reduced to reusable primitives or replaced after their content is migrated.
Do not duplicate character or episode literals in JSX.

Remote image URLs must be represented deliberately and remain compatible with
the configured Next image policy, or use a documented safe fallback. Missing
assets and undecided content must be explicit data states rather than guessed
values.

## Component and page boundaries

`frontend/app/page.tsx` should compose the page in this order: protected Hero /
Header, Characters, Seasons, Books, and Footer, while retaining the existing
audio player mounted by the application shell. Section components own semantic
landmarks, layout, and local interaction state. Cards own only their display
and card-level actions. The episode rail owns scrolling and navigation but
does not own season data or global page state.

Use headings and landmarks that expose the information hierarchy to assistive
technology. Controls must have accessible names, visible `:focus-visible`
states, correct disabled states, and no hover-only information. Responsive
layouts should preserve readable card content and permit touch scrolling rather
than forcing desktop dimensions onto mobile screens.

## Animation approach

Keep `Header.tsx` as a protected animation boundary: its scrubbed timeline,
fixed positioning, video behavior, and logo collapse must remain functionally
unchanged. New animations must be isolated to their section root.

Prefer `useGSAP` with a scoped ref if `@gsap/react` is available. Otherwise use
`gsap.context` with a guaranteed `ctx.revert()` cleanup. Register
`ScrollTrigger` client-side only. Put `ScrollTrigger` on top-level timelines,
not on child tweens inside a timeline, and create triggers in page order.

Use short section entrance timelines and season-transition timelines to reveal
content and update visual context. Do not use GSAP to replace native episode
overflow. If a pinned/fake horizontal treatment is ever introduced, its
horizontal tween must use `ease: "none"`; the preferred implementation here is
native overflow because manual scrolling is a requirement. Call
`ScrollTrigger.refresh()` after dynamic content, images, or fonts change layout.

Respect `prefers-reduced-motion`: disable scrubbing and nonessential movement,
show content in its resting state, and retain all navigation and information.
Avoid animation selector collisions by using refs and scoped contexts rather
than global selectors.

## Acceptance criteria

- [ ] The existing Hero-to-Header transformation remains visually and
      behaviorally intact.
- [ ] One Characters section renders every configured character as an
      informational card; no character detail route is introduced.
- [ ] Character, season, episode, and book content is typed and stored outside
      presentation components.
- [ ] Season selection updates the upper timeline and the episode list below it.
- [ ] The episode list supports native horizontal scrolling, touch input,
      keyboard access, and previous/next controls with correct boundary states.
- [ ] Books show the approved purchase information without fabricated links.
- [ ] Footer content is present and uses approved destinations and labels.
- [ ] New GSAP animations are client-only, scoped, cleaned up, and compatible
      with reduced motion.
- [ ] The page remains usable at mobile, tablet, and desktop widths, with
      visible focus and semantic accessible controls.
- [ ] The persistent audio player remains mounted and usable.
- [ ] Remote image configuration and loading choices are documented and safe.
- [ ] TypeScript continues to pass; lint changes distinguish new regressions
      from the known baseline failures.

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| The complete roster and content metadata are not yet authoritative. | High | Block final data completion on approved content; render explicit missing-data states rather than inventing canon. |
| The restructure may exceed the 400-line review budget. | High | Forecast at task planning and split into reviewable work units if needed. |
| Repeated cards can collide through global GSAP selectors. | High | Scope every animation to its section/component root and clean up on unmount. |
| Dynamic images and fonts shift ScrollTrigger positions. | Medium | Refresh after layout-affecting content loads and use stable dimensions. |
| Existing lint is already failing. | Medium | Record the baseline, avoid expanding it, and decide explicitly whether remediation is part of implementation. |
| Large video, audio, and image assets affect performance. | Medium | Preserve the player, choose intentional loading/priority, constrain image dimensions, and avoid eager loading the entire catalog. |

## Unresolved product decisions

- Which characters comprise the complete roster, and which fields are approved
  for each card?
- What seasons exist, in what order, and which season is selected initially?
- What episode titles, summaries, artwork, dates, and links are approved?
- Which books belong to the series, and which purchase providers and URLs are
  authoritative?
- What footer navigation, legal text, social destinations, and credits should
  appear?
- Do cards have actions beyond information display, such as external links or
  expandable content?
- Is lint baseline remediation included in this change or tracked separately?

## Rollback plan

Revert the page composition, new section components, data/type modules, style
changes, and image-policy updates as one change set. Restore the prior
`page.tsx` composition and retain the existing `Header` implementation. Since
the proposal does not alter the audio-player contract or persisted data, the
rollback has no migration step.

## Success criteria

- The single home route presents the approved roster, season browser, books,
  and footer in a coherent responsive experience.
- Users can browse episodes manually without depending on animation or a
  detail-page route.
- Content can be updated in data modules without editing presentation or GSAP
  logic.
- Existing hero/header and audio behavior remain intact, and no new lint or
  TypeScript regressions are introduced.

## Next step

Resolve the product decisions above, then run the SDD spec/design phases. Task
planning must forecast the 400-line review budget before implementation begins.
