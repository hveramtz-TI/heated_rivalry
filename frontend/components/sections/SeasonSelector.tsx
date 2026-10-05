"use client";

import type { Season } from "@/types/content";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

interface SeasonSelectorProps {
  /** Seasons from the validated loader; an empty array renders the disabled option. */
  seasons: Season[];
  /** Id of the selected season (undefined while the JSON ships empty). */
  selectedId?: string;
  onSelect: (id: string) => void;
}

/**
 * Spanish episode-count meta for a pill ("6 episodios"), or `undefined` when
 * the season ships no episodes or is not yet available — upcoming seasons
 * already carry their own status word.
 */
function formatEpisodeCount(season: Season): string | undefined {
  if (season.status === "upcoming" || season.episodes.length === 0) {
    return undefined;
  }
  return season.episodes.length === 1
    ? "1 episodio"
    : `${season.episodes.length} episodios`;
}

/**
 * Native radio-group season picker (design D5). `fieldset > legend` with
 * `peer sr-only` inputs and label pills. Native radios give free arrow-key
 * group operation and one shared hit target per option (no dead zones). Option
 * names come from season data only — the shared Spanish label covers an absent
 * name, and no "Season 1"-style value is ever invented. Each pill is at least
 * 44px tall (T2) and shows the loaded episode count as meta.
 */
export default function SeasonSelector({
  seasons,
  selectedId,
  onSelect,
}: SeasonSelectorProps) {
  const isEmpty = seasons.length === 0;

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="sr-only">Seleccionar temporada</legend>

      <div className="flex flex-wrap gap-3">
        {isEmpty ? (
          <div className="relative">
            <input
              id="season-option-empty"
              type="radio"
              name="season-selector"
              value=""
              disabled
              className="peer sr-only"
            />
            <label
              htmlFor="season-option-empty"
              className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold tracking-widest text-white/60 uppercase"
            >
              {MISSING_CONTENT_LABEL}
            </label>
          </div>
        ) : (
          seasons.map((season, index) => {
            const optionId = `season-option-${index}`;
            const episodeCount = formatEpisodeCount(season);
            return (
              <div key={season.id} className="relative">
                <input
                  id={optionId}
                  type="radio"
                  name="season-selector"
                  value={season.id}
                  checked={season.id === selectedId}
                  disabled={season.status === "upcoming"}
                  onChange={() => onSelect(season.id)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={optionId}
                  className={`inline-flex min-h-11 touch-manipulation items-center rounded-full border border-white/30 bg-white/5 px-5 py-2 text-sm font-semibold tracking-widest text-white uppercase transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black focus-visible:outline-none ${
                    season.status === "upcoming"
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:bg-white/15"
                  }`}
                >
                  {season.name ?? MISSING_CONTENT_LABEL}
                  {episodeCount ? (
                    <span className="ml-2 text-xs font-medium tracking-normal normal-case opacity-70">
                      {episodeCount}
                    </span>
                  ) : null}
                  {season.status === "upcoming" ? (
                    <span className="ml-2 text-xs font-medium tracking-normal normal-case opacity-70">
                      Próximamente
                    </span>
                  ) : null}
                </label>
              </div>
            );
          })
        )}
      </div>
    </fieldset>
  );
}
