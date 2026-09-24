"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getBooks } from "@/data/books";
import { MISSING_CONTENT_LABEL } from "@/data/ui";
import { getPrefersReducedMotion, requestScrollTriggerRefresh } from "@/lib/motion";
import BookCard from "@/components/cards/BookCard";

// Idempotent registration per consumer (design D7 / gsap-react skill).
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The Books catalog (book-catalog spec): a grid from the validated loader, or
 * the shared Spanish missing-content panel when `books.json` ships empty. The
 * section pulls its own data; cards receive it strictly by props.
 */
export default function BooksSection() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const books = getBooks();

  // Entrance reveal: scoped to this section, per-card wrapper refs only, and
  // gated by the shared reduced-motion check (no movement when reduced).
  useGSAP(
    () => {
      if (getPrefersReducedMotion()) return;
      const grid = gridRef.current;
      const cards = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null,
      );
      if (!grid || cards.length === 0) return;
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
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="libros"
      aria-labelledby="libros-heading"
      className="scroll-mt-28 bg-black text-white"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24 md:px-8">
        <h2
          id="libros-heading"
          className="text-4xl font-bold text-white md:text-6xl"
        >
          Libros
        </h2>

        {books.length === 0 ? (
          <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-center text-sm text-white/70">
            {MISSING_CONTENT_LABEL}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid w-full gap-8 sm:grid-cols-2 md:grid-cols-3"
          >
            {books.map((book, index) => (
              <div
                key={book.id}
                className="h-full"
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
              >
                <BookCard
                  book={book}
                  onCoverLoad={requestScrollTriggerRefresh}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
