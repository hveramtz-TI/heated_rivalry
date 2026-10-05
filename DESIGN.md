# Design System: Heated Rivalry

**Project ID:** Not applicable — local Next.js application without a Stitch project ID.

## 1. Visual Theme & Atmosphere

Heated Rivalry is a cinematic, sports-centered experience built around rivalry, identity, and momentum. The visual language is **dramatic, high-contrast, immersive, and editorial** rather than utility-oriented.

The page is structured as a sequence of full-screen character chapters. Each chapter pairs a large character image with a bold color field, short biographical copy, team or national shields, and scroll-driven reveals. The opening hero uses looping video behind a centered logo, establishing a dark, cinematic entrance before collapsing into the fixed navigation state.

Visual hierarchy comes from scale, color opposition, and motion:

- Oversized imagery and full-viewport sections create spectacle.
- White typography stays highly legible against saturated gradients and dark overlays.
- GSAP ScrollTrigger reveals shields, descriptions, and character artwork progressively.
- Lenis smooth scrolling and subtle 3D card interactions reinforce a premium, interactive feel.

## 2. Color Palette & Roles

### Core neutrals

- **Canvas White (#FFFFFF):** Default light background token and high-contrast surface.
- **Ink Black (#171717):** Default foreground token for light-mode text and UI content.
- **Night Black (#0A0A0A):** Dark-mode background and cinematic base layer.
- **Soft White (#EDEDED):** Dark-mode foreground and secondary light text.
- **Pure Black (#000000):** Hero background, media framing, and opaque visual transitions.

### Character chapter colors

- **Rivalry Red (#FF002A):** Hollander chapter accent and energetic competitive emphasis.
- **Blood Burgundy (#280408):** Hollander gradient anchor; adds depth behind the red accent.
- **Electric Blue (#002AFF):** Rozanov chapter accent and contrasting competitive identity.
- **Midnight Navy (#080428):** Rozanov gradient anchor; provides a deep, atmospheric counterpoint to blue.

### Controls and overlays

- **Black Glass (#000000 at 80% opacity):** Floating audio player surface.
- **Black Veil (#000000 at 50% opacity):** Video readability overlay over the hero media.
- **Warm Border Yellow (#FEF9C3):** Audio player button outline.
- **Volume Yellow (#FEF08A):** Audio range input accent.
- **Tooltip White (#FFFFFF):** Tilted-card tooltip background.
- **Tooltip Charcoal (#2D2D2D):** Tilted-card tooltip text.

Use chapter colors for identity and section-level atmosphere, not for small interface details. Keep text white or soft white on saturated backgrounds and preserve strong contrast around media overlays.

## 3. Typography Rules

The layout loads **Geist Sans** and **Geist Mono** through `next/font`, exposing them as `--font-geist-sans` and `--font-geist-mono`. The current global body rule overrides the sans token with **Arial, Helvetica, sans-serif**, so Arial is the effective rendered body face today.

- **Character names:** Bold, oversized sans-serif display treatment; approximately `text-4xl` on small screens and `text-6xl` on medium screens.
- **Body copy:** Regular sans-serif, white, approximately `text-base` on small screens and `text-lg` on medium screens; constrain copy to roughly `max-w-lg` or `max-w-xl` for readable line lengths.
- **Hero logo:** Image-based brand mark; do not reproduce it as text.
- **Controls:** White iconography with concise accessible labels; use strong contrast rather than decorative typography.
- **Letter spacing:** Keep default tracking. The design relies on weight and scale, not expanded letter spacing.

When extending the system, prefer Geist Sans for new branded UI once the global body font override is intentionally removed or corrected. Reserve Geist Mono for technical metadata or deliberately mechanical accents.

## 4. Component Stylings

### Hero and media

- Full-screen, fixed hero with a black base and hidden overflow.
- Looping video fills the viewport using `object-cover`.
- A semi-transparent black veil preserves logo readability without flattening the footage.
- The centered logo begins large and transitions to a compact fixed header state on scroll.

### Character sections

- Each section occupies at least one viewport height and uses a two-column composition on medium screens.
- Hollander uses a red-to-burgundy diagonal gradient (`#FF002A` to `#280408`).
- Rozanov uses a blue-to-midnight diagonal gradient (`#002AFF` to `#080428`).
- Character artwork is oversized and enters from the side through a horizontal reveal.
- Supporting shields are grouped horizontally with a compact gap and reveal vertically before the main content.

### Cards and containers

- Primary chapter containers are flat, immersive color fields with no visible card border.
- Media cards use gently rounded corners (`15px`) and preserve the image crop with `object-cover`.
- Tilted cards use perspective depth, transform-based motion, and a raised overlay layer rather than traditional drop shadows.
- Tooltips use subtly rounded corners (`4px`), a white surface, charcoal text, and compact padding.

### Buttons and audio controls

- The audio player is a floating, circular control in the lower-right corner.
- The button is pill-like/circular with a black glass surface, a pale yellow border, white icon, generous padding, and a soft large shadow.
- Hover state deepens the black surface while preserving the border and icon contrast.
- The range input sits below the button, is compact, and uses the warm yellow accent.

### Separators

- Character chapters are separated by a full-width photographic strip.
- The separator is shallow, uses `object-cover`, and overlaps the section boundary slightly to create a hard editorial cut between chapters.

## 5. Layout Principles

- Design around full-viewport storytelling: sections default to `min-height: 100vh`.
- Center primary content vertically and horizontally, then switch to a left-aligned text block on medium screens.
- Use a responsive two-column composition for character chapters; allow the mobile layout to collapse naturally rather than forcing desktop proportions.
- Keep text blocks narrow beside oversized artwork to maintain hierarchy and reading rhythm.
- Preserve generous gaps between shields, titles, and descriptions; the current compositions use approximately `gap-7` to `gap-8` for major content groups.
- Allow artwork to extend beyond normal content bounds when it reinforces scale, but contain the chapter with `overflow-hidden`.
- Use fixed and absolute positioning only for cinematic layers, the hero transition, and the audio control. Keep narrative content in normal document flow.
- Use sharp section transitions, saturated gradients, and low visual noise in supporting UI so the character imagery remains dominant.

## 6. Motion Principles

- Motion should feel deliberate and physically weighted rather than decorative.
- Scroll-linked transitions use scrubbed timelines so the user controls the pace.
- Reveal secondary identity elements first, then descriptive copy, then character artwork.
- Prefer opacity, transform, scale, and filter changes; avoid layout-shifting animation.
- Hover interactions use spring-based motion with restrained tilt and scale. Reset all transforms cleanly on pointer exit.
- Respect reduced-motion preferences when adding future animation behavior.

## 7. Responsive Behavior

- Mobile prioritizes legibility and vertical flow over the desktop split composition.
- Headings reduce from `text-6xl` to `text-4xl`.
- Body copy remains readable at `text-base` with a constrained maximum width.
- Desktop-only tilt-card affordances should provide a static fallback on touch devices.
- Floating controls must remain reachable without covering important character content.
