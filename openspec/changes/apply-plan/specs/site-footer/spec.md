# site-footer Specification

## Purpose

Defines the static `Footer` component closing the single-page composition: the
site logo, internal anchor navigation to on-page sections, a Spanish copyright
line, and simple Spanish credits (binding decision 5). The footer is static —
no CMS, no social/legal destinations beyond what the user explicitly supplies.

**Verification note:** scenarios are checkable via `npm run build`, `npm run
lint`, source inspection, and manual browser acceptance; no test framework
exists.

## Requirements

### Requirement: Static Footer At End Of Composition

The page MUST end with a footer landmark rendered as a static component after
the Books section, containing the site logo, internal section navigation, a
copyright notice, and credits. Its content MUST NOT depend on the JSON content
loaders.

#### Scenario: Footer present in page order

- GIVEN the finished single-page composition
- WHEN the page loads and the user scrolls to the bottom
- THEN a footer landmark is the final content region and contains the logo, a navigation list, the copyright line, and the credits block

### Requirement: Internal Anchor Navigation Only

Footer navigation MUST link only to sections that exist on the same page
(Characters, Seasons, Books) via in-page anchors, and activating an entry MUST
bring the corresponding section into view. The footer MUST NOT contain
fabricated external, social, or legal destinations; such links MAY be added
later only from user-supplied values.

#### Scenario: Anchor resolves to its section

- GIVEN the footer renders its navigation
- WHEN the user activates each navigation entry
- THEN the viewport lands on the corresponding section of the same page and no navigation leaves the route

#### Scenario: No invented destinations

- GIVEN the footer ships with the resolved static structure (decision 5)
- WHEN source inspection (grep) is run over the footer component
- THEN every hyperlink target is an in-page anchor (no external URL, no placeholder domain) and `npm run lint` passes

### Requirement: Spanish Copyright And Credits Copy

The copyright line and the credits block MUST display Spanish copy per binding
decision 2. The specific wording of credits is site content this change ships
as simple, non-fabricated text (site identification and attribution language
only); it MUST NOT name people, organizations, or legal entities not already
present in the repository.

#### Scenario: Spanish static copy renders

- GIVEN the footer renders
- WHEN the copyright and credits areas are inspected visually
- THEN their copy is entirely in Spanish, is legible against the footer background per DESIGN.md contrast rules, and contains no invented entity names or lorem text

### Requirement: Accessible Footer Controls

Footer navigation entries MUST be standard focusable links with visible
`:focus-visible` states and Spanish accessible names, and the footer layout
MUST remain usable at mobile, tablet, and desktop widths.

#### Scenario: Keyboard pass through the footer

- GIVEN a keyboard-only user tabs to the end of the page
- WHEN they traverse the footer
- THEN each navigation entry receives a visible focus indicator in reading order and the footer reflows without overflow at a mobile viewport width
