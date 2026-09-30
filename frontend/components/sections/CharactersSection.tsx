"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getCharacters } from "@/data/characters";
import { getPrefersReducedMotion } from "@/lib/motion";
import CharacterCard from "@/components/cards/CharacterCard";

// Idempotent registration per consumer (design D7 / gsap-react skill).
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The single data-driven roster (character-roster spec). Owns the first-section
 * 55vh offset contract transferred out of `Header.tsx` (design D6): the
 * ScrollTrigger watches the unmarginated section root while the margin tween
 * runs on an inner wrapper, which avoids the self-referential progress loop a
 * margin on the trigger element would create.
 */
export default function CharactersSection() {
  const rootRef = useRef<HTMLElement>(null);
  const offsetRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const characters = getCharacters();

  useGSAP(
    () => {
      const root = rootRef.current;
      const offset = offsetRef.current;
      if (!root || !offset) return;

      // Reduced motion: reach the final spacing without scrubbed movement.
      if (getPrefersReducedMotion()) {
        gsap.set(offset, { marginTop: "55vh" });
        return;
      }

      const offsetTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=50%",
          scrub: true,
        },
      });
      offsetTimeline.to(offset, { marginTop: "55vh", ease: "power1.out" }, 0);

      // Entrance reveal targets per-card wrapper refs only — no global
      // selectors anywhere in this section.
      const grid = gridRef.current;
      const cards = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null,
      );
      if (grid && cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="personajes"
      aria-label="Personajes"
      className="scroll-mt-28 overflow-hidden"
    >
      {/* Animated spacer wrapper: only this element carries the transferred
          margin, never the ScrollTrigger's own trigger element. */}
      <div ref={offsetRef}>
        <div
          ref={gridRef}
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-24 md:grid-cols-3 md:px-8"
        >
          {characters.map((character, index) => (
            <div
              key={character.id}
              className="h-full"
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
            >
              <CharacterCard character={character} eager={index === 0} number={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
