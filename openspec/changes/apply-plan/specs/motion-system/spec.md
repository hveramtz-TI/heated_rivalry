# motion-system Specification

## Purpose

Defines site-wide animation governance for the data-driven page: `@gsap/react`
`useGSAP` with scoped refs for every new section animation, guaranteed cleanup
(revert) semantics, client-only GSAP usage, a single shared
`prefers-reduced-motion` gate, centralized Lenis↔ScrollTrigger synchronization,
`ScrollTrigger.refresh()` after layout-affecting loads, and migration of the
Next.js image allowlist from deprecated `images.domains` to
`images.remotePatterns` for the two existing remote hosts. The protected
`hero-header` timeline is the only exempt code and is unchanged except its
documented margin-step removal.

**Verification note:** scenarios are checkable via source inspection (grep over
new animation code), `npm run build`, `npm run lint`, and manual browser
acceptance including `prefers-reduced-motion` emulation; no test framework
exists.

## Requirements

### Requirement: Scoped useGSAP For All New Animations

The project MUST add the approved `@gsap/react` dependency, and every animation
introduced by this change MUST run through `useGSAP` with a scope ref rooted at
its own section/component. New animation code MUST NOT use global class or ID
selectors that could match elements outside the animating component, and
per-card effects MUST target refs so repeated cards animate individually rather
than colliding on a shared selector.

#### Scenario: Repeated cards animate per instance

- GIVEN the Characters and Books sections render multiple cards with entrance motion
- WHEN each section's timeline plays
- THEN only that section's scoped elements animate, and no tween in new code targets an unscoped global selector (verified by source inspection and visual check)

#### Scenario: Dependency added at the boundary

- GIVEN `frontend/package.json` lists `@gsap/react`
- WHEN `npm run build` and `npm run lint` run
- THEN both pass and GSAP/ScrollTrigger/`useGSAP` registration executes client-side only — the static prerender of `/` succeeds with no server-side DOM access

### Requirement: Guaranteed Cleanup On Unmount

Every animation and ScrollTrigger created by new code MUST be reverted and
killed automatically on unmount (via `useGSAP`, or `gsap.context` with
guaranteed `ctx.revert()` where used), and triggers MUST attach only to
top-level tweens/timelines — never to child tweens inside a timeline.

#### Scenario: No stale triggers after unmount

- GIVEN a section with scroll-linked animation is mounted and then unmounted (e.g. the season rail re-creates its content on season switch)
- WHEN the page keeps scrolling afterwards
- THEN no console errors occur, no animation updates detached nodes, and the previous instances' triggers are gone

### Requirement: Central Lenis↔ScrollTrigger Sync

`LenisProvider.tsx` MUST be the single owner of smooth-scroll integration,
wiring `lenis.on('scroll', ScrollTrigger.update)` alongside its existing rAF
loop. No other component MAY register a competing global scroll-sync listener.

#### Scenario: Scroll position and playheads stay in sync

- GIVEN the synced provider and the Header's scrubbed timeline plus section triggers
- WHEN the user scrolls with Lenis smoothing active
- THEN scrubbed timelines and section reveals track the actual scroll position without lag or stuck playheads (manual acceptance), and grep confirms exactly one `ScrollTrigger.update` scroll listener in the codebase

### Requirement: Refresh After Layout-Affecting Changes

The system MUST call `ScrollTrigger.refresh()` after dynamic changes that move
trigger positions — populated content swapping in (season transitions, loader
results) and image/font loads that resize cards — while cards reserve stable
dimensions to minimize shifts.

#### Scenario: Season switch recalibrates triggers

- GIVEN the seasons browser is populated and a season transition changes rail height or content
- WHEN the transition settles
- THEN subsequent section reveals still fire at correct scroll positions because a refresh ran after the layout change (manual scroll acceptance)

#### Scenario: Image load does not strand a trigger

- GIVEN a card image finishes loading after first paint and resizes layout
- WHEN the user then scrolls the affected section
- THEN entrance triggers align with the final layout, not the pre-load layout

### Requirement: Reduced-Motion Resting States

All new animation MUST pass through one shared reduced-motion check. When the
user prefers reduced motion, the system MUST render every section in its final
resting state immediately: no scroll-scrubbed or entrance movement in new code,
no disabled functionality, and all content, navigation, and controls (including
the episode rail and its buttons) remain fully available.

#### Scenario: Reduced-motion full page

- GIVEN `prefers-reduced-motion: reduce` is enabled at the OS level
- WHEN the user loads and scrolls the entire page
- THEN Header and all sections present readable content immediately without movement, and every interaction — season selection, rail scrolling, footer anchors, audio player — works normally

#### Scenario: Motion gate is shared, not duplicated

- GIVEN all new section timelines are wired
- WHEN source inspection is run over new animation code
- THEN the reduced-motion decision comes from the single shared check consumed by every new timeline (no ad-hoc per-component media queries), and `npm run lint` passes

### Requirement: Image Allowlist Migrated To remotePatterns

`frontend/next.config.ts` MUST replace the deprecated `images.domains`
allowlist with `images.remotePatterns` covering exactly the two currently used
hosts, `static.wikia.nocookie.net` and `upload.wikimedia.org`, as an interim
policy for existing shield art. New site artwork MUST be referenced by
`public/`-rooted paths, and the remote allowlist MUST NOT grow within this
change.

#### Scenario: Deprecation warning gone

- GIVEN the config uses `remotePatterns`
- WHEN `npm run build` runs
- THEN the output no longer contains the `images.domains` deprecation warning and the build succeeds

#### Scenario: Existing remote art still optimized

- GIVEN an existing component references a shield image on one of the two allowlisted hosts
- WHEN the page renders
- THEN the image loads through the Next optimizer exactly as before the migration (behavior-preserving), and requests to hosts outside the two entries are rejected by the image optimizer
