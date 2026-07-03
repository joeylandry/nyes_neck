import Image from "next/image";
import { Wordmark } from "./Wordmark";

type HeaderBrandProps = {
  wordmarkClassName?: string;
  compact?: boolean;
};

export function HeaderBrand({ wordmarkClassName = "", compact = false }: HeaderBrandProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`relative block shrink-0 ${compact ? "h-6 w-9" : "h-8 w-12"}`}
      >
        <Image
          src="/images/retro_logo.png"
          alt=""
          width={1536}
          height={1024}
          sizes={compact ? "48px" : "64px"}
          className={`absolute max-w-none ${
            compact ? "-left-1.5 -top-0.5 w-12" : "-left-2 -top-1 w-16"
          }`}
          style={{ clipPath: "polygon(13% 13%, 87% 46%, 13% 79%)" }}
        />
      </span>
      <Wordmark className={wordmarkClassName} />
    </span>
  );
}
