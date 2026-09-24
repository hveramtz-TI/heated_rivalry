/**
 * Books loader (design D3): pure, synchronous, never-throwing. `purchaseUrls`
 * is the ONLY source of retailer affordances: an entry without both a valid
 * provider name and an `https://` URL cannot render a link and is rejected,
 * while a present-but-empty/absent array yields no affordance at all.
 *
 * Import purity: only `@/types/content`, `./guards` and `./books.json`.
 */

import type { Book, RetailerLink } from "@/types/content";
import {
  asAssetPath,
  asHttpUrl,
  asIsoDate,
  asNumber,
  asString,
  isRecord,
} from "./guards";
import booksJson from "./books.json";

function asRetailerLinks(value: unknown): RetailerLink[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const links: RetailerLink[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }
    const provider = asString(item.provider);
    const url = asHttpUrl(item.url);
    if (provider !== undefined && url !== undefined) {
      links.push({ provider, url });
    }
  }
  return links;
}

function normalizeBook(raw: unknown, index: number): Book {
  if (!isRecord(raw)) {
    return { id: `book-${index}` };
  }
  return {
    id: asString(raw.id) ?? `book-${index}`,
    title: asString(raw.title),
    cover: asAssetPath(raw.cover),
    description: asString(raw.description),
    published: asIsoDate(raw.published),
    pages: asNumber(raw.pages),
    purchaseUrls: asRetailerLinks(raw.purchaseUrls),
  };
}

/** Typed catalog; malformed entries fail soft, the loader never throws. */
export function getBooks(): Book[] {
  const raw: unknown = booksJson;
  const entries: unknown[] = Array.isArray(raw) ? raw : [];
  return entries.map((entry, index) => normalizeBook(entry, index));
}
