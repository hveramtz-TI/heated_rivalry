# Character Card Visualizer — Design Spec

Reference: `frontend/public/referenciaCard.jpg` (graded PSA slab of the 1998 Pokémon "Illustrator – Holo" promo).

This document translates the anatomy of that graded slab into a Heated Rivalry collectible-card viewer for the three roster entries in `frontend/data/characters.json`. It complements `DESIGN.md`; where the two differ for this component, this spec wins. It revives the conventions of the earlier `character-cards-slab` iteration (fictional deterministic chrome, shields overlay, site identity only) on top of the current simplified architecture: plain server components, Tailwind only, no GSAP/tilt layer.

## Quick path

1. Rebuild `frontend/components/cards/CharacterCard.tsx` as the slab below (one root `<article>` per character, no focusable elements).
2. Feed it strictly from `Character` data (`name`, `bio`, `cardArt`, `portrait`, `accent`, `shields`); `CharactersSection.tsx` keeps its current grid and passes the roster index for the deterministic ordinal.
3. Verify against the Acceptance checklist: build passes, lint stays at the known baseline, Hunter's missing-data state renders cleanly.

## Reference anatomy (what to keep from `referenciaCard.jpg`)

Five stacked zones, front to back:

1. **Acrylic case** — translucent hard shell, rounded corners, visible edge bevel, diagonal glare, small grip ridges near the lower corners.
2. **Label band** — white paper slip: a saturated brand strip on top, three left-aligned fact lines, grade + certification number right-aligned, a thin barcode under the facts.
3. **Card frame** — colored border around the card face with a dark name banner plate at top.
4. **Art window** — illustration inset with a thin dark rim; tiny emblem in a bottom corner.
5. **Text panel** — cream box with a micro-header, a paragraph of copy, and a centered microcopy line at the bottom edge.

The structure is the design. The content (marks, names, copy) is not: every Pokémon, PSA, Corocoro or Nintendo element is replaced by site identity or deterministic decoration.

## Reference → Heated Rivalry translation

| Reference zone | Original | Adaptation |
| --- | --- | --- |
| Brand strip | PSA logo, red band | Red band (`#FF002A`) with `HEATED RIVALRY` wordmark text; no grading-company marks |
| Fact lines | "1998 P.M. JAPANESE PROMO / ILLUSTRATOR – HOLO / COROCORO COMICS" | `2026 HEATED RIVALRY PROMO` / `{NAME} — HOLO` / `RIVALRY SERIES` |
| Grade + cert | `MINT 9`, `18518177`, barcode | Fictional `GEM MINT 10`, card number `#00N`, cert `80000000 + ordinal × 1357911`, pure-CSS barcode strip |
| Card frame | Uniform Pokémon yellow | Per-accent frame: red (`#FF002A → #280408`) or blue (`#002AFF → #080428`) diagonal gradient; `neutral` gray for Hunter |
| Name banner | "ILLUSTRATOR" plate | Character `name`, heavy uppercase on a cream plate with a hairline ink border and a 2px accent rule under it |
| Sub-label | Japanese descriptor line | Omitted — the accent rule carries the slot |
| Art window | Illustrator artwork, black rim | `cardArt` image, 5:6 slot, thin ink rim, `object-cover object-top`; placeholder panel when absent |
| Bottom emblem | Set symbol | Team + national `shields` badges overlaid bottom-left of the art window |
| Text panel | Award proclamation, Japanese body | `bio` verbatim (Spanish, no truncation), auto height |
| Copyright microcopy | "©1995–2002 Nintendo/Creatures/GAME FREAK" | `HEATED RIVALRY FAN ARCHIVE — DECORATIVE GRADE` centered microcopy |

**Banned:** real grading-company or franchise marks, the Pokémon yellow as the dominant frame color, any invented canon presented as fact. All chrome strings (grade, cert, series lines, barcode) are decorative and must be `aria-hidden`.

## Data mapping — `characters.json` → visual slots

| JSON path | Slot | Missing-data behavior |
| --- | --- | --- |
| `id` | React key only | — |
| `name` | Label fact line 2 + card name banner | `MISSING_CONTENT_LABEL` from `@/data/ui` |
| `bio` | Text panel paragraph | Panel shows `MISSING_CONTENT_LABEL` |
| `cardArt` | Art window (`next/image`, lazy, `object-cover object-top`) | Decorative placeholder panel: `accent` gradient wash, faint diagonal texture via arbitrary `bg-[repeating-linear-gradient(...)]`, `HR` monogram + big `#00N` ordinal — no `<img>` tag |
| `portrait` | Not used by the card (reserved for avatar/hero contexts). If `cardArt` is absent but `portrait` exists, do **not** silently swap it: keep the placeholder (the cut-out-on-white portraits crop badly inside the rim) | — |
| `accent` | Frame gradient + name-rule + placeholder tint | Defaults to `neutral` |
| `shields[]` | Badge row inside the art window, bottom-left: `h-10 w-10` circular, 1px `white/40` ring, `p-1`, drop-shadow; `alt` comes from `ImageRef.alt` | Row omitted entirely when empty/absent |

Roster states with current data:

- **Hollander** — red frame, `/hollanderCard.jpg` art, bio text, badges: Montreal Metros + Canada.
- **Rozanov** — blue frame, `/rozanovCard.jpg` art, bio text, badges: Boston Raiders + Russia.
- **Hunter** — neutral frame, placeholder art panel, `MISSING_CONTENT_LABEL` in the text panel, no badges. This card proves the visualizer still reads as a complete object at minimal data.

## Layout & responsive

```text
┌────────────────────────────┐ ─
│ ╭────────────────────────╮ │  │ acrylic case: rounded-[14px],
│ │ HEATED RIVALRY         │ │  │ white/10–20 gradient + ring-white/25,
│ │ 2026 HR PROMO    GEM   │ │  │ inset top highlight,
│ │ <NAME> — HOLO    MINT  │ │  │ diagonal glare sweep
│ │ RIVALRY SERIES 10 #00N │ │  │
│ │ ▮▮▮▮▮   80000000     │ │  ├─ label band (white/95, p-3,
│ ╰────────────────────────╯ │  │  ink-900 text, ~24% of card height)
│  ┌──────────────────────┐  │  │
│  │      <NAME>          │  │  │ name banner: cream plate,
│  ├──────────────────────┤  │  │  uppercase extrabold
│  │                      │  │  │
│  │      cardArt 5:6     │  │  │ art window: ink rim,
│  │        ●  ●          │  │  │  object-cover object-top,
│  ├──────────────────────┤  │  │  shields bottom-left
│  │  bio paragraph…      │  │  │
│  │  (auto height)       │  │  ├─ text panel: card cream, ink copy
│  │                      │  │  │
│  │  HR FAN ARCHIVE · DEC│  │  │ microcopy, centered
│  └──────────────────────┘  │ ─┘
└────────────────────────────┘
```

- Overall proportion ≈ 1:1.75 (label ≈ 0.25, card face ≈ 1.5 of the height); width driven by the cell, not the viewport.
- `CharactersSection.tsx` keeps `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` inside `max-w-6xl`; each slab is `mx-auto w-full max-w-[340px]`.
- Height is content-driven (long bios grow the card); grid rows may be uneven — accepted, like real slabs on a shelf.
- No horizontal overflow, no per-card fixed heights.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Case smoke | `bg-gradient-to-br from-white/20 via-white/5 to-white/20` + `ring-white/25` | Acrylic shell over the section background |
| Label paper | `bg-white/95`, text `text-[#171717]` | Band + name plate + text panel base |
| Card cream | `bg-[#F1E9D2]` | Frame border band around art/text zones |
| Ink | `#171717` (DESIGN.md Ink Black) | Body copy on cream |
| Brand red | `#FF002A` | Label strip, `rivalryRed` accents |
| Burgundy anchor | `#280408` | Red frame gradient stop |
| Electric blue | `#002AFF` | `electricBlue` accents |
| Navy anchor | `#080428` | Blue frame gradient stop |
| Neutral | `#3F3F46 → #18181B` | Hunter frame + placeholder wash |

- Type: inherit the site stack (Geist/Arial); banner `font-extrabold uppercase`, bio `text-sm leading-relaxed` (never below 14px for body), chrome facts `text-xs` with `font-mono` for cert/ordinal.
- The cream panel + ink text pairing is deliberate: it's the one place the roster goes light-on-dark inverted, echoing the physical artifact and the season rail's dark cards.

## Interaction & motion

- V1 ships **static**: no tilt, no GSAP, no scroll animation (the refactor removed those systems; the current sections don't use them).
- Only motion allowed without further decision: a `transition-transform duration-200` hover lift `hover:-translate-y-1` on the shell, skipped on touch by having no hover-only affordances.
- Nothing is focusable or clickable; the card is purely informational, matching the existing roster contract.

## Accessibility

- Decorative chrome (brand strip, grade, cert, barcode, series lines, microcopy, placeholder monogram) is `aria-hidden`; screen readers get name (heading) + bio (paragraph) + shield `alt` text from data only.
- Shield badges keep their `ImageRef.alt` ("Escudo del Montreal Metros", "Bandera de Canadá", …).
- Art `alt` is the character name; placeholder has no `<img>`, so no fake alt exists.
- Ink-on-cream body passes ≥ 4.5:1; white micro-labels on the red strip stay ≥ 4.5:1.
- Fictional grades/certs must never be announced as real attributes (they are not in the accessibility tree at all).

## Implementation constraints

- Tailwind classes only — **no `style` props**; the barcode and texture are `bg-[repeating-linear-gradient(...)]` arbitrary utilities.
- No code comments (repo hard rule).
- Server components only; data arrives via props — no `@/data` imports inside the card beyond `MISSING_CONTENT_LABEL`.
- `next/image` with explicit `width`/`height` and `sizes="(min-width: 768px) 340px, 90vw"` for art; shields render as plain `<img>` via the existing common `Shield` pattern.
- Remote `shields` URLs depend on the current `images.domains` config; do not introduce new remote art hosts.
- Lint baseline is 1 error + 2 warnings in untouched files — this work must not add findings.

## Acceptance checklist

- [ ] Hollander and Rozanov cards are visually distinct by frame accent and art, identical in structure.
- [ ] Hunter renders a complete-looking neutral slab: placeholder art, missing-content bio line, no badges, no empty images.
- [ ] Grade/cert/barcode are deterministic from roster index, `aria-hidden`, and contain no real grading-company strings.
- [ ] Bio text is never truncated; long bios grow the panel.
- [ ] `npm run build` passes; `npm run lint` stays at the exact known baseline.
- [ ] No `style=` props, no comments, no focusable elements in the new markup.

## Out of scope

- Reintroducing tilt/GSAP/ScrollTrigger motion or the old `tiltedCard` module.
- Changes to `characters.json`, `CharactersSection` data flow, or other sections.
- A card *selector* or detail modal (the grid shows all three slabs at once; the season selector pattern does not apply here).
- Any official branding, licensing, or franchise references beyond site identity.
