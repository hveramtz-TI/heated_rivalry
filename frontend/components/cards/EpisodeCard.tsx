"use client";

import Image from "next/image";
import { useState, type Ref } from "react";
import type { Episode } from "@/types/content";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

/**
 * Deterministic Spanish date formatter: `timeZone: "UTC"` keeps the server and
 * client render identical for the same ISO date (no hydration mismatch from a
 * differing local time zone).
 */
const AIR_DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Spanish-formatted air date, or the shared label when absent/invalid. */
function formatAirDate(airDate: string | undefined): string {
  if (!airDate) return MISSING_CONTENT_LABEL;
  const parsed = new Date(airDate);
  if (Number.isNaN(parsed.getTime())) return MISSING_CONTENT_LABEL;
  return AIR_DATE_FORMATTER.format(parsed);
}

interface EpisodeCardProps {
  episode: Episode;
  /** Registered by the rail so the section can reveal cards per season. */
  cardRef?: Ref<HTMLElement>;
  /** Fired when the artwork loads, so the section can refresh ScrollTrigger. */
  onArtworkLoad?: () => void;
}

/**
 * Fixed-width snap child of the episode rail (design D5). Every slot reserves
 * its space and falls back to the shared Spanish missing-content label; a
 * remote artwork whose request fails flips to the same label panel (design D8).
 * Data arrives strictly by props — no `@/data` import except the label.
 */
export default function EpisodeCard({
  episode,
  cardRef,
  onArtworkLoad,
}: EpisodeCardProps) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  const artwork = episode.artwork;
  const showArtwork = artwork !== undefined && !artworkFailed;

  return (
    <article
      ref={cardRef}
      className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:w-[320px]"
    >
      <div className="relative aspect-video w-full bg-black/40">
        {showArtwork ? (
          <Image
            src={artwork}
            alt={episode.title ?? ""}
            width={320}
            height={180}
            sizes="(min-width: 768px) 320px, 280px"
            loading="lazy"
            className="h-full w-full object-cover"
            onLoad={onArtworkLoad}
            onError={() => setArtworkFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-white/70">
            {MISSING_CONTENT_LABEL}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">
          {episode.number !== undefined
            ? `Episodio ${episode.number}`
            : MISSING_CONTENT_LABEL}
        </p>
        <h3 className="text-xl font-bold text-white">
          {episode.title ?? MISSING_CONTENT_LABEL}
        </h3>
        <p className="text-sm text-white/70">{formatAirDate(episode.airDate)}</p>
        <p className="text-sm leading-relaxed text-white/80">
          {episode.synopsis ?? MISSING_CONTENT_LABEL}
        </p>
      </div>
    </article>
  );
}
