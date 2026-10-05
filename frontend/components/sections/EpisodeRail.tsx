import EpisodeCard from "@/components/cards/EpisodeCard";
import type { Episode } from "@/types/seasons";

interface EpisodeRailProps {
  episodes: Episode[];
  seasonName?: string;
}

export default function EpisodeRail({
  episodes,
  seasonName,
}: EpisodeRailProps) {
  const regionLabel = seasonName
    ? `Episodios de ${seasonName}`
    : "Episodios";

  return (
    <div
      role="region"
      aria-label={regionLabel}
      tabIndex={0}
      className="flex w-full min-w-0 snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
}
