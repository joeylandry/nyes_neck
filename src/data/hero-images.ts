export type HeroImage = {
  src: string;
  alt: string;
  desktopPosition?: string;
  mobilePosition?: string;
};

export const heroImages: HeroImage[] = [
  {
    src: "/images/hero/nyes-neck-sunset.webp",
    alt: "A weathered fence and stone jetty overlooking Nyes Neck at sunset",
    desktopPosition: "center center",
    mobilePosition: "56% center",
  },
  {
    src: "/images/hero/rocky-shore-sunset.webp",
    alt: "The setting sun reflecting across the water beside the rocky Nyes Neck shore",
    desktopPosition: "center center",
    mobilePosition: "center center",
  },
  {
    src: "/images/hero/stormy-shore-sunset.webp",
    alt: "Storm clouds above a coral sunset and the rocky Nyes Neck shoreline",
    desktopPosition: "center center",
    mobilePosition: "58% center",
  },
  {
    src: "/images/hero/coastal-homes-sunset.webp",
    alt: "Warm evening sun reflecting across Nyes Neck water beside coastal homes",
    desktopPosition: "center center",
    mobilePosition: "52% center",
  },
  {
    src: "/images/hero/harbor-dock-sunset.webp",
    alt: "A centered harbor dock leading toward anchored boats beneath a Cape Cod sunset",
    desktopPosition: "center center",
    mobilePosition: "center center",
  },
  {
    src: "/images/hero/golden-dock-sunset.webp",
    alt: "A quiet dock and stone jetty leading toward a golden Nyes Neck sunset",
    desktopPosition: "center center",
    mobilePosition: "58% center",
  },
];
