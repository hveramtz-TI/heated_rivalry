/**
 * Hand-written, never-throwing validators that narrow unknown JSON into the
 * typed content contracts (design D3). No runtime validation dependency is
 * added: every helper returns `undefined` instead of throwing, so loaders can
 * fail soft entry by entry.
 */

import { ALLOWED_REMOTE_HOSTS } from "@/lib/images";

/** Narrows to a non-null object that is not an array. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Trimmed non-empty string, or undefined. Returns the trimmed value. */
export function asString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function httpsUrlHost(value: string): string | undefined {
  if (!value.startsWith("https://")) {
    return undefined;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.hostname : undefined;
  } catch {
    return undefined;
  }
}

/** Full `https://` URL on any host, or undefined. For retailer deep links. */
export function asHttpUrl(value: unknown): string | undefined {
  const candidate = asString(value);
  if (candidate === undefined) {
    return undefined;
  }
  return httpsUrlHost(candidate) === undefined ? undefined : candidate;
}

function isAllowedRemoteHost(host: string): boolean {
  return (ALLOWED_REMOTE_HOSTS as readonly string[]).includes(host);
}

/**
 * Asset path: a `public/`-rooted web path ("/…") or an `https://` URL whose
 * hostname is on the single-source ALLOWED_REMOTE_HOSTS (design D8).
 * Everything else — protocol-relative paths, non-https schemes, hosts outside
 * the two-entry allowlist — is rejected.
 */
export function asAssetPath(value: unknown): string | undefined {
  const candidate = asString(value);
  if (candidate === undefined) {
    return undefined;
  }
  // "//host/path" is protocol-relative, never a public/-rooted asset.
  if (candidate.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }
  const host = httpsUrlHost(candidate);
  return host !== undefined && isAllowedRemoteHost(host) ? candidate : undefined;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** ISO `YYYY-MM-DD` date string, or undefined. */
export function asIsoDate(value: unknown): string | undefined {
  const candidate = asString(value);
  if (candidate === undefined || !ISO_DATE_PATTERN.test(candidate)) {
    return undefined;
  }
  return Number.isNaN(Date.parse(candidate)) ? undefined : candidate;
}

/** Finite number for `Episode.number` / `Book.pages`; numeric strings coerce. */
export function asNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}
