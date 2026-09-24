/**
 * Content-model interfaces for the data-driven single page (design D2).
 *
 * This file is the single declaration site for every content type. The
 * content-models "Import purity" requirement applies: `types/` imports
 * nothing — no presentation components, no motion libraries.
 *
 * Rules:
 * - `id` is the only guaranteed field; loaders synthesize it when absent.
 * - Every user-supplied content field is optional so "not yet populated" is
 *   representable without fabricated sentinel values (no invented canon).
 * - Asset fields are typed as path strings: a leading "/" is a
 *   `public/`-rooted web path; an `https://` URL on an
 *   `ALLOWED_REMOTE_HOSTS` host (see `lib/images.ts`) is the interim
 *   remote-shield exception. Everything else is rejected by the guards.
 */

/** Image source plus Spanish alt text (site copy lives in JSON). */
export interface ImageRef {
  /** public/-rooted path ("/x.png") or https URL on an ALLOWED_REMOTE_HOSTS host */
  src: string;
  /** Spanish alt text (site copy lives in JSON) */
  alt: string;
}

/**
 * Retailer deep link. A link is rendered if and only if an entry exists in
 * JSON — the array is the ONLY source of purchase affordances (decision 4).
 */
export interface RetailerLink {
  provider: string;
  url: string;
}

/** Closed style-token union; unknown/absent accents degrade to "neutral". */
export type CharacterAccent = "rivalryRed" | "electricBlue" | "neutral";

export interface Character {
  /** loader-synthesized ("char-<i>") when absent */
  id: string;
  /** absent/empty → card shows MISSING_CONTENT_LABEL */
  name?: string;
  bio?: string;
  /** public/ path, oversized art (chapters) — optional */
  portrait?: string;
  /** public/ path, game-board card face — optional */
  cardArt?: string;
  /** unknown/absent → "neutral" */
  accent?: CharacterAccent;
  /** absent/empty → shields row omitted entirely */
  shields?: ImageRef[];
}

export interface Episode {
  /** loader-synthesized when absent */
  id: string;
  number?: number;
  title?: string;
  /** ISO YYYY-MM-DD, formatted at render via Intl.DateTimeFormat("es") */
  airDate?: string;
  synopsis?: string;
  artwork?: string;
}

export interface Season {
  /** loader-synthesized when absent */
  id: string;
  name?: string;
  year?: string;
  /** invalid/absent → [] (never throws) */
  episodes: Episode[];
}

export interface Book {
  /** loader-synthesized when absent */
  id: string;
  title?: string;
  cover?: string;
  description?: string;
  /** ISO YYYY-MM-DD */
  published?: string;
  pages?: number;
  /** the ONLY source of purchase affordances */
  purchaseUrls?: RetailerLink[];
}
