# season-browser Specification

## Purpose

Defines the Seasons section (`SeasonsSection` with `SeasonSelector`,
`SeasonTimeline`, `EpisodeRail`, `EpisodeCard`): a season selector, an upper
season timeline, and a horizontally scrolling episode rail, driven entirely by
JSON content (empty until the user populates it). Manual scrolling is native —
touch, keyboard, and prev/next buttons — and animation never takes control away
from the scroller.

**Verification note:** scenarios are checkable via `npm run build`, `npm run
lint`, source inspection, and manual browser acceptance (desktop, touch
device/emulation, keyboard-only, and `prefers-reduced-motion` emulation); no
test framework exists.

## Requirements

### Requirement: JSON-Driven Browser Structure

The Seasons section MUST render a season selector, an upper season timeline, and
a horizontal episode rail whose season and episode data come exclusively from
the validated content loaders. No season names, episode titles, dates,
synopses, or artwork MAY be hard-coded in components, and none MAY be invented
while the JSON is empty.

#### Scenario: Populated data drives every pane

- GIVEN `seasons.json` (with episodes) supplies seasons and episodes
- WHEN the section renders
- THEN the selector lists the supplied seasons, the timeline reflects them, and the rail shows the selected season's episodes with no additional fabricated entries

### Requirement: Season Selection Updates Timeline And Episodes

Selecting a season MUST update both the upper timeline context and the episode
list below it to that season's data. The selection control MUST be operable by
pointer and keyboard with accessible Spanish names.

#### Scenario: Selection switches content

- GIVEN two or more seasons exist in JSON and one is selected
- WHEN the user activates a different season in the selector
- THEN the timeline's active indication and the rail's episode cards both change to the newly selected season, and the previously selected season's episodes are no longer listed

#### Scenario: Keyboard-operable selection

- GIVEN a keyboard-only user tabs into the Seasons section
- WHEN they activate a season option
- THEN the selection changes without any pointer input and the option exposes an accessible Spanish name (manual screen-reader/tab acceptance)

### Requirement: Native Overflow Scrolling Preserved

The episode rail MUST scroll horizontally via native CSS overflow. Touch drag
and keyboard scrolling of the focusable scroll container MUST work, and GSAP
MUST NOT hijack, replace, or fight that native overflow (no pin/fake-horizontal
treatment in this change).

#### Scenario: Touch scroll

- GIVEN a season with enough episodes to overflow the rail
- WHEN a touch user swipes horizontally across the rail
- THEN content scrolls natively at the platform's own pace with no animation interfering

#### Scenario: Keyboard scroll

- GIVEN the rail scroll container is focusable and focused
- WHEN the user presses the horizontal arrow keys
- THEN the rail scrolls natively and a visible `:focus-visible` indicator is shown on the container and its controls

#### Scenario: Animation does not own scroll position

- GIVEN the Seasons section ships its entrance and transition timelines
- WHEN source inspection is run on the section's animation code
- THEN no timeline tweens the rail's `scrollLeft`/scroll position or attaches a pin/`containerAnimation` horizontal hijack, while section entrance timelines remain allowed on other targets

### Requirement: Prev/Next Buttons With Correct Boundary States

The rail MUST provide previous and next controls, each with an accessible
Spanish name describing its direction. The controls MUST reflect scroll
boundaries: at the leading edge the previous control MUST be disabled; at the
trailing edge the next control MUST be disabled; in the middle both MUST be
enabled; when content does not overflow, both MUST be disabled. Activating a
control MUST scroll the rail by a visible card increment.

#### Scenario: Leading boundary

- GIVEN the rail is scrolled fully to its start position with overflowing content
- WHEN the section renders or the user scrolls back to the start
- THEN the previous control is disabled (non-operable, visibly marked) and the next control is enabled

#### Scenario: Trailing boundary

- GIVEN the rail is scrolled fully to its end position
- WHEN the boundary state is evaluated
- THEN the next control is disabled and the previous control is enabled

#### Scenario: No overflow

- GIVEN a season with only enough episodes to fit the rail width
- WHEN the section renders
- THEN both direction controls are disabled while all episode cards remain fully readable

### Requirement: Empty-Until-Populated Season Browser

With zero seasons or zero episodes in JSON, the section MUST render its
skeleton — heading, selector area, timeline area, rail area — with Spanish
`"Contenido próximamente"` states and MUST NOT present broken, dead, or
confusing controls. Controls in the empty state MUST be disabled or inert, and
no exception may surface in the browser console.

#### Scenario: Empty seasons

- GIVEN `seasons.json` ships as an empty array
- WHEN the page loads
- THEN the Seasons section shows its heading plus the Spanish missing-content state, the selector and direction controls are disabled rather than operable-nothing, and scrolling the page is unaffected

#### Scenario: Season with no episodes

- GIVEN one season exists but its episode list is empty
- WHEN that season is selected
- THEN the rail area shows the Spanish missing-content state and both direction controls are disabled

### Requirement: Season Transition Motion

A season change MAY animate via a short section-local timeline to reveal the
new episode set. The transition MUST NOT hide information, MUST NOT block
interaction beyond its duration, and MUST gate behind the shared
reduced-motion check.

#### Scenario: Reduced-motion season transition

- GIVEN the user prefers reduced motion
- WHEN they select a different season
- THEN the timeline and episode list update immediately in their resting state with all information present and no movement

#### Scenario: Transition preserves scroller usability

- GIVEN motion is enabled and a season switch is animating
- WHEN the user scrolls the rail during the transition
- THEN native overflow keeps working and the transition does not trap or reset the scroll position mid-interaction

### Requirement: Accessible Section Landmark And Headings

The Seasons section MUST expose a semantic landmark with a Spanish heading and
Spanish control names consistent with the rest of the page, so assistive
technology announces the section and its controls without English fragments.

#### Scenario: AT walkthrough of the section

- GIVEN a screen reader user reaches the Seasons section
- WHEN they navigate the region
- THEN the section heading, season options, and rail controls are all announced with Spanish names and correct disabled state, and `npm run build` and `npm run lint` pass with the accessibility markup present
