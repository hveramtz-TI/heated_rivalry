"use client";

import type { Character, CharacterAccent } from "@/types/content";
import { MISSING_CONTENT_LABEL } from "@/data/ui";
import TiltedCard from "@/components/reactbits/tiltedCard";
import Shield from "@/components/Shield";

/**
 * Flat accent gradients per DESIGN.md §4 (character chapters are immersive
 * color fields with no visible card border). Closed style-token map: an
 * unknown/absent accent degrades to `"neutral"` rather than a JSX-edited
 * gradient (design D2).
 */
const ACCENT_GRADIENTS: Record<CharacterAccent, string> = {
  rivalryRed: "bg-gradient-to-tl from-[#FF002A] to-[#280408]",
  electricBlue: "bg-gradient-to-tr from-[#002AFF] to-[#080428]",
  neutral: "bg-gradient-to-br from-neutral-800 to-black",
};

interface CharacterCardProps {
  character: Character;
  /** First card loads its art eagerly; every other card stays lazy (design D8). */
  eager?: boolean;
}

/**
 * Informational-only roster card (character-roster "Cards Are Informational
 * Only"): no links, buttons, or handlers beyond the decorative hover tilt.
 * Every empty slot renders the shared Spanish missing-content label.
 */
export default function CharacterCard({
  character,
  eager = false,
}: CharacterCardProps) {
  const accent = character.accent ?? "neutral";
  const name = character.name ?? MISSING_CONTENT_LABEL;
  const hasCardArt = character.cardArt !== undefined;
  const shields = character.shields ?? [];

  return (
    <article
      className={`${ACCENT_GRADIENTS[accent]} flex h-full flex-col gap-6 rounded-[15px] p-6 md:p-8`}
    >
      <TiltedCard
        imageSrc={character.cardArt}
        altText={character.name ?? ""}
        captionText={hasCardArt ? (character.name ?? "") : ""}
        showTooltip={hasCardArt}
        loading={eager ? "eager" : "lazy"}
        containerHeight="auto"
        containerWidth="100%"
      />

      <div className="flex flex-col gap-5">
        {shields.length > 0 && (
          <div className="flex flex-row flex-wrap gap-4">
            {shields.map((shield) => (
              <Shield key={shield.src} imageSrc={shield.src} />
            ))}
          </div>
        )}

        <h3 className="text-4xl text-white font-bold md:text-6xl">{name}</h3>

        <p className="max-w-lg text-base text-white md:max-w-xl md:text-lg">
          {character.bio ?? MISSING_CONTENT_LABEL}
        </p>
      </div>
    </article>
  );
}
