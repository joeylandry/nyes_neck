"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { Button } from "@/components/ui/Button";
import { heroImages } from "@/data/hero-images";
import { useCrossfadeCarousel } from "./useCrossfadeCarousel";

const heroPaths = heroImages.map((image) => image.src);

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
          <p className="mt-4 max-w-2xl text-[clamp(1.12rem,3.1vw,2rem)] font-semibold leading-tight tracking-[0.02em] text-white drop-shadow-sm md:mt-5">
            Rooted in Nyes Neck. Made for life on the Cape.
          </p>
          <div className="mt-6 grid w-full max-w-[27rem] grid-cols-2 gap-3">
            <Button href="/shop" className="px-4 py-3 text-lg tracking-normal shadow-md">
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
