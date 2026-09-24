"use client";

import Image from "next/image";
import { useState } from "react";
import type { Book } from "@/types/content";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

/**
 * Deterministic Spanish date formatter: `timeZone: "UTC"` keeps the server and
 * client render identical for the same ISO date (no hydration mismatch from a
 * differing local time zone), mirroring EpisodeCard.
 */
const PUBLISHED_DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Spanish-formatted publication date, or the shared label when absent/invalid. */
function formatPublished(published: string | undefined): string {
  if (!published) return MISSING_CONTENT_LABEL;
  const parsed = new Date(published);
  if (Number.isNaN(parsed.getTime())) return MISSING_CONTENT_LABEL;
  return PUBLISHED_DATE_FORMATTER.format(parsed);
}

interface BookCardProps {
  book: Book;
  /** Fired when the cover loads, so the section can refresh ScrollTrigger. */
  onCoverLoad?: () => void;
}

/**
 * Catalog card (book-catalog spec): cover, title, metadata and description.
 * A retailer link renders if and only if a validated `purchaseUrls` entry
 * exists in JSON — the URL comes exclusively from the loader and is never
 * built, guessed, or templated here (decision 4). Every empty slot (cover,
 * title, metadata, description) falls back to the shared Spanish label.
 */
export default function BookCard({ book, onCoverLoad }: BookCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const cover = book.cover;
  const showCover = cover !== undefined && !coverFailed;
  const purchaseLinks = book.purchaseUrls ?? [];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="relative aspect-[2/3] w-full bg-black/40">
        {showCover ? (
          <Image
            src={cover}
            alt={book.title ?? ""}
            width={300}
            height={450}
            sizes="(min-width: 768px) 320px, 80vw"
            loading="lazy"
            className="h-full w-full object-cover"
            onLoad={onCoverLoad}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-white/70">
            {MISSING_CONTENT_LABEL}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-2xl font-bold text-white">
          {book.title ?? MISSING_CONTENT_LABEL}
        </h3>

        <p className="text-sm text-white/70">
          {formatPublished(book.published)}
        </p>
        <p className="text-sm text-white/70">
          {book.pages !== undefined
            ? `${book.pages} páginas`
            : MISSING_CONTENT_LABEL}
        </p>

        <p className="text-sm leading-relaxed text-white/80">
          {book.description ?? MISSING_CONTENT_LABEL}
        </p>

        {purchaseLinks.length > 0 && (
          <ul className="mt-auto flex flex-col gap-2 pt-2">
            {purchaseLinks.map((link) => (
              <li key={`${link.provider}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  {`Comprar en ${link.provider}`}
                  <span className="sr-only"> (enlace externo)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
