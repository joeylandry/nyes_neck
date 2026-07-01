export type HeroImage = {
  src: string;
  alt: string;
  desktopPosition?: string;
  mobilePosition?: string;
};

export const heroImages: HeroImage[] = [
  {
    src: "/images/hero/dune-path.webp",
    alt: "A sandy path through beach grass toward calm Cape Cod water",
    desktopPosition: "center 54%",
    mobilePosition: "center center",
  },
  {
    src: "/images/hero/weathered-dock.webp",
    alt: "A weathered cedar dock beside a quiet Upper Cape tidal cove",
    desktopPosition: "center 64%",
    mobilePosition: "57% center",
  },
  {
    src: "/images/hero/hydrangea-lane.webp",
    alt: "Blue hydrangeas beside weathered Cape Cod cedar shingles",
    desktopPosition: "center center",
    mobilePosition: "66% center",
  },
];
