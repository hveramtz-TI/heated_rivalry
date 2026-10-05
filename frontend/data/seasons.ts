/**
 * Seasons loader (design D3): pure, synchronous, never-throwing. Episodes are
 * nested per season (never a second file/foreign key). Each season and episode
 * entry degrades to a gap entry instead of being dropped; an absent or invalid
 * `episodes` array normalizes to `[]`.
 *
 * Import purity: only `@/types/content`, `./guards` and `./seasons.json`.
 */

import type { Episode, Season } from "@/types/content";
import {
  asAssetPath,
  asIsoDate,
  asNumber,
  asString,
  isRecord,
} from "./guards";
import seasonsJson from "./seasons.json";

function normalizeEpisode(raw: unknown, index: number): Episode {
  if (!isRecord(raw)) {
    return { id: `episode-${index}` };
  }
  return {
    id: asString(raw.id) ?? `episode-${index}`,
    number: asNumber(raw.number),
    title: asString(raw.title),
    airDate: asIsoDate(raw.airDate),
    synopsis: asString(raw.synopsis),
    artwork: asAssetPath(raw.artwork),
  };
}

function normalizeSeason(raw: unknown, index: number): Season {
  if (!isRecord(raw)) {
    return { id: `season-${index}`, episodes: [] };
  }
  const rawEpisodes: unknown[] = Array.isArray(raw.episodes)
    ? raw.episodes
    : [];
  return {
    id: asString(raw.id) ?? `season-${index}`,
    name: asString(raw.name),
    year: asString(raw.year),
    status: raw.status === "upcoming" ? "upcoming" : undefined,
    episodes: rawEpisodes.map((episode, i) => normalizeEpisode(episode, i)),
  };
}

/** Typed seasons; malformed entries fail soft, the loader never throws. */
export function getSeasons(): Season[] {
  const raw: unknown = seasonsJson;
  const entries: unknown[] = Array.isArray(raw) ? raw : [];
  return entries.map((entry, index) => normalizeSeason(entry, index));
}
