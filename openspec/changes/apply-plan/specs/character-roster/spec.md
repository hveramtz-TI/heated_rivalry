# character-roster Specification

## Purpose

Defines the unified Characters section (`CharactersSection` + `CharacterCard`)
that replaces the hand-authored character chapters (`Hollander.tsx`,
`Rozanov.tsx`, `Hunter.tsx`) with one data-driven roster of informational
cards, all copy in Spanish. It also assigns ownership of the 55vh first-section
top-offset contract previously tweened by `Header.tsx` against `.hollander`.

**Verification note:** scenarios are checkable via `npm run build`, `npm run
lint`, source inspection, and manual browser acceptance; no test framework
exists.

## Requirements

### Requirement: One Data-Driven Roster Section

The page MUST render exactly one Characters section that displays every
character returned by the content loader as an informational card. The shipped
roster content MUST be exactly the three known characters — Hollander, Rozanov,
and Hunter — with no additional characters invented. Adding a fourth card later
MUST require only a JSON content change.

#### Scenario: Three cards render

- GIVEN `frontend/data/characters.json` contains the three configured characters
- WHEN the page loads
- THEN one Characters section landmark contains exactly three cards, each showing that character's name, and `npm run build` passes

#### Scenario: Rebuild the page composition

- GIVEN the legacy chapter components are retired
- WHEN `frontend/app/page.tsx` is inspected and the app loads
- THEN the single route composes Header → Characters → Seasons → Books → Footer and no per-character chapter component is rendered

### Requirement: Migrated Spanish Copy

All roster copy MUST be Spanish per binding decision 2. Rozanov's existing
Spanish bio MUST be migrated into JSON verbatim (as-is, no rewording).
Hollander's existing English bio MUST be translated into Spanish — translation
of the existing text only, adding and omitting no facts. Hunter has no supplied
artwork or bio; the shipped content MUST leave those fields absent rather than
invented.

#### Scenario: Rozanov migrated verbatim

- GIVEN the legacy Spanish bio text in `Rozanov.tsx` before deletion
- WHEN the Rozanov card renders from JSON after migration
- THEN the displayed bio is identical to the legacy Spanish copy (manual text comparison)

#### Scenario: Hollander translated to Spanish

- GIVEN the legacy English bio text in `Hollander.tsx`
- WHEN the Hollander card renders from JSON
- THEN the bio is entirely in Spanish and conveys the same facts, with no new claims present

#### Scenario: Hunter shows explicit missing-content state

- GIVEN Hunter's JSON entry supplies a name only (no artwork, no bio)
- WHEN the Hunter card renders
- THEN the name displays and each empty slot shows the Spanish `"Contenido próximamente"` state, with no fabricated biography or image

### Requirement: Cards Are Informational Only

Character cards MUST limit their behavior to information display. They MUST NOT
offer actions beyond display (no expand affordance, no links, no buttons),
consistent with the resolved card-actions decision.

#### Scenario: No interactive elements inside cards

- GIVEN the three cards render
- WHEN the section is inspected in the browser and in source
- THEN cards contain no links, buttons, or click handlers, and card text is fully visible without interaction (no hover-only information)

### Requirement: No Character Detail Routes

The application MUST continue to ship a single home route. The roster MUST NOT
introduce character detail pages or routes.

#### Scenario: Route manifest unchanged

- GIVEN the finished change
- WHEN `npm run build` prints its route summary
- THEN the generated routes contain only `/` (plus Next.js internals) and no per-character path exists

### Requirement: Ownership Of The 55vh Offset Contract

The Characters section MUST own the first-section top offset formerly produced
by the `Header.tsx` `.hollander` marginTop tween (the step at
`Header.tsx:51-54`, removed per the hero-header spec). The offset MUST be
implemented inside the section's own scoped animation code, and the resulting
first-viewport spacing after the header collapse MUST match the pre-change
behavior.

#### Scenario: Spacing identical after transfer

- GIVEN the Header hero→collapse sequence completes on scroll
- WHEN the Characters section settles below the collapsed header
- THEN the top spacing is visually equivalent to the pre-change 55vh offset applied by the old tween (manual before/after acceptance on the same viewport)

#### Scenario: Offset under reduced motion

- GIVEN the user prefers reduced motion
- WHEN the page loads and the user scrolls to the Characters section
- THEN the offset reaches its final spacing without scroll-scrubbed movement and all card content is visible and navigable

### Requirement: Retirement Of Legacy Chapter Components

`Hollander.tsx`, `Rozanov.tsx`, `Hunter.tsx`, and `Bio.tsx` MUST be removed
after their content is migrated, along with the dead remnants `CardMobile.tsx`,
`Profile.tsx`, and the broken `@/public/hollanderCard.png` import, so no
orphaned selectors or latent build breaks remain.

#### Scenario: Clean build after deletions

- GIVEN the legacy and dead components are deleted
- WHEN `npm run build` and `npm run lint` run
- THEN the build passes with no unresolved imports, and the lint baseline (7 errors / 13 warnings) does not grow from these files (their offenses disappear with them)
