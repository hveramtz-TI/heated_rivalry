import Image from "next/image";
import Shield from "@/components/common/Shield";
import { MISSING_CONTENT_LABEL } from "@/data/ui";
import type { Character, CharacterAccent } from "@/types/characters";

type Props = {
  character: Character;
  ordinal: number;
};

const ACCENT_CLASSES: Record<
  CharacterAccent,
  { frame: string; rule: string; placeholder: string }
> = {
  rivalryRed: {
    frame: "bg-gradient-to-br from-[#FF002A] to-[#280408]",
    rule: "bg-[#FF002A]",
    placeholder: "bg-gradient-to-br from-[#FF002A]/30 via-[#280408]/30 to-[#171717]",
  },
  electricBlue: {
    frame: "bg-gradient-to-br from-[#002AFF] to-[#080428]",
    rule: "bg-[#002AFF]",
    placeholder: "bg-gradient-to-br from-[#002AFF]/30 via-[#080428]/30 to-[#171717]",
  },
  neutral: {
    frame: "bg-gradient-to-br from-[#3F3F46] to-[#18181B]",
    rule: "bg-[#3F3F46]",
    placeholder: "bg-gradient-to-br from-[#3F3F46]/60 via-[#27272A]/60 to-[#18181B]",
  },
};

export default function CharacterCard({ character, ordinal }: Props) {
  const name = character.name ?? MISSING_CONTENT_LABEL;
  const bio = character.bio ?? MISSING_CONTENT_LABEL;
  const cardNumber = String(ordinal).padStart(3, "0");
  const certificateNumber = 80000000 + ordinal * 1357911;
  const accent = ACCENT_CLASSES[character.accent ?? "neutral"];
  const shields = character.shields ?? [];

  return (
    <article className="relative isolate mx-auto flex w-full max-w-[340px] flex-col overflow-hidden rounded-[14px] border border-white/25 bg-gradient-to-br from-white/20 via-white/5 to-white/20 p-2 shadow-2xl shadow-black/40 ring-1 ring-white/20">
      <div className="relative z-10">
        <div
          aria-hidden="true"
          className="overflow-hidden rounded-t-[8px] bg-white/95 text-[#171717] shadow-inner"
        >
          <div className="bg-[#FF002A] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.18em] text-white">
            HEATED RIVALRY
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 px-3 pt-2 pb-2">
            <div className="space-y-1">
              <p className="text-[10px] leading-tight font-bold tracking-wide">
                2026 HEATED RIVALRY PROMO
              </p>
              <p className="break-words text-xs leading-tight font-extrabold uppercase">
                {name} — HOLO
              </p>
              <p className="text-[10px] leading-tight font-semibold tracking-[0.12em]">
                RIVALRY SERIES
              </p>
              <div className="h-2.5 w-28 bg-[repeating-linear-gradient(90deg,#171717_0px,#171717_1px,transparent_1px,transparent_3px)]" />
            </div>
            <div className="flex flex-col items-end justify-start gap-1 text-right font-mono text-[10px] leading-tight">
              <p className="font-sans text-[11px] font-black tracking-wide">
                GEM MINT 10
              </p>
              <p className="font-bold">#{cardNumber}</p>
              <p>{certificateNumber}</p>
            </div>
          </div>
        </div>

        <div className={`mt-2 rounded-[10px] p-1.5 ${accent.frame}`}>
          <div className="overflow-hidden rounded-[6px] bg-[#F1E9D2]">
            <div className="bg-[#F1E9D2] px-3 pt-3 pb-2">
              <h3 className="break-words text-center text-lg leading-tight font-extrabold tracking-wide text-[#171717] uppercase">
                {name}
              </h3>
              <div className={`mt-2 h-0.5 w-full ${accent.rule}`} />
            </div>

            <div className="relative aspect-[5/6] w-full overflow-hidden border-y border-[#171717]/70 bg-[#171717]">
              {character.cardArt ? (
                <Image
                  src={character.cardArt}
                  alt={name}
                  width={400}
                  height={480}
                  sizes="(min-width: 768px) 340px, 90vw"
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 flex items-center justify-center overflow-hidden ${accent.placeholder}`}
                >
                  <span className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0px,transparent_14px,rgba(255,255,255,0.04)_14px,rgba(255,255,255,0.04)_15px)]" />
                  <span className="relative text-7xl leading-none font-black tracking-[0.16em] text-white/20">
                    HR
                  </span>
                  <span className="absolute right-3 bottom-3 font-mono text-xs font-bold tracking-widest text-white/45">
                    #{cardNumber}
                  </span>
                </div>
              )}

              {shields.length > 0 ? (
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2">
                  {shields.map((shield) => (
                    <Shield
                      key={`${shield.src}-${shield.alt}`}
                      imageSrc={shield.src}
                      alt={shield.alt}
                      className="pointer-events-none [&>div]:h-10 [&>div]:w-10 [&>div]:rounded-full [&>div]:border [&>div]:border-white/40 [&>div]:bg-white/15 [&>div]:p-1 [&>div]:shadow-lg [&>div>img]:h-8 [&>div>img]:w-8"
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="bg-[#F1E9D2] px-4 pt-3 pb-2 text-[#171717]">
              <p className="text-sm leading-relaxed">{bio}</p>
              <p
                aria-hidden="true"
                className="mt-3 text-center text-[9px] leading-tight font-semibold tracking-[0.12em] text-[#171717]/70"
              >
                HEATED RIVALRY FAN ARCHIVE — DECORATIVE GRADE
              </p>
            </div>
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[14px] bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,transparent_24%,transparent_78%,rgba(255,255,255,0.08)_100%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-1.5 z-30 h-5 w-1 rounded-full bg-white/25"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1.5 bottom-2 z-30 h-5 w-1 rounded-full bg-white/25"
      />
    </article>
  );
}
