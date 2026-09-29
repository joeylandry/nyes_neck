export type HomeHero = {
  image: {
    src: string;
    alt: string;
    desktopPosition?: string;
    mobilePosition?: string;
  };
  eyebrow: string;
  headline: string;
  subhead: string;
};

// Swap `image` for a photo of someone wearing the apparel once one exists —
// the layout is built around a single campaign shot, like a lookbook cover.
export const homeHero: HomeHero = {
  image: {
    src: "/images/hero/nyes-neck-sunset.webp",
    alt: "A weathered fence and stone jetty overlooking Nyes Neck at sunset",
    desktopPosition: "center 60%",
    mobilePosition: "56% center",
  },
  eyebrow: "The Nyes Neck Collection",
  headline: "Made for life on the Cape",
  subhead: "Everyday apparel inspired by the water, the jetty, and long summer evenings on Nyes Neck.",
};
