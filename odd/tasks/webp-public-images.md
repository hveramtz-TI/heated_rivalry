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
- Existing missing references remain unchanged: six `/images/books/*.jpg` paths and the user-added `/hunterCard.jpg` have no corresponding assets in `frontend/public/`; no artwork mapping was guessed.
- Native risk assessment returned `unassessable` because untracked files need an explicit inventory declaration; treated as high. Writer self-checks and independent verification completed. RDD remains OFF.
- Work-unit commit identity will be added after commit.

## Next Step
Record the work-unit commit identity in this tracker and its Engram mirror.
