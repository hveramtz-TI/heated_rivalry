# content-models Specification

## Purpose

Defines the typed content layer that separates site content from presentation:
TypeScript interfaces in `frontend/types/`, user-populated JSON content files in
`frontend/data/` (assets referenced by `frontend/public/`-rooted paths), and
validating loader modules that expose typed arrays to presentation components.
Missing or malformed content MUST fail soft into explicit Spanish missing-content
states — never invented canon, lorem, or English placeholders.

**Verification note:** no test framework exists in this project. Every scenario
below is verifiable via `npm run build`, `npm run lint`, source inspection
(grep/reading imports), or manual browser acceptance, per
`openspec/config.yaml` testing rules.

## Requirements

### Requirement: Typed Content Interfaces

The system MUST define TypeScript interfaces for `Character`, `Season`,
`Episode`, and `Book` under `frontend/types/`, plus supporting types for image
sources, links, and retailer purchase links. User-supplied content fields that
may not yet exist (e.g. bio text, image paths, purchase links, episode metadata)
MUST be modeled as optional so that "not yet populated" is representable without
fabricated sentinel values. Asset fields MUST be typed as `public/`-rooted path
strings.

#### Scenario: Strict compile over the content layer

- GIVEN the interfaces exist under `frontend/types/`
- WHEN `npm run build` runs (TypeScript check included)
- THEN the build passes with no implicit-any or type errors in `frontend/types/` and `frontend/data/`

#### Scenario: Absent content is representable

- GIVEN a `Character` entry in JSON that supplies only a name
- WHEN loaders type it against the `Character` interface
- THEN typing accepts the entry with the remaining content fields absent (no compiler error, no invented values required to satisfy the type)

### Requirement: JSON As The Single Content Source

All Character, Season, Episode, and Book content MUST live in JSON files under
`frontend/data/` (e.g. `characters.json`, `seasons.json`, `books.json`, with
episodes nested in or keyed by seasons). Presentation components MUST NOT
duplicate content literals in JSX: updating copy MUST require editing JSON only,
with zero changes to component or animation source files.

#### Scenario: Copy edit touches no code

- GIVEN a user changes one bio string inside `frontend/data/characters.json`
- WHEN the app is rebuilt and reloaded
- THEN the Characters section renders the updated string and no source file other than the JSON changed (manual acceptance via `git diff` of the working tree)

#### Scenario: No canon literals in new components

- GIVEN the new section and card components
- WHEN source inspection (grep) is run over them
- THEN no character biography, episode title/date/synopsis, or book metadata literals appear in JSX

### Requirement: Validating Loaders With Fail-Soft Degradation

Loader modules under `frontend/data/` MUST parse the JSON content files,
validate/narrow each entry against the declared interfaces using lightweight
guards, MUST NOT add a new runtime validation dependency, and MUST expose typed
arrays to consumers. Malformed or unrecognizable entries MUST be degraded to the
missing-content state at the loader boundary; loaders MUST NOT throw at render
time and MUST NOT crash the page for a single bad entry.

#### Scenario: Well-formed entries load

- GIVEN a JSON file containing fully populated, well-formed entries
- WHEN the page renders the corresponding section
- THEN every entry appears with its supplied content and the section renders without console errors

#### Scenario: Malformed entry fails soft

- GIVEN a JSON file where one entry has a wrong-typed or structurally invalid field
- WHEN the loaders process that file during page render
- THEN the page still renders, the malformed entry appears only in the Spanish missing-content state, and valid sibling entries are unaffected

#### Scenario: Empty file renders skeleton

- GIVEN a content JSON file ships with an empty array (seasons and books ship empty until the user populates them)
- WHEN the corresponding section renders
- THEN the section skeleton (heading and structural controls) renders with the shared Spanish missing-content state and zero invented values

### Requirement: Shared Spanish Missing-Content State

The system MUST expose exactly one shared Spanish missing-content label,
`"Contenido próximamente"`, consumed by every empty content slot (character
cards, episode rail, book cards, and other missing fields). No component MAY
render lorem text, English placeholder copy, or fabricated facts in place of
missing content. All visible site copy produced by this layer's contract is
Spanish per binding decision 2.

#### Scenario: Missing optional field renders the shared label

- GIVEN a character entry whose artwork path is absent
- WHEN its card renders
- THEN the artwork slot shows `"Contenido próximamente"` and no image element with a guessed source

#### Scenario: Single source of the label

- GIVEN every missing slot consumes the shared state
- WHEN source inspection is run across new components
- THEN the missing-content wording originates from one shared constant, not from per-component string duplicates, and `npm run lint` passes

### Requirement: Data Layer Independence From Presentation And Motion

Modules under `frontend/types/` and `frontend/data/` MUST contain content,
types, and loader logic only. They MUST NOT import presentation components or
GSAP.

#### Scenario: Import purity check

- GIVEN the data and type modules
- WHEN source inspection (grep) is run over their import statements
- THEN none imports from `frontend/components/` and none references `gsap` or `@gsap/react`, while `npm run build` and `npm run lint` still pass
