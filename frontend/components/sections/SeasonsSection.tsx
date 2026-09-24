"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Season } from "@/types/content";
import { getSeasons } from "@/data/seasons";
import {
  getPrefersReducedMotion,
  requestScrollTriggerRefresh,
} from "@/lib/motion";
import SeasonSelector from "@/components/sections/SeasonSelector";
import SeasonTimeline from "@/components/sections/SeasonTimeline";
import EpisodeRail from "@/components/sections/EpisodeRail";

// Idempotent registration per consumer (design D7 / gsap-react skill).
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The season browser (season-browser spec): `useState` selected season, the
 * selector and timeline beside/above a native-overflow episode rail. The
 * section owns the selected-season state; the rail owns scrolling and receives
 * data strictly by props.
 */
export default function SeasonsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  // Static build-time data: one stable array identity per mount.
  const [seasons] = useState<Season[]>(() => getSeasons());
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => seasons[0]?.id,
  );
  const previousSeasonIdRef = useRef(selectedId);
  const selectedSeason = seasons.find((season) => season.id === selectedId);

  // Entrance reveal: created once, top-level timeline, per-card refs only.
  useGSAP(
    () => {
      if (getPrefersReducedMotion()) return;
      const root = rootRef.current;
      if (!root) return;
      const cards = cardRefs.current.filter(
        (card): card is HTMLElement => card !== null,
      );
      if (cards.length === 0) return;
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: rootRef },
  );

  // Season transition: re-runs on selection change; skipped entirely (content
  // renders at rest) under reduced motion.
  useGSAP(
    () => {
      const previousSeasonId = previousSeasonIdRef.current;
      previousSeasonIdRef.current = selectedId;
      // Initial mount (and any non-change re-run) has nothing to reveal.
      if (previousSeasonId === selectedId) return;

      if (getPrefersReducedMotion()) {
        requestScrollTriggerRefresh();
        return;
      }
      const cards = cardRefs.current.filter(
        (card): card is HTMLElement => card !== null,
      );
      if (cards.length === 0) {
        requestScrollTriggerRefresh();
        return;
      }
      gsap.fromTo(
        cards,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
          onComplete: requestScrollTriggerRefresh,
        },
      );
    },
    { scope: rootRef, dependencies: [selectedId], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
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

        <EpisodeRail
          season={selectedSeason}
          cardRefs={cardRefs}
          onCardImageLoad={requestScrollTriggerRefresh}
        />
      </div>
    </section>
  );
}
