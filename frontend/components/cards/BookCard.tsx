"use client";

import Image from "next/image";
import { useState } from "react";
import type { Book } from "@/types/books";
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

/** Spanish-formatted publication date, or `undefined` when absent/invalid. */
function formatPublished(published: string | undefined): string | undefined {
  if (!published) return undefined;
  const parsed = new Date(published);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return PUBLISHED_DATE_FORMATTER.format(parsed);
}

interface BookCardProps {
  book: Book;
  /** Fired when the cover loads, so the section can refresh ScrollTrigger. */
  onCoverLoad?: () => void;
}

export default function BookCard({ book, onCoverLoad }: BookCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const cover = book.cover;
  const showCover = cover !== undefined && !coverFailed;
  const purchaseLinks = book.purchaseUrls ?? [];
  const published = formatPublished(book.published);
  const hasMeta = published !== undefined || book.pages !== undefined;

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
          <div
            aria-hidden="true"
            className="relative h-full w-full overflow-hidden bg-gradient-to-br from-white/[0.07] via-black to-black"
          >
            <span className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-[#FF002A]/50 via-white/20 to-[#002AFF]/50" />
            <span className="absolute bottom-5 left-1/2 h-1.5 w-2/5 -translate-x-1/2 rounded-full bg-white/10" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-2xl font-bold text-white">
          {book.title ?? MISSING_CONTENT_LABEL}
        </h3>

        {hasMeta ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
            {published ? <p>{published}</p> : null}
            {book.pages !== undefined ? <p>{`${book.pages} páginas`}</p> : null}
          </div>
        ) : null}

        {book.description ? (
          <p className="text-sm leading-relaxed text-white/80">
            {book.description}
          </p>
        ) : null}

        {purchaseLinks.length > 0 && (
          <ul className="mt-auto flex flex-col gap-2 pt-2">
            {purchaseLinks.map((link) => (
              <li key={`${link.provider}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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
