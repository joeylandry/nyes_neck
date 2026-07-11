import Image from "next/image";
import { Wordmark } from "./Wordmark";

type HeaderBrandProps = {
  wordmarkClassName?: string;
  compact?: boolean;
  showWordmark?: boolean;
  logoSize?: "compact" | "default" | "mobileHeader";
};

export function HeaderBrand({
  wordmarkClassName = "",
  compact = false,
  showWordmark = true,
  logoSize = compact ? "compact" : "default",
}: HeaderBrandProps) {
  const logoClasses = {
    compact: {
      frame: "h-6 w-9",
      image: "-left-1.5 -top-0.5 w-12",
      sizes: "48px",
    },
    default: {
      frame: "h-8 w-12",
      image: "-left-2 -top-1 w-16",
      sizes: "64px",
    },
    mobileHeader: {
      frame: "h-9 w-14",
      image: "-left-2.5 -top-1.5 w-[4.75rem]",
      sizes: "76px",
    },
  }[logoSize];

  return (
    <span className="inline-flex items-center gap-3">
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
      {showWordmark ? <Wordmark className={wordmarkClassName} /> : null}
    </span>
  );
}
