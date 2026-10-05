"use client";

import type { Season } from "@/types/seasons";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

interface SeasonSelectorProps {
  seasons: Season[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

function formatEpisodeCount(season: Season): string | undefined {
  if (season.status === "upcoming" || season.episodes.length === 0) {
    return undefined;
  }

  return season.episodes.length === 1
    ? "1 episodio"
    : `${season.episodes.length} episodios`;
}

const optionPillClassName =
  "inline-flex min-h-11 touch-manipulation items-center rounded-full border border-white/30 bg-white/5 px-5 py-2 text-sm font-semibold tracking-widest text-white uppercase transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white";

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
              className={`${optionPillClassName} cursor-not-allowed opacity-60`}
            >
              {MISSING_CONTENT_LABEL}
            </label>
          </div>
        ) : (
          seasons.map((season, index) => {
            const optionId = `season-option-${index}`;
            const isUpcoming = season.status === "upcoming";
            const episodeCount = formatEpisodeCount(season);

            return (
              <div key={season.id} className="relative">
                <input
                  id={optionId}
                  type="radio"
                  name="season-selector"
                  value={season.id}
                  checked={season.id === selectedId}
                  disabled={isUpcoming}
                  onChange={() => onSelect(season.id)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={optionId}
                  className={`${optionPillClassName} ${
                    isUpcoming
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
                  {isUpcoming ? (
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
