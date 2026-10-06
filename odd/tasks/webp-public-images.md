# ODD Tasks: Public WebP Images

Feature: `webp-public-images` · Branch: `feat/webp-public-images` · Created: 2026-10-05

## Objective
Convert every raster image the frontend serves to WebP, keep every reference resolving, and fix the rendering faults that surfaced while verifying the conversion.

## Problem / Why
`frontend/public/` held JPEG and PNG files with references using those extensions. WebP cuts the payload while keeping the same content and visual role. Verification then exposed three real faults: episode stills never rendered, the hero logo stalled, and the character cards read uneven because their bios were different lengths.

## Scope
- **In:** raster images in `frontend/public/`, the references to them in components and `frontend/data/`, character shield assets, book purchase links, and the character bio wording.
- **Out:** `H2.mp4`, `soundtrack.mp3`, catalog copy the user owns, and delivery decisions (commit, push, PR stay with the user).

## Constraints
- Preserve dimensions, transparency, and recognizable quality; keep each basename and use `.webp`.
- Never invent an artwork mapping for a reference with no matching file.
- Keep the user's in-progress catalog content out of the asset commits.
- No comments in code, Tailwind classes only, no inline styles (repository hard rules).
- No declared frontend test or typecheck script: verify through asset/reference assertions, the production build, and a live server.

## Tasks
- [x] T1 — Convert local raster assets, update verified references, and validate the build.
- [x] T2 — Localize the character shields as WebP after the remote hosts proved unusable.
- [x] T3 — Add the six Mercado Libre purchase links to the book catalog in file order.
- [x] T4 — Fix the episode artwork key mismatch that kept every episode on its placeholder.
- [x] T5 — Diagnose the hanging header logo and re-encode the logo asset.
- [x] T6 — Normalize the character bios so the three cards read at the same height.
- [x] T7 — Remove the unreferenced image assets left in `frontend/public/`.
- [x] T8 — Drop the dead cover references from the books example fallback.
- [x] T9 — Delete the unused `images.domains` block from the Next config.

## Route and delivery
- **Route:** delegated direct; eighteen assets plus references in JSON and components required coordinated updates (writer trigger fired).
- **TDD:** a static asset conversion has no meaningful runnable RED, so each task closes on format/reference assertions plus build and live-server evidence instead.
- **Delivery strategy:** `ask-on-risk`; authored source diff stays well under the 400-line budget, binaries excluded, so no chain strategy applies.
- **RDD:** global mode `off` throughout; no review lifecycle started. Native assess returned `unassessable` (untracked inventory needed) and was treated as high.

## T1 — Conversion evidence
- 18 root assets converted, originals removed, `npm run build`/`npm run lint`/`git diff --check` passing.
- WebP signatures and dimensions verified for 18/18, alpha preserved for 3/3 PNG sources. `referenciaCard.jpg` was already WebP data under a wrong extension and was renamed with bytes preserved; `hunter.png` was JPEG data and was converted from content, not extension.
- `hollanderCard.webp` was re-encoded from the versioned JPEG blob because the first encode came out larger than its source (425 → 503 KiB); final 350 KiB at 1080x1920.
- Payload on the versioned originals: 8.36 MiB → 3.03 MiB (63.8% smaller).
- `frontend/data/seasons.json` episode images map in order to `/1.webp`–`/6.webp`.
- Commits: `abbd24a` (root conversions and references).

## T2 — Local shields (user chose option A)
- Six WebP badges in `frontend/public/shields/`: `montreal-metros`, `boston-raiders`, `new-york-admirals`, `flag-canada`, `flag-russia`, `flag-us`; 23.7 KiB total against ~199 KiB for the three remote logos alone, sized at 160 px because the cards display 32 px.
- Fandom assets only download when the request carries a browser User-Agent **and** a wiki `Referer`; without it every request 403s, which is what made the CDN look dead. This was pre-existing: the Metros and Raiders URLs in `HEAD` failed identically.
- Flags are vector SVGs, rasterized with `rsvg-convert` at 160 px before WebP encoding. Wikimedia `/thumb/...png` URLs return HTTP 400 here; the raw `.svg` works. SVG sources also hit the optimizer gate "image type is not allowed", which needs `images.dangerouslyAllowSVG` plus a CSP.
- Render quality measured, not assumed: US canton is navy with white star pixels and alternating red/white stripes; Russia samples white/blue/red top to bottom.
- Earlier `characters.json` used the wiki *page* URL `https://game-changers-series.fandom.com/wiki/New_York_Admirals` as an image src on an unconfigured host, which threw `Invalid src prop ... hostname ... is not configured`; the real file URL came from the wiki MediaWiki API.
- Commit: `3297e20`.

## T3 — Purchase links
- `frontend/data/books.json` carries one `Mercado Libre` `RetailerLink` per book, assigned in file order: `game-changer` → `meli.la/1iYhWP6`, `heated-rivalry` → `meli.la/14m9Fvp`, `tough-guy` → `meli.la/2WKW4NE`, `common-goal` → `meli.la/2Pd1ikM`, `role-model` → `meli.la/2qFXn1g`, `the-long-game` → `meli.la/2oUVFd5`.
- Six covers dropped into `frontend/public/images/books/` during the run were converted to WebP (224 KiB → 100 KiB for `game-changer`, the rest ~103–188 KiB) and their `cover` paths now end in `.webp`.
- Commit: `1676ea7`.

## T4 — Episode artwork key mismatch
- Symptom: every episode card showed the decorative number placeholder and `/_next/image` never asked for `/1.webp`–`/6.webp`.
- Root cause: the contract is `Episode.artwork` (`frontend/types/seasons.ts:7`, read at `frontend/components/cards/EpisodeCard.tsx:60`) but `frontend/data/seasons.json` used the key `image`. Nothing rejects unknown keys — the sections cast JSON straight to the type — so the value was silently ignored.
- Fix: renamed the six keys to `artwork`, order untouched, no component change.

## T5 — Header logo stall
- Symptom: the hero logo never painted while the footer logo, asking `w=64`/`w=128`, was fine.
- Evidence: `logo.webp` was identical to the source PNG (`magick compare -metric AE` → 0 differing pixels, same 24,926 unique colors, same mean). It answered `w=128/640/828/1920` in milliseconds; `w=1080`, exactly its intrinsic width and exactly the header's 2x candidate, timed out repeatedly, while other WebP files answered `w=1080` normally.
- Decisive control: a byte-identical copy under another filename answered `w=1080` in 83 ms on the same running dev server, and the original PNG answered it in 75 ms. The file was healthy; the stall lived in the dev server's in-memory optimizer cache, poisoned by the first request against the lossless encode.
- Fix: re-encoded the logo lossy at q90 (200 KB → 85 KB, RMSE 0.4%, alpha kept), commit `2d3c058`. After the dev server restarted, `w=1080` answers in 11 ms.
- The proposal to move every image to JPG was rejected on evidence: two of the three faults were a key mismatch and a cache entry, no WebP file was corrupt, and JPEG carries no alpha, which the logo and both portraits need.

## T6 — Uniform bios
- Before: Hollander 536, Rozanov 511, Hunter 732 characters (spread 221).
- Hunter trimmed to 533 characters in four sentences, matching the shape of the other two (spread now 25). Wording was cut, not invented: leadership, centre role, reserved character, authenticity, and inclusion all stayed.

## T7/T8/T9 — Cleanup evidence
- T7: the three UUID-named files (`44ab2a59-…(1).webp`, `…(1)(1)(1).webp`, `…(1)(1)(2).webp`) had **zero** mentions anywhere in the repository, so they were removed. `referenciaCard.webp` was **kept**: the sweep said "unreferenced by code", but `CHARACTER-CARDS-DESIGN.md` cites it as the visual reference for the slab cards, and `odd/tasks/character-card-visualizer.md` points at it too. Both documents still named the old `.jpg`, so their pointers were corrected to `.webp` instead of deleting a documented reference.
- T8: the two `cover` keys in `frontend/data/books.example.json` pointed at `/images/books/ejemplo-portada-*.jpg`, files that never existed. They were removed so the example books take `BookCard`'s designed `cover === undefined` placeholder branch. The example file itself stays because `BooksSection` imports it for the empty-catalog fallback.
- T9: `frontend/next.config.ts` declared `images.domains` for `static.wikia.nocookie.net` and `upload.wikimedia.org`. After the shields went local, a repository-wide search found no remaining remote image `src`, so the block was deleted. Evidence it worked: the build no longer prints the `images.domains` deprecation warning.
- Final integrity sweep: broken references **ninguno**, unreferenced assets only `referenciaCard.webp` (intentional, documented), 29 files left in `frontend/public/`.

## Verification
- `npm run build` and `npm run lint` pass; `git diff --check` clean.
- Production server on port 3211: `/_next/image?url=%2Flogo.webp&w=1080` → 200 in 127 ms; each of the six artworks appeared 16 times in rendered HTML and every `N.webp` returned 200.
- Dev server on port 3000 after restart: logo `w=1080` → 200 in 11 ms; `url=%2F[1-6].webp` all present; zero number placeholders; zero `Runtime Error` and zero `Invalid src prop`; all six `/shields/*.webp` and all covers return 200.
- Final production run on port 3222 after T7–T9: `/` 200, logo `w=1080` 200, episodes 1/3/6 artwork 200, `/shields/new-york-admirals.webp`, `/shields/flag-us.webp` and `/images/books/the-long-game.webp` 200; rendered HTML carries 6 artworks, 6 shields, 6 covers and 0 runtime errors. The build no longer emits the `images.domains` deprecation warning.
- No browser was opened: evidence is HTTP responses plus rendered markup, so final visual polish still needs the user's eyes.

## Open items
- `referenciaCard.webp` is the only file in `frontend/public/` no code references; it is kept on purpose as the design citation in `CHARACTER-CARDS-DESIGN.md`.
- `frontend/data/books.example.json` still powers the empty-catalog fallback, but with six books in `books.json` that branch is unreachable today.
- Hunter has no dedicated card artwork: his `cardArt` reuses `/hunter.webp`, unlike Hollander and Rozanov, who each have a separate `*Card.webp`.
- Incident worth remembering: a `pkill -f 'next-server'` cleanup matched the user's own dev server (PID 11885) and killed it. Cleanup must target only the PID the session started, resolved from the listening socket.

## Next Step
Delivery is the user's call: the branch holds every fix. Remaining work is content-side — Hunter's card art, a browser visual pass, and whether to retire the unreachable `books.example.json` fallback.
