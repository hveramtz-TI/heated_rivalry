"use client";

import { useState } from "react";
import type { Season } from "@/types/content";
import { getSeasons } from "@/data/seasons";
import { MISSING_CONTENT_LABEL } from "@/data/ui";
import SeasonSelector from "@/components/sections/SeasonSelector";
import SeasonTimeline from "@/components/sections/SeasonTimeline";

/**
 * The season browser shell (season-browser spec): selected-season state, the
 * native-radio selector, and the upper timeline. The episode rail and the
 * section motion land with the rail commit; until then the rail area shows the
 * shared Spanish empty state so the section skeleton stays complete.
 */
export default function SeasonsSection() {
  // Static build-time data: one stable array identity per mount.
  const [seasons] = useState<Season[]>(() => getSeasons());
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => seasons[0]?.id,
  );

  return (
    <section
      id="temporadas"
      aria-labelledby="temporadas-heading"
      className="scroll-mt-28 bg-black text-white"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24 md:px-8">
        <h2
          id="temporadas-heading"
          className="text-4xl font-bold text-white md:text-6xl"
        >
          Temporadas
        </h2>

        <SeasonSelector
          seasons={seasons}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <SeasonTimeline seasons={seasons} selectedId={selectedId} />

        <div className="flex min-h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-white/20 px-6 text-center text-sm text-white/70">
          {MISSING_CONTENT_LABEL}
        </div>
      </div>
    </section>
  );
}
