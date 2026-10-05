"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getBooks } from "@/data/books";
import { getPrefersReducedMotion, requestScrollTriggerRefresh } from "@/lib/motion";
import BookCard from "@/components/cards/BookCard";

// Idempotent registration per consumer (design D7 / gsap-react skill).
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Three illustrative slots for the empty catalog. This is static template
 * chrome, never catalog data: every card carries an "Ejemplo" badge and the
 * fillable shape is documented in `frontend/data/books.example.json`.
 */
const BOOK_TEMPLATE_SLOTS = [1, 2, 3] as const;

/**
 * Clearly labeled example of the BookCard shape shown while `books.json` is
 * empty. Only the badge and the placeholder title/description are readable
 * text; the cover and metadata bars are decorative (`aria-hidden`) and no
 * purchase affordance is rendered, so an example can never be mistaken for a
 * real catalog entry.
 */
function BookTemplateCard() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.03]">
      <div
        aria-hidden="true"
        className="relative flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-white/[0.07] via-black to-black"
      >
        <span className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-[#FF002A]/50 via-white/20 to-[#002AFF]/50" />
        <span className="h-16 w-11 rounded-sm border border-white/15 bg-white/[0.04]" />
        <span className="h-1.5 w-24 rounded-full bg-white/10" />
        <span className="h-1.5 w-16 rounded-full bg-white/10" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <span className="inline-flex w-fit items-center rounded-full border border-white/25 px-2.5 py-1 text-xs font-semibold text-white/80">
          Ejemplo
        </span>
        <h3 className="text-2xl font-bold text-white/80">Título del libro</h3>
        <div aria-hidden="true" className="flex flex-col gap-2">
          <span className="h-1.5 w-28 rounded-full bg-white/10" />
          <span className="h-1.5 w-20 rounded-full bg-white/10" />
        </div>
        <p className="text-sm leading-relaxed text-white/50">
          Aquí irá la descripción del libro.
        </p>
      </div>
    </article>
  );
}

/**
 * The Books catalog (book-catalog spec, T3 polish): a grid from the validated
 * loader, or a labeled example template when `books.json` ships empty. The
 * examples are static chrome (badge, placeholder copy, decorative skeleton
 * parts) and never enter the data path; the fillable shape is documented in
 * `frontend/data/books.example.json`. The section pulls its own data; cards
 * receive it strictly by props.
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
          <div className="flex flex-col gap-8">
            <div className="flex max-w-prose flex-col gap-2">
              <p className="text-lg font-semibold text-white">
                Los libros de la serie llegarán pronto.
              </p>
              <p className="text-sm text-white/60">
                Mientras tanto, este es el formato que tendrá cada ficha. Los
                ejemplos se reemplazan con los datos reales.
              </p>
            </div>

            <ul
              aria-label="Ejemplos de ficha de libro"
              className="grid w-full gap-8 sm:grid-cols-2 md:grid-cols-3"
            >
              {BOOK_TEMPLATE_SLOTS.map((slot) => (
                <li key={slot} className="h-full">
                  <BookTemplateCard />
                </li>
              ))}
            </ul>
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
