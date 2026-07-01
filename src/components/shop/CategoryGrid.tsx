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
    <nav aria-label={ariaLabel} className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {tiles.map((tile, index) => (
        <Link
          key={tile.id}
          href={tile.href}
          className={`group product-pattern relative flex aspect-[4/3] items-end overflow-hidden rounded-[22px] border border-black/10 p-4 shadow-[0_10px_28px_rgba(22,22,22,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(22,22,22,0.12)] sm:p-5 ${tileColors[index % tileColors.length]}`}
        >
          {tile.image ? (
            <Image
              src={tile.image.src}
              alt={tile.image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
            />
          ) : null}
          {tile.image ? <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10" aria-hidden="true" /> : null}
          <span className={`font-heading relative z-10 max-w-[12ch] text-xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-2xl ${tile.image ? "text-white" : ""}`}>
            {tile.name}
          </span>
          <span
            aria-hidden="true"
            className={`absolute right-4 top-4 z-10 text-xl transition-transform duration-300 group-hover:translate-x-1 sm:right-5 sm:top-5 ${tile.image ? "text-white" : ""}`}
          >
            →
          </span>
        </Link>
      ))}
    </nav>
  );
}
