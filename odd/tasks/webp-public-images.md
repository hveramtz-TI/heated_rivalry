# ODD Tasks: Public WebP Images

Feature: `webp-public-images` · Branch: `feat/webp-public-images` · Created: 2026-10-05

## Objective
Convert every raster image in `frontend/public/` to WebP and update references to those local assets.

## Problem / Why
The public asset directory contains JPEG and PNG files, and application references still use those extensions. WebP assets reduce image payload size while preserving the existing content and visual roles.

## Scope
- **In:** Raster image files currently in `frontend/public/`; application references to those local images; season episode paths when they map directly to the six numbered episode images.
- **Out:** `H2.mp4`, `soundtrack.mp3`, remote image URLs, unrelated catalog copy, and references to image files that do not exist in `frontend/public/`.

## Constraints
- Preserve source image dimensions, transparency, and recognizable quality.
- Retain each existing basename when converting; use `.webp` as the output extension.
- Do not remove or rewrite the unrelated in-progress catalog content in `frontend/data/{books,characters,seasons}.json`.
- Update paths only when they can be matched to a real converted public asset; do not invent missing book cover artwork or mappings.
- The repository has no declared frontend test or typecheck script; use asset/reference assertions and the production build.

## Tasks
- [x] T1 — Convert local raster assets, update verified references, and validate the build.

## Route and delivery
- **Route:** delegated direct; the conversion spans multiple assets and application references.
- **Trigger evidence:** eighteen local image assets and references in JSON and components require coordinated updates.
- **TDD:** no meaningful runnable RED exists for a static asset conversion; verify output formats, reference resolution, and the frontend production build.
- **Delivery strategy:** `ask-on-risk` (default); estimated authored source changes are under 400 lines, excluding converted binary assets, so no chain strategy is needed.
- **RDD:** global mode was `off` at task start; keep review disabled and follow ordinary repository policy.

## Acceptance criteria
- Every raster image in `frontend/public/` is represented by a valid WebP file, and no original JPEG/PNG remains there.
- Existing code references to those local images use `.webp` and resolve to files.
- The six numbered episode images are referenced in order by the six existing episode entries.
- Video, audio, remote assets, and unrelated catalog content remain unchanged.
- `npm run build` succeeds; any lint failure is recorded honestly.

## Checks
- Run from `frontend/`: `npm run build`
- Run from `frontend/`: `npm run lint`
- Inspect local image file signatures and ensure all local asset references to converted images resolve.
- Confirm the dirty catalog changes that predate this task remain intact except for authorized image-path updates.

## Progress / Evidence
- T1 complete: all 18 local raster assets now have WebP files, and the original JPEG/PNG files were removed. The existing disguised WebP (`referenciaCard.jpg`) was renamed without recompression.
- Image validation confirmed WebP signatures and matching dimensions for 18/18 assets, alpha preservation for 3/3 PNG sources, and exact byte preservation for `referenciaCard.webp`.
- Updated references to assets that exist. The six episode entries now point in order to `/1.webp`–`/6.webp`; component and character paths for existing local assets resolve.
- `npm run build` passed; Next emitted only the existing `images.domains` deprecation warning. `npm run lint` passed. `git diff --check` passed.
- Existing missing references remain unchanged: the `/images/books/*.jpg` cover paths and the user-added `/hunterCard.jpg` had no corresponding assets in `frontend/public/`; no artwork mapping was guessed.
- Native risk assessment returned `unassessable` because untracked files need an explicit inventory declaration; treated as high. Writer self-checks and independent verification completed. RDD remains OFF.
- Work-unit commit: `abbd24a perf(assets): serve public images as webp` on `feat/webp-public-images`. Staging excluded the user's in-progress catalog content in `books.json` and the Hunter character block in `characters.json`.
- Post-review correction before freeze: `hollanderCard.webp` was re-encoded from the versioned JPEG blob (quality 82, method 6) because the first encode came out larger than its source (425 KiB -> 503 KiB); final size 350 KiB at the same 1080x1920.
- Payload measured on the versioned originals: 8.36 MiB of JPEG/PNG -> 3.03 MiB of WebP (63.8% smaller). `referenciaCard` kept its original bytes as a rename only.
- A `game-changer.jpg` (1594x2400, 224 KiB) appeared in `frontend/public/` during the run; converted to `frontend/public/images/books/game-changer.webp` (100 KiB, 55% smaller) — the directory `books.json` already expects — and that one cover reference now points to `.webp`.

## Follow-ups detected (not part of this task, evidence recorded)
- Remote team shields do not render: `static.wikia.nocookie.net` returns HTTP 403 both through the Next image optimizer and from a direct request with a browser user-agent. This is pre-existing — the `Montreal_Metros_Logo.png` and `Boston_Raiders_Logo.png` URLs already in `HEAD` fail identically, so Hollander and Rozanov shields were already broken.
- Remote flag shields are rejected by the optimizer with "image type is not allowed" (`image/svg+xml` needs `images.dangerouslyAllowSVG` plus a CSP); also pre-existing for the Canada and Russia flags in `HEAD`.
- `characters.json` line 47 pointed at the wiki *page* `https://game-changers-series.fandom.com/wiki/New_York_Admirals`, not an image, and that hostname is not in `next.config.ts` `images.domains`. That raised the runtime error `Invalid src prop ... hostname "game-changers-series.fandom.com" is not configured`. Fixed to the real file URL reported by the wiki API (`.../images/4/4e/New_York_Admirals_Logo.png/revision/latest?cb=20260721134108`), which matches the pattern of the other two characters. The fix lives in the user's uncommitted Hunter block and was left uncommitted on purpose.
- Still-unmapped image references (no file exists, nothing was guessed): five remaining `/images/books/*.jpg` covers, and `/hunterCard.jpg` inside the user-added Hunter entry.
- The three UUID-named images in `frontend/public/` (3880x2400, 1159x1545, 1032x1548) are converted but referenced by nothing; their intended role is unknown.

## Runtime verification
- Live `next dev` on port 3000 (the user's own server): `GET /` returns 200, the Admirals logo URL appears in the HTML, `Invalid src prop` and `Runtime Error` counts are 0.
- `GET /images/books/game-changer.webp` returns 200, and `/_next/image?url=%2Fimages%2Fbooks%2Fgame-changer.webp` returns 200.
- `GET /hunterCard.jpg` returns 404, confirming that reference is dangling.

## Next Step
Decide how the character shields should be served (local WebP copies of the logos and flags, `unoptimized` remote images, or a graceful `onError` fallback), then supply the missing Hunter card art and remaining book covers so those references can be converted the same way.
