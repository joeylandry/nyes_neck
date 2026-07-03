"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { Button } from "@/components/ui/Button";
import { heroImages } from "@/data/hero-images";
import { useCrossfadeCarousel } from "./useCrossfadeCarousel";

const heroPaths = heroImages.map((image) => image.src);
const MINI_SHOP_SCROLL_DURATION = 1400;

function scrollToMiniShop(event: MouseEvent<HTMLElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const target = document.getElementById("mini-shop");

  if (!target) {
    return;
  }

  event.preventDefault();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  const headerVariable = desktop ? "--desktop-header-height" : "--mobile-header-height";
  const headerHeight = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(headerVariable),
  ) || 0;
  const startPosition = window.scrollY;
  const targetPosition = Math.max(
    0,
    target.getBoundingClientRect().top + startPosition - headerHeight,
  );

  if (reducedMotion) {
    window.scrollTo({ top: targetPosition, behavior: "auto" });
    window.history.replaceState(null, "", "#mini-shop");
    return;
  }

  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const progress = Math.min((currentTime - startTime) / MINI_SHOP_SCROLL_DURATION, 1);
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo({
      top: startPosition + distance * easedProgress,
      behavior: "auto",
    });

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
    } else {
      window.history.replaceState(null, "", "#mini-shop");
    }
  };

  window.requestAnimationFrame(animateScroll);
}

export function HeroGallery() {
  const activeIndex = useCrossfadeCarousel(heroPaths);
  const imagePosition = (mobile?: string, desktop?: string) =>
    ({ "--mobile-position": mobile, "--desktop-position": desktop } as CSSProperties);

  return (
    <section className="hero-height relative isolate w-full overflow-hidden" aria-label="NYES NECK introduction">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={index === activeIndex ? image.alt : ""}
            fill
            priority={index === 0}
            loading={index === 0 ? undefined : "eager"}
            sizes="100vw"
            aria-hidden={index !== activeIndex}
            className={`hero-image object-cover transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
            style={imagePosition(image.mobilePosition, image.desktopPosition)}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/12 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_44%)]" />

      <div className="relative z-10 flex h-full items-center justify-center px-5 text-center md:px-6">
        <div className="flex max-w-3xl flex-col items-center">
          <Wordmark tone="light" className="text-[clamp(2.2rem,10.5vw,5.2rem)] tracking-[0.13em] drop-shadow-sm" />
          <div className="mt-3 flex w-full max-w-[20rem] items-center gap-3 text-white sm:max-w-[24rem] sm:gap-4">
            <span aria-hidden="true" className="h-px flex-1 bg-white/80" />
            <p className="shrink-0 text-[1.05rem] font-semibold leading-none tracking-[0.08em] drop-shadow-sm sm:text-[1.175rem]">
              Apparel and Clothing
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-white/80" />
          </div>
          <p className="mt-4 max-w-2xl text-[clamp(1.12rem,3.1vw,2rem)] font-semibold leading-tight tracking-[0.02em] text-white drop-shadow-sm md:mt-5">
            Rooted in Nyes Neck. Made for life on the Cape.
          </p>
          <div className="mt-6 grid w-full max-w-[27rem] grid-cols-2 gap-3">
            <Button
              href="#mini-shop"
              className="px-4 py-3 text-lg tracking-normal shadow-md"
              onClick={scrollToMiniShop}
            >
              Explore Products
            </Button>
            <Button href="/about" variant="secondary" className="px-4 py-3 text-lg tracking-normal">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
