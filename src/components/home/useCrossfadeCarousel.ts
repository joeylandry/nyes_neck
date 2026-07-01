"use client";

import { useEffect, useRef, useState } from "react";

type Options = { intervalMs?: number; fadeMs?: number };

export function useCrossfadeCarousel(
  images: string[],
  { intervalMs = 10000, fadeMs = 1200 }: Options = {},
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const activeIndexRef = useRef(0);
  const transitioningRef = useRef(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (images.length <= 1) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let transitionTimeout: number | undefined;
    let firstFrame: number | undefined;
    let secondFrame: number | undefined;
    let cancelled = false;

    const beginTransition = () => {
      if (cancelled || transitioningRef.current) return;
      const nextIndex = (activeIndexRef.current + 1) % images.length;
      const preloader = new window.Image();

      const reveal = () => {
        if (cancelled || transitioningRef.current) return;
        transitioningRef.current = true;
        setIncomingIndex(nextIndex);
        setIncomingVisible(false);
        firstFrame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => {
            if (cancelled) return;
            setIncomingVisible(true);
            transitionTimeout = window.setTimeout(() => {
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
              setIncomingIndex(null);
              setIncomingVisible(false);
              transitioningRef.current = false;
            }, fadeMs);
          });
        });
      };

      preloader.onload = reveal;
      preloader.onerror = reveal;
      preloader.src = images[nextIndex];
      if (preloader.complete) reveal();
    };

    const interval = window.setInterval(beginTransition, intervalMs);
    return () => {
      cancelled = true;
      transitioningRef.current = false;
      window.clearInterval(interval);
      if (transitionTimeout) window.clearTimeout(transitionTimeout);
      if (firstFrame) window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [fadeMs, images, intervalMs]);

  return { activeIndex, incomingIndex, incomingVisible };
}
