"use client";

import { useEffect, useState } from "react";

type Options = { intervalMs?: number };

export function useCrossfadeCarousel(
  images: string[],
  { intervalMs = 10000 }: Options = {},
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [images, intervalMs]);

  return activeIndex;
}
