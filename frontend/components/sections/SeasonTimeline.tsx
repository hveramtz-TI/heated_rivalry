import type { Season } from "@/types/content";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

interface SeasonTimelineProps {
  seasons: Season[];
  /** Id of the selected season; its node carries `aria-current="true"`. */
  selectedId?: string;
}

/**
 * Static season timeline (design D5): an `<ol>` of season nodes from props with
 * an `aria-current="true"` active indication. Active styling is transform-only
 * (a CSS dot scale). With zero seasons the track renders bare — no nodes and no
 * error state.
 */
export default function SeasonTimeline({
  seasons,
  selectedId,
}: SeasonTimelineProps) {
  return (
    <div>
      <ol
        aria-label="Recorrido de temporadas"
        className="flex flex-wrap items-center gap-6"
      >
        {seasons.map((season) => {
          const isActive = season.id === selectedId;
          return (
            <li
              key={season.id}
              aria-current={isActive ? "true" : undefined}
              className="flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full border transition-transform duration-300 ${
                  isActive
                    ? "scale-125 border-white bg-white"
                    : "border-white/40 bg-black"
                }`}
              />
              <span
                className={`text-sm font-semibold tracking-widest uppercase ${
                  isActive ? "text-white" : "text-white/60"
                }`}
              >
                {season.name ?? MISSING_CONTENT_LABEL}
                {season.year ? (
                  <span className="ml-2 text-white/40">{season.year}</span>
                ) : null}
                {season.status === "upcoming" ? (
                  <span className="ml-2 rounded-full border border-white/25 px-2 py-0.5 text-xs font-medium tracking-normal text-white/70 normal-case">
                    Próximamente
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
