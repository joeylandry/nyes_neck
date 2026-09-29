import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { homeHero } from "@/data/home-hero";
import { getShopSettings } from "@/lib/products";

export async function HomeHero() {
  const settings = await getShopSettings();
  const featuredCategory = settings.featuredCategory;
  const shopHref = featuredCategory ? `/shop/category/${featuredCategory.slug}` : "/shop";
  const { image, eyebrow, headline, subhead } = homeHero;

  return (
    <section className="home-hero relative isolate w-full overflow-hidden bg-[#161616]" aria-labelledby="home-hero-heading">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="hero-image object-cover"
        style={{ "--mobile-position": image.mobilePosition, "--desktop-position": image.desktopPosition } as CSSProperties}
      />
      {/* Only the lower-left corner needs darkening, so the photo keeps its colour. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent md:bg-gradient-to-tr md:from-black/60 md:via-black/10" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-8 md:px-6 md:pb-14">
        <div className="max-w-xl text-white">
          <p className="font-ui text-xs font-bold uppercase tracking-[0.18em] text-white/85 md:text-sm">
            {eyebrow}
          </p>
          <h1 id="home-hero-heading" className="font-ui mt-3 text-balance text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
            {headline}
          </h1>
          <p className="font-ui mt-4 max-w-md text-base leading-snug text-white/90 md:text-lg">
            {subhead}
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href={shopHref}
              className="font-ui inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-4 md:flex-none md:px-7 text-base font-bold !text-[#161616] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Shop now
            </Link>
            <Link
              href="/about"
              className="font-ui inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white px-4 md:flex-none md:px-7 text-base font-bold !text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
