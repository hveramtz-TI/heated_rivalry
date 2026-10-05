"use client";

import Image from "next/image";
import type { Character, CharacterAccent } from "@/types/content";
import { MISSING_CONTENT_LABEL } from "@/data/ui";
import TiltedCard from "@/components/reactbits/tiltedCard";
import Shield from "@/components/Shield";

/**
 * Accent style-token map for the character chapters (DESIGN.md §4): flat
 * immersive color fields with no visible card border. Closed record — an
 * unknown/absent accent degrades to `"neutral"` rather than a JSX-edited
 * gradient (design D2).
 *
 * `field` paints the article background; `band` reuses the same two colors for
 * the slab label's top band, laid out horizontally.
 */
const ACCENT_TONES: Record<CharacterAccent, { field: string; band: string }> = {
  rivalryRed: {
    field: "bg-gradient-to-tl from-[#FF002A] to-[#280408]",
    band: "bg-gradient-to-r from-[#FF002A] to-[#280408]",
  },
  electricBlue: {
    field: "bg-gradient-to-tr from-[#002AFF] to-[#080428]",
    band: "bg-gradient-to-r from-[#002AFF] to-[#080428]",
  },
  neutral: {
    field: "bg-gradient-to-br from-neutral-800 to-black",
    band: "bg-gradient-to-r from-neutral-800 to-black",
  },
};

/**
 * Decorative barcode (pure CSS): three bar widths (2px / 3px / 1px) inside a
 * 16px period, so the pattern is fully deterministic — no randomness, same
 * bars on every render.
 */
const BARCODE_STRIPES =
  "repeating-linear-gradient(90deg, #09090b 0px, #09090b 2px, transparent 2px, transparent 4px, #09090b 4px, #09090b 7px, transparent 7px, transparent 9px, #09090b 9px, #09090b 10px, transparent 10px, transparent 16px)";

/** Faint diagonal sheen that sells the acrylic case (decorative only). */
const CASE_GLARE =
  "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 30%, transparent 48%, transparent 72%, rgba(255,255,255,0.07) 100%)";

interface CharacterCardProps {
  character: Character;
  /** First card loads its art eagerly; every other card stays lazy (design D8). */
  eager?: boolean;
  /**
   * 1-based roster position feeding the slab's decorative card number and
   * cert. Defaults to 1 so the chrome stays deterministic when omitted.
   */
  number?: number;
}

interface SlabLabelProps {
  name: string;
  number: number;
  band: string;
}

/**
 * Decorative slab label: the accent band (set line, name, card number, grade)
 * over the white paper band (barcode, monogram, cert). Every slot is fictional
 * chrome, so the whole strip is `aria-hidden` — the accessible content of the
 * card lives in its heading and bio below.
 */
function SlabLabel({ name, number, band }: SlabLabelProps) {
  const cardNumber = `#${String(number).padStart(3, "0")}`;
  const certNumber = String(80000000 + number * 1357911);

  return (
    <div
      aria-hidden="true"
      className="flex flex-col overflow-hidden rounded-md"
    >
      <div
        className={`${band} flex items-start justify-between gap-3 border-b border-black/20 px-3 py-2 text-white`}
      >
        <div className="flex min-w-0 flex-col">
          <span className="text-[9px] font-semibold tracking-[0.22em] text-white/80 uppercase">
            Heated Rivalry
          </span>
          <span className="mt-0.5 truncate text-base leading-tight font-bold uppercase">
            {name}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end leading-none">
          <span className="font-mono text-[10px] tracking-[0.18em] text-white/80">
            {cardNumber}
          </span>
          <span className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-[9px] font-semibold tracking-[0.18em] text-white/90 uppercase">
              Gem Mint
            </span>
            <span className="font-mono text-lg font-bold">10</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-white/90 px-3 py-2">
        <span
          className="h-6 w-24"
          style={{
            backgroundImage: BARCODE_STRIPES,
            // Deterministic per-card offset (never random) so the bars are
            // not pixel-identical across the roster.
            backgroundPositionX: `${(number * 5) % 16}px`,
          }}
        />
        <span className="flex shrink-0 items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-neutral-900 font-mono text-[10px] font-bold text-white">
            HR
          </span>
          <span className="font-mono text-[10px] tracking-[0.16em] text-neutral-900/80">
            {certNumber}
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * Informational-only roster card (character-roster "Cards Are Informational
 * Only"): no links, buttons, or handlers beyond the decorative hover tilt.
 * The art sits in a graded trading-card slab whose label chrome (card number,
 * grade, barcode, cert) is fictional and derived from the roster ordinal.
 * The card is a vertical stack in every grid cell — slab and name centred at
 * the top, description below — so the roster reads in a consistent order
 * regardless of the column count. Every empty slot renders the shared Spanish
 * missing-content label.
 */
export default function CharacterCard({
  character,
  eager = false,
  number = 1,
}: CharacterCardProps) {
  const tone = ACCENT_TONES[character.accent ?? "neutral"];
  const name = character.name ?? MISSING_CONTENT_LABEL;
  const shields = character.shields ?? [];

  return (
    <article
      className={`${tone.field} flex h-full flex-col gap-6 rounded-[15px] p-6 md:gap-8 md:p-8`}
    >
      {/* Card zone: the slab with the name centred underneath, always full
          cell width so every grid item shares the same visual anchor. */}
      <div className="flex w-full flex-col items-center gap-5">
        <TiltedCard
          content={
            <div className="relative rounded-2xl bg-gradient-to-b from-white/20 via-white/10 to-white/5 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_28px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/25 sm:p-3">
              <div className="flex flex-col gap-2.5">
                <SlabLabel name={name} number={number} band={tone.band} />

                <div className="relative overflow-hidden rounded-md bg-black/50 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.95)] ring-1 ring-black/70">
                  {character.cardArt ? (
                    <Image
                      src={character.cardArt}
                      alt={character.name ?? ""}
                      width={300}
                      height={400}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      loading={eager ? "eager" : "lazy"}
                      className="block h-auto w-full"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] w-full items-center justify-center bg-black/60 px-4 text-center text-sm text-white/70">
                      {MISSING_CONTENT_LABEL}
                    </div>
                  )}

                  {/* Team and nationality badges over the photo; the descendant
                      utilities shrink Shield's default 64px pill to a badge. */}
                  {shields.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-1.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] [&>div>div]:rounded-xl [&>div>div]:border [&>div>div]:p-1 [&_img]:h-10 [&_img]:w-10">
                      {shields.map((shield) => (
                        <Shield
                          key={shield.src}
                          imageSrc={shield.src}
                          alt={shield.alt}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ backgroundImage: CASE_GLARE }}
              />
            </div>
          }
          rotateAmplitude={9}
          scaleOnHover={1.04}
          showTooltip={false}
        />

        <h3 className="text-center text-3xl font-bold text-white md:text-4xl">
          {name}
        </h3>
      </div>

      <div className="w-full">
        <p className="max-w-prose text-base text-white md:text-lg">
          {character.bio ?? MISSING_CONTENT_LABEL}
        </p>
      </div>
    </article>
  );
}
