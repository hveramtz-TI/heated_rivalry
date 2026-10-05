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
 * margin on the trigger element would create. Each row wrapper also owns its
 * own entrance/exit ScrollTrigger, so rows animate as they enter and leave the
 * viewport instead of in one reveal at the section top.
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

      // Per-row entrance/exit: each wrapper owns four paused tweens plus one
      // ScrollTrigger, so a row animates when its own edges cross the band —
      // in from below / out above while scrolling down, mirrored while
      // scrolling up — instead of the old one-shot reveal at the section top.
      // Targets come from the wrapper refs only: no global selectors here.
      const rows = cardRefs.current.filter(
        (row): row is HTMLDivElement => row !== null,
      );

      // Measure rows in the final 55vh layout, not at the current scrub point.
      // Remove each row's entrance/exit y transform so refresh sees its natural
      // flow position, then add the remaining hero margin to its document top.
      const getFinalLayoutBounds = (row: HTMLDivElement) => {
        const currentMarginTop =
          Number.parseFloat(window.getComputedStyle(offset).marginTop) || 0;
        const targetMarginTop = window.innerHeight * 0.55;
        const rowTranslateY = Number(gsap.getProperty(row, "y", "px")) || 0;
        const top =
          row.getBoundingClientRect().top +
          window.scrollY +
          targetMarginTop -
          currentMarginTop -
          rowTranslateY;

        return { top, bottom: top + row.offsetHeight };
      };

      for (const row of rows) {
        const enterFromBelow = gsap.fromTo(
          row,
          { opacity: 0, y: 64 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            paused: true,
            overwrite: "auto",
          },
        );
        const exitAbove = gsap.to(row, {
          opacity: 0,
          y: -64,
          duration: 0.6,
          ease: "power2.in",
          paused: true,
          overwrite: "auto",
        });
        // `immediateRender: false` keeps this from-state off the row until the
        // user actually scrolls back up into it (otherwise it would clobber
        // the from-below state that the below-fold rows start in).
        const enterFromAbove = gsap.fromTo(
          row,
          { opacity: 0, y: -64 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            paused: true,
            immediateRender: false,
            overwrite: "auto",
          },
        );
        const exitBelow = gsap.to(row, {
          opacity: 0,
          y: 64,
          duration: 0.6,
          ease: "power2.in",
          paused: true,
          overwrite: "auto",
        });

        const trigger = ScrollTrigger.create({
          trigger: row,
          start: () => {
            const { top } = getFinalLayoutBounds(row);
            const rowEntry = top - window.innerHeight * 0.8;
            return Math.max(offsetTimeline.scrollTrigger?.end ?? 0, rowEntry);
          },
          end: () => {
            const { bottom } = getFinalLayoutBounds(row);
            return bottom - window.innerHeight * 0.22;
          },
          onEnter: () => enterFromBelow.play(0),
          onLeave: () => exitAbove.play(0),
          onEnterBack: () => enterFromAbove.play(0),
          onLeaveBack: () => exitBelow.play(0),
        });

        // A deep link (e.g. `#personajes`) can create a row already inside its
        // range, where ScrollTrigger never fires `onEnter`; settle those rows
        // in place rather than leaving them hidden in the from-state.
        if (trigger.progress > 0 && trigger.progress < 1) {
          gsap.set(row, { opacity: 1, y: 0 });
        }
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="personajes"
      aria-labelledby="personajes-heading"
      className="scroll-mt-28 overflow-hidden"
    >
      {/* Animated spacer wrapper: only this element carries the transferred
          margin, never the ScrollTrigger's own trigger element. */}
      <div ref={offsetRef}>
        <div
          ref={gridRef}
          className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-24 md:gap-24 md:px-8"
        >
          {/* Visible section heading: gives the roster an h2 between the page
              h1 and the card h3s. The heading sits inside the animated offset
              wrapper; the T6 per-row triggers measure live row bounds, so the
              extra height is included on refresh. */}
          <header className="flex flex-col gap-4">
            <h2
              id="personajes-heading"
              className="text-4xl font-bold text-white md:text-6xl"
            >
              Personajes
            </h2>
            <p className="max-w-prose text-base text-white/70 md:text-lg">
              Las figuras que protagonizan la rivalidad dentro y fuera de la
              pista.
            </p>
          </header>

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
