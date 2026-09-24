/**
 * Characters loader (design D3): pure, synchronous, never-throwing. Validation
 * runs inside `getCharacters()` — not at module scope — and every JSON entry
 * degrades to a gap entry instead of being dropped, so the returned length
 * always equals the `characters.json` array length.
 *
 * Import purity: only `@/types/content`, `./guards` and `./characters.json`.
 */

import type { Character, CharacterAccent, ImageRef } from "@/types/content";
import { asAssetPath, asString, isRecord } from "./guards";
import charactersJson from "./characters.json";

function asAccent(value: unknown): CharacterAccent | undefined {
  if (
    value === "rivalryRed" ||
    value === "electricBlue" ||
    value === "neutral"
  ) {
    return value;
  }
  return undefined;
}

/**
 * ImageRef list: entries missing a valid `src`/`alt` pair are rejected because
 * an ImageRef without both fields cannot render; the shields row is documented
 * to be omitted entirely when the list ends up empty.
 */
function asImageRefs(value: unknown): ImageRef[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const refs: ImageRef[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }
    const src = asAssetPath(item.src);
    const alt = asString(item.alt);
    if (src !== undefined && alt !== undefined) {
      refs.push({ src, alt });
    }
  }
  return refs;
}

function normalizeCharacter(raw: unknown, index: number): Character {
  if (!isRecord(raw)) {
    // Non-object or zero recognizable fields → gap entry (label in every slot).
    return { id: `char-${index}` };
  }
  return {
    id: asString(raw.id) ?? `char-${index}`,
    name: asString(raw.name),
    bio: asString(raw.bio),
    portrait: asAssetPath(raw.portrait),
    cardArt: asAssetPath(raw.cardArt),
    accent: asAccent(raw.accent),
    shields: asImageRefs(raw.shields),
  };
}

/** Typed roster; malformed entries fail soft, the loader never throws. */
export function getCharacters(): Character[] {
  const raw: unknown = charactersJson;
  const entries: unknown[] = Array.isArray(raw) ? raw : [];
  return entries.map((entry, index) => normalizeCharacter(entry, index));
}
