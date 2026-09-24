"use client";

/**
 * Shared motion gate (design D7): the single source of the
 * prefers-reduced-motion decision every new section timeline consumes from
 * slice 2 onward, plus the debounced ScrollTrigger.refresh() helper used after
 * layout-affecting changes (season switches, late image loads).
 *
 * `lib/` may reference gsap; `types/` and `data/` must never do so
 * (content-models "Import purity"). Ad-hoc matchMedia checks per component
 * are forbidden — consume these functions instead.
 */

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Debounce window for the shared ScrollTrigger.refresh() helper (ms). */
const REFRESH_DEBOUNCE_MS = 100;

/**
 * SSR-safe imperative reduced-motion check: false on the server (or when
 * matchMedia is unavailable), live media-query value in the browser.
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Reactive reduced-motion state with a change listener (media queries can
 * flip mid-session). Consumed by LenisProvider (slice 5); sections inside
 * useGSAP bodies use the imperative getPrefersReducedMotion().
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    getPrefersReducedMotion,
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    // No synchronous re-sync here: the useState initializer already reads the
    // live value on the client, and the rule against setState in the effect
    // body keeps render cascading impossible (react-hooks rule, Next 16).
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  return prefersReducedMotion;
}

let pendingRefreshTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Debounced (one module-level timer, ~100 ms) ScrollTrigger.refresh()
 * request: safe to call from many image onLoad / transition-settle sites
 * without causing a refresh storm after layout-affecting changes.
 */
export function requestScrollTriggerRefresh(): void {
  if (typeof window === "undefined") {
    return;
  }
  if (pendingRefreshTimer !== undefined) {
    clearTimeout(pendingRefreshTimer);
  }
  pendingRefreshTimer = setTimeout(() => {
    pendingRefreshTimer = undefined;
    ScrollTrigger.refresh();
  }, REFRESH_DEBOUNCE_MS);
}
