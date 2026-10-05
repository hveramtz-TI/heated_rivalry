"use client";

import { useCallback, useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_MEDIA_QUERY = (breakpoint: number) =>
  `(max-width: ${breakpoint - 1}px)`;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const query = MOBILE_MEDIA_QUERY(breakpoint);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
