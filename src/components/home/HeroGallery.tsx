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

      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center md:px-6">
        <div className="flex max-w-3xl flex-col items-center">
          <Wordmark tone="light" className="text-[clamp(2.85rem,14vw,4.25rem)] tracking-[0.13em] drop-shadow-sm md:text-[clamp(2.2rem,10.5vw,5.2rem)]" />
          <div className="mt-2.5 flex w-full max-w-[19rem] items-center gap-2.5 text-white md:mt-3 md:max-w-[24rem] md:gap-4">
            <span aria-hidden="true" className="h-px flex-1 bg-white/80" />
            <p className="shrink-0 text-[1.08rem] font-semibold leading-none tracking-[0.06em] drop-shadow-sm md:text-[1.175rem] md:tracking-[0.08em]">
              Apparel and Clothing
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-white/80" />
          </div>
          <p className="mt-3.5 max-w-[21rem] text-[1.02rem] font-semibold leading-snug tracking-[0.01em] text-white drop-shadow-sm md:mt-5 md:max-w-2xl md:text-[clamp(1.12rem,3.1vw,2rem)] md:leading-tight md:tracking-[0.02em]">
            Inspired by Nyes Neck. Made for life on the Cape.
          </p>
          <div className="mt-5 flex w-full gap-3 md:mt-6 md:grid md:max-w-[27rem] md:grid-cols-2">
            <Button
              href="#mini-shop"
              className="flex-1 bg-white !px-4 !py-3 !text-base !leading-none !tracking-normal text-[#161616] !shadow-none hover:!translate-y-0 hover:opacity-95 md:!text-lg md:!shadow-md md:hover:!-translate-y-0.5"
              onClick={scrollToMiniShop}
            >
              Explore Products
            </Button>
            <Button
              href="/about"
              variant="secondary"
              className="flex-1 border-white !px-4 !py-3 !text-base !leading-none !tracking-normal text-white hover:!translate-y-0 hover:!bg-white hover:!text-[#161616] md:!text-lg md:hover:!-translate-y-0.5 md:hover:!bg-white/10 md:hover:!text-white"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
