"use client";

import { useState } from "react";
import seasonsData from "@/data/seasons.json";
import type { Season } from "@/types/seasons";
import EpisodeRail from "@/components/sections/EpisodeRail";
import SeasonSelector from "@/components/sections/SeasonSelector";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

const seasons = seasonsData as Season[];

const SeasonsSection = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => seasons[0]?.id,
  );
  const selectedSeason = seasons.find((season) => season.id === selectedId);

  return (
    <section
      id="temporadas"
      className="relative isolate w-full scroll-mt-24 bg-[url('/episodeSectionBg.webp')] bg-cover bg-center px-6 py-16 md:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/70"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-white">Temporadas</h2>
        <div className="mt-8 flex flex-col gap-12">
          <SeasonSelector
            seasons={seasons}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {selectedSeason ? (
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-2xl font-bold text-white">
                  {selectedSeason.name ?? MISSING_CONTENT_LABEL}
                </h3>
                {selectedSeason.year ? (
                  <p className="text-sm font-semibold tracking-widest text-white/60">
                    {selectedSeason.year}
                  </p>
                ) : null}
              </div>
              {selectedSeason.episodes.length > 0 ? (
                <EpisodeRail
                  episodes={selectedSeason.episodes}
                  seasonName={selectedSeason.name}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default SeasonsSection;
