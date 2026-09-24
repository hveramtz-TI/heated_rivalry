/**
 * Single source of truth for remote image hosts (design D8).
 *
 * Consumed by `data/guards.ts` (runtime validation of `ImageRef.src` and
 * other asset fields, this slice) and by `next.config.ts`
 * (`images.remotePatterns`, slice 5). The allowlist covers exactly the two
 * interim shield-art hosts and MUST NOT grow within this change
 * (motion-system spec); the end state is `public/`-rooted paths only.
 */
export const ALLOWED_REMOTE_HOSTS = [
  "static.wikia.nocookie.net",
  "upload.wikimedia.org",
] as const;
