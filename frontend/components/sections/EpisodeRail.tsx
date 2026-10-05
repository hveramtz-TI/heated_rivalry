"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Season } from "@/types/content";
import { getPrefersReducedMotion } from "@/lib/motion";
import EpisodeCard from "@/components/cards/EpisodeCard";

interface EpisodeRailProps {
  season?: Season;
  /** Card elements registered by index so the section can reveal them. */
  cardRefs?: RefObject<(HTMLElement | null)[]>;
  /** Forwarded to every card so a late artwork load can refresh ScrollTrigger. */
  onCardImageLoad?: () => void;
}

/** 1px tolerance guards subpixel `scrollLeft` on zoomed displays (design D5). */
const BOUNDARY_TOLERANCE_PX = 1;

/** 44px (h-11) square controls satisfy the touch-target floor (T2). */
const CONTROL_CLASSES =
  "inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-white/30 bg-white/5 text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

/** Hydration gate: server snapshot keeps measured attrs stable through hydration. */
const emptySubscribe = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

/**
 * Native-overflow episode rail (design D5). Scrolling stays browser-native —
 * GSAP never owns `scrollLeft` and there is no pin/`containerAnimation`/wheel
 * interception here. The rail owns scrolling only; season data arrives by props.
 */
export default function EpisodeRail({
  season,
  cardRefs,
  onCardImageLoad,
}: EpisodeRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  // The mount measurement can settle before React finishes hydrating the page;
  // gating on this snapshot keeps the SSR `disabled` attrs stable until then.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  const episodes = season?.episodes ?? [];
  const isEmpty = episodes.length === 0;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // A season switch swaps the row content; return to the leading edge before
    // the next measurement so boundary state stays deterministic.
    rail.scrollLeft = 0;

    let frame = 0;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= BOUNDARY_TOLERANCE_PX) {
        setAtStart(true);
        setAtEnd(true);
        return;
      }
      setAtStart(rail.scrollLeft <= BOUNDARY_TOLERANCE_PX);
      setAtEnd(rail.scrollLeft >= max - BOUNDARY_TOLERANCE_PX);
    };
    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    // Passive scroll listener (rAF-throttled) + ResizeObserver on the rail and
    // the content row covers user scroll, container resize, and card resize.
    rail.addEventListener("scroll", scheduleUpdate, { passive: true });
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(rail);
    const row = rowRef.current;
    if (row) observer.observe(row);
    scheduleUpdate();

    return () => {
      rail.removeEventListener("scroll", scheduleUpdate);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [season]);

  const scrollByCards = (direction: 1 | -1) => {
    const rail = railRef.current;
    const row = rowRef.current;
    if (!rail || !row) return;
    const firstCard = row.firstElementChild;
    if (!(firstCard instanceof HTMLElement)) return;
    // One visible card increment: card width + the row's column gap.
    const columnGap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    const step = firstCard.offsetWidth + columnGap;
    if (step <= 0) return;
    rail.scrollBy({
      left: direction * step,
      behavior: getPrefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end gap-3">
        <button
          type="button"
          aria-label="Episodios anteriores"
          disabled={!hydrated || atStart}
          onClick={() => scrollByCards(-1)}
          className={CONTROL_CLASSES}
        >
          <FiChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Episodios siguientes"
          disabled={!hydrated || atEnd}
          onClick={() => scrollByCards(1)}
          className={CONTROL_CLASSES}
        >
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label="Listado de episodios"
        tabIndex={0}
        data-lenis-prevent
        className="scroll-pr-6 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        {isEmpty ? (
          <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 px-6 text-center">
            <p className="text-base font-semibold text-white">
              Esta temporada todavía no tiene episodios
            </p>
            <p className="text-sm text-white/60">
              Vuelve pronto para ver las novedades.
            </p>
          </div>
        ) : (
          <div ref={rowRef} className="flex gap-6 pr-6">
            {episodes.map((episode, index) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                cardRef={(element) => {
                  if (cardRefs) cardRefs.current[index] = element;
                }}
                onArtworkLoad={onCardImageLoad}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
