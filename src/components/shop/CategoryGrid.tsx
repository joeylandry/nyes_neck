import Image from "next/image";
import Link from "next/link";
import type { ShopTile } from "@/types/product";

const tileColors = [
  "bg-[#183247] text-white",
  "bg-[#7899a8] text-white",
  "bg-[#d8c7a8] text-[#161616]",
  "bg-[#a8c2bc] text-[#161616]",
  "bg-[#e9e1d3] text-[#161616]",
];

export function CategoryGrid({ tiles, ariaLabel }: { tiles: ShopTile[]; ariaLabel: string }) {
  return (
    <nav aria-label={ariaLabel} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {tiles.map((tile, index) => {
        const content = (
          <>
            {tile.image ? (
              <Image
                src={tile.image.src}
                alt={tile.image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition duration-500 motion-reduce:transform-none ${tile.comingSoon ? "grayscale-[35%]" : "group-hover:scale-[1.025]"}`}
              />
            ) : null}
            {tile.image ? <span className={`absolute inset-0 ${tile.comingSoon ? "bg-black/55" : "bg-gradient-to-t from-black/65 via-black/5 to-black/10"}`} aria-hidden="true" /> : null}
            <span className="relative z-10 flex flex-col gap-1.5">
              <span className={`font-heading max-w-[12ch] text-[1.15rem] font-semibold leading-[1.05] tracking-[-0.04em] md:text-2xl ${tile.image ? "text-white" : ""}`}>
                {tile.name}
              </span>
              {tile.comingSoon ? (
                <span className={`text-xs font-bold uppercase tracking-[0.16em] ${tile.image ? "text-white/85" : "text-current/70"}`}>
                  Coming soon
                </span>
              ) : null}
            </span>
            {!tile.comingSoon ? (
              <span
                aria-hidden="true"
                className={`absolute right-3 top-3 z-10 text-lg transition-transform duration-300 group-hover:translate-x-1 md:right-5 md:top-5 md:text-xl ${tile.image ? "text-white" : ""}`}
              >
                →
              </span>
            ) : null}
          </>
        );
        const className = `group product-pattern relative flex aspect-[4/3] items-end overflow-hidden rounded-[17px] border border-black/10 p-3.5 shadow-[0_10px_28px_rgba(22,22,22,0.05)] md:rounded-[22px] md:p-5 ${tileColors[index % tileColors.length]} ${tile.comingSoon ? "cursor-default" : "transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(22,22,22,0.12)]"}`;

        return tile.comingSoon ? (
          <div key={tile.id} className={className} aria-label={`${tile.name}, coming soon`}>
            {content}
          </div>
        ) : (
          <Link key={tile.id} href={tile.href} className={className}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
