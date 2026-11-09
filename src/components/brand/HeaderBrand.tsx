import Image from "next/image";
import { LogoWreath } from "@/components/holiday/Wreath";
import { Wordmark } from "./Wordmark";

type HeaderBrandProps = {
  wordmarkClassName?: string;
  compact?: boolean;
  showWordmark?: boolean;
  logoSize?: "compact" | "default" | "mobileHeader";
  /** Frames the pennant in a Christmas wreath (header only). */
  wreath?: boolean;
};

export function HeaderBrand({
  wordmarkClassName = "",
  compact = false,
  showWordmark = true,
  logoSize = compact ? "compact" : "default",
  wreath = false,
}: HeaderBrandProps) {
  const logoClasses = {
    compact: {
      frame: "h-6 w-9",
      image: "-left-1.5 -top-0.5 w-12",
      sizes: "48px",
      wreath: "size-11",
      inWreath: "scale-[0.6]",
    },
    default: {
      frame: "h-8 w-12",
      image: "-left-2 -top-1 w-16",
      sizes: "64px",
      wreath: "size-[3.6rem]",
      inWreath: "scale-[0.66] translate-x-[1.5px]",
    },
    mobileHeader: {
      frame: "h-9 w-14",
      image: "-left-2.5 -top-1.5 w-[4.75rem]",
      sizes: "76px",
      wreath: "size-[3.5rem]",
      inWreath: "scale-[0.56] translate-x-[1.5px]",
    },
  }[logoSize];

  const pennant = (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 ${logoClasses.frame}`}
    >
      <Image
        src="/images/retro_logo.png"
        alt=""
        width={1536}
        height={1024}
        sizes={logoClasses.sizes}
        className={`absolute max-w-none ${logoClasses.image}`}
        style={{ clipPath: "polygon(13% 13%, 87% 46%, 13% 79%)" }}
      />
    </span>
  );

  return (
    <span className="inline-flex items-center gap-3">
      {wreath ? (
        // The pennant is scaled down so its points sit inside the wreath's
        // ring, and nudged right to center its visual weight.
        <span aria-hidden="true" className={`relative grid shrink-0 place-items-center ${logoClasses.wreath}`}>
          <LogoWreath className="absolute inset-0 size-full" />
          <span className={logoClasses.inWreath}>{pennant}</span>
        </span>
      ) : pennant}
      {showWordmark ? <Wordmark className={wordmarkClassName} /> : null}
    </span>
  );
}
