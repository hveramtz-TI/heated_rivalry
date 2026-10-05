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

/**
 * Spanish-formatted air date, or `undefined` when absent/invalid so the caller
 * omits the line entirely instead of printing a missing-content label.
 */
function formatAirDate(airDate: string | undefined): string | undefined {
  if (!airDate) return undefined;
  const parsed = new Date(airDate);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return AIR_DATE_FORMATTER.format(parsed);
}

/**
 * Faint diagonal texture for the artwork placeholder (decorative only, same
 * inline-style technique as the CharacterCard barcode).
 */
const PLACEHOLDER_TEXTURE =
  "repeating-linear-gradient(115deg, transparent 0px, transparent 14px, rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px)";

interface EpisodeCardProps {
  episode: Episode;
  /** Registered by the rail so the section can reveal cards per season. */
  cardRef?: Ref<HTMLElement>;
  /** Fired when the artwork loads, so the section can refresh ScrollTrigger. */
  onArtworkLoad?: () => void;
}

/**
 * Fixed-width snap child of the episode rail (design D5, T2 polish). Absent
 * artwork renders a decorative placeholder built around the episode number
 * instead of a missing-content panel, and a remote artwork whose request fails
 * falls back to the same placeholder. Optional air date and synopsis lines are
 * omitted when absent; only the required title keeps the shared Spanish label.
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
  const airDate = formatAirDate(episode.airDate);
  const hasNumber = episode.number !== undefined;
  const placeholderNumber = hasNumber
    ? String(episode.number).padStart(2, "0")
    : undefined;

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
          <div
            aria-hidden="true"
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            <span
              className="absolute inset-0"
              style={{ backgroundImage: PLACEHOLDER_TEXTURE }}
            />
            {/* Accent rule echoes the rivalry palette without claiming an
                accent per episode. */}
            <span className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-[#FF002A]/60 via-white/30 to-[#002AFF]/60" />
            <span className="absolute right-0 bottom-0 h-px w-full bg-gradient-to-r from-[#002AFF]/60 via-white/30 to-[#FF002A]/60" />
            {placeholderNumber ? (
              <span className="relative font-mono text-6xl leading-none font-bold tracking-tight text-white/20 md:text-7xl">
                {placeholderNumber}
              </span>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {hasNumber ? (
          <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">
            {`Episodio ${episode.number}`}
          </p>
        ) : null}
        <h3 className="text-xl font-bold text-white">
          {episode.title ?? MISSING_CONTENT_LABEL}
        </h3>
        {airDate ? <p className="text-sm text-white/70">{airDate}</p> : null}
        {episode.synopsis ? (
          <p className="text-sm leading-relaxed text-white/80">
            {episode.synopsis}
          </p>
        ) : null}
      </div>
    </article>
  );
}
