# hero-header Specification

## Purpose

Codifies the protected Header boundary as a capability spec (no prior spec
existed): the existing scrubbed hero→collapse timeline keeps its behavior
unchanged through this change, with exactly one documented exception — the
`.hollander` marginTop tween step is removed and re-owned by the
`character-roster` capability. The persistent audio player contract mounted by
the application shell is likewise preserved.

**Verification note:** scenarios are checkable via source inspection, `npm run
build`, `npm run lint`, and manual browser acceptance comparing scroll behavior
against the pre-change deployment/base commit; no test framework exists.

## Requirements

### Requirement: Protected Hero→Collapse Timeline Behavior

The Header MUST retain its current scroll behavior functionally unchanged:
fixed positioning, the full-screen looping-video hero, the centered logo
collapsing to its compact fixed-header state, the header/video shrinking to the
collapsed height, and the black video fade — all driven by the existing
scrubbed `ScrollTrigger` timeline (start `1% top`, end `bottom 50%`) with its
existing cleanup. This change MUST NOT alter the timeline's other steps,
easing, trigger range, or visual result.

#### Scenario: Scroll sequence visually unchanged

- GIVEN the pre-change base commit and the post-change build rendered side by side
- WHEN the user scrolls through the hero on both
- THEN the logo collapse, header shrink, and video fade are visually and behaviorally identical, apart from the first-section offset now owned by the Characters section

#### Scenario: Timeline integrity by inspection

- GIVEN the change is complete on the working branch
- WHEN `frontend/components/Header.tsx` is inspected after the change
- THEN every tween step except the removed margin step matches the base commit, and the `tl.scrollTrigger?.kill()` / `tl.kill()` cleanup remains intact

### Requirement: Single Documented Margin-Step Removal

The only behavioral modification to Header MUST be deletion of the `.hollander`
`marginTop: 55vh` tween step (the step at `Header.tsx:51-54`). After removal,
Header MUST NOT animate, query, or depend on any selector outside its own
component, and the offset contract MUST be documented as transferred to
`character-roster` (which owns it in its own scoped animation, per that
capability's spec).

#### Scenario: No cross-component selector remains

- GIVEN the margin step has been removed from Header
- WHEN source inspection (grep) is run over `Header.tsx`
- THEN no `.hollander` selector, no `marginTop: "55vh"` step, and no other global selector reaching outside the header is present, while `npm run build` and `npm run lint` pass

#### Scenario: Header no longer reaches into content sections

- GIVEN the Characters section is mounted without any `.hollander` class anywhere in the DOM
- WHEN the user scrolls the hero sequence
- THEN the Header timeline runs without console errors or orphaned-target effects, and the first-section spacing still comes from the Characters section's own offset contract

### Requirement: Persistent Audio Player Contract

The floating audio player (`Reproducer.tsx`) MUST remain mounted once by the
application shell across the recomposed page, keeping its current behavior:
fixed bottom-right placement above page content, play/pause and volume
controls, Spanish accessible labels, and no autoplay. This change MUST NOT
modify its playback logic.

#### Scenario: Player survives the restructure

- GIVEN the new page composition (Header → Characters → Seasons → Books → Footer)
- WHEN the user scrolls from the hero to the footer and operates the player
- THEN the player stays mounted and usable at all scroll positions and its Spanish control labels are unchanged

#### Scenario: Player stacking preserved

- GIVEN the new sections introduce their own positioned layers
- WHEN the page renders at mobile and desktop widths
- THEN the player remains reachable and does not cover critical section content, matching its existing z-order contract
