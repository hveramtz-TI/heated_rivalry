# book-catalog Specification

## Purpose

Defines the Books section (`BooksSection` + `BookCard`): a catalog of series
books rendered from JSON content with title, cover, metadata, and OPTIONAL
retailer deep links only (`purchaseUrl(s)`). There is no backend, no cart, and
no purchase flow; a purchase affordance never appears unless its authoritative
URL exists in the data (binding decision 4).

**Verification note:** scenarios are checkable via `npm run build`, `npm run
lint`, source inspection, and manual browser acceptance; no test framework
exists.

## Requirements

### Requirement: JSON-Driven Book Cards

The Books section MUST render one card per book returned by the validated
content loader, showing the supplied cover image, title, and metadata. Book
content MUST NOT be hard-coded in JSX, and the shipped JSON may be empty until
the user supplies titles — in which case the section MUST render its Spanish
missing-content state with zero invented entries.

#### Scenario: Populated catalog renders

- GIVEN `books.json` supplies one or more fully populated book entries
- WHEN the page loads
- THEN each entry renders exactly one card with its cover, title, and metadata, and no additional cards appear

#### Scenario: Empty catalog renders gap state

- GIVEN `books.json` ships as an empty array
- WHEN the page loads
- THEN the Books section shows its heading plus the Spanish `"Contenido próximamente"` state and no card shells with fabricated titles or covers

### Requirement: Retailer Deep Links Only When Authoritative

Each book entry MAY carry optional retailer purchase links (`purchaseUrl(s)`)
in JSON. The system MUST render a purchase link only for a URL that is present
in the data, and MUST NOT fabricate, guess, or template any retailer URL. No
cart, checkout, or backend integration exists in this capability.

#### Scenario: Entry with retailer link

- GIVEN a book entry includes a retailer link with a URL
- WHEN its card renders
- THEN the card exposes that link, activating it navigates to the exact URL from the JSON, and the link has a Spanish accessible name identifying it as an external destination

#### Scenario: Entry without retailer link

- GIVEN a book entry has no `purchaseUrl(s)` value
- WHEN its card renders
- THEN no purchase affordance of any kind appears on the card — not a disabled button, not a generic store link, not a placeholder URL

#### Scenario: No purchase machinery in source

- GIVEN the Books capability is fully implemented
- WHEN source inspection (grep) is run over the new components and data layer
- THEN no cart, checkout, API, or hard-coded retailer URL exists in the change, and `npm run build` passes

### Requirement: Spanish Catalog Copy And Missing Metadata

All visible copy in the Books section (heading, labels, link names) MUST be in
Spanish per binding decision 2. Missing optional fields on an existing entry
(e.g. no cover image, no description) MUST render the shared Spanish
missing-content state rather than an invented value or an English placeholder.

#### Scenario: Missing cover on an existing entry

- GIVEN a book entry exists with title metadata but no cover path
- WHEN its card renders
- THEN the cover slot shows the Spanish missing-content treatment and the supplied title metadata still displays

### Requirement: Book Covers Follow The Content Image Policy

Cover images referenced by cards MUST resolve either to a `public/`-rooted path
from JSON or to a host permitted by the configured Next image policy; an
unconfigured remote source MUST NOT be introduced by this capability.

#### Scenario: Public-path cover renders

- GIVEN a book entry references a cover under `frontend/public/`
- WHEN the page loads
- THEN `npm run build` completes without any new image-allowlist entry and the cover renders through the Next image pipeline without a policy error
