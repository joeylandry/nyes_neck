"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductColor } from "@/lib/productColors";
import type { Product } from "@/types/product";

export function ProductSwatches({
  colors,
  className = "",
  selectedColor,
  onColorChange,
}: {
  colors: string[];
  className?: string;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}) {
  const visibleColors = colors.slice(0, 5);
  const overflow = colors.length - visibleColors.length;

  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label={`${colors.length} color${colors.length === 1 ? "" : "s"} available`}>
      {visibleColors.map((color) => {
        const swatch = <span aria-hidden="true" className="block size-4 rounded-full border border-black/25 ring-1 ring-white" style={{ backgroundColor: getProductColor(color) }} />;
        return onColorChange ? <button key={color} type="button" title={color} aria-label={`Show ${color}`} aria-pressed={selectedColor === color} onClick={() => onColorChange(color)} className={`grid size-6 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedColor === color ? "ring-1 ring-black" : "hover:scale-110"}`}>{swatch}</button> : <span key={color} title={color}>{swatch}</span>;
      })}
      {overflow > 0 ? <span className="ml-0.5 text-sm font-medium text-black/60">+{overflow}</span> : null}
    </div>
  );
}

export function ProductCard({
  product,
  returnTo,
  priority = false,
  compact = false,
}: {
  product: Product;
  returnTo: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const mainImage = product.images.find((image) => image.role === "main") ?? product.images[0];
  const selectedImage = product.images.find((image) => image.colors?.includes(selectedColor)) ?? mainImage;

  if (!selectedImage) return null;

  return (
    <article className="font-ui">
      <Link
        href={{ pathname: `/shop/${product.slug}`, query: { from: returnTo } }}
        className={`group block ${compact ? "rounded-[16px] focus-visible:rounded-[16px] md:rounded-[20px] md:focus-visible:rounded-[20px]" : "rounded-[20px] focus-visible:rounded-[20px] md:rounded-[30px] md:focus-visible:rounded-[30px]"}`}
      >
        <div className={`relative aspect-[4/5] overflow-hidden bg-white ${compact ? "rounded-none md:rounded-none" : "rounded-none"}`}>
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            priority={priority}
            sizes={compact ? "(max-width: 640px) 44vw, 185px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
          />
          {!product.available ? (
            <span className={`absolute bg-white/90 font-bold uppercase tracking-[0.1em] backdrop-blur ${compact ? "left-3 top-3 px-2.5 py-1 text-[0.65rem]" : "left-4 top-4 px-3 py-1.5 text-[0.75rem]"}`}>
              Coming soon
            </span>
          ) : null}
        </div>
        <div className={`px-0.5 pb-2 md:px-1 ${compact ? "pt-3 md:pt-4" : "pt-4 md:pt-5"}`}>
          {product.collectionLabel ? (
            <p className={`font-bold uppercase tracking-[0.13em] text-black/45 ${compact ? "mb-1 text-[0.62rem] md:text-xs" : "mb-1.5 text-xs md:text-[0.8rem]"}`}>
              {product.collectionLabel}
            </p>
          ) : null}
          <h2 className={`font-ui font-bold leading-[1.2] tracking-[-0.025em] ${compact ? "text-[0.9rem] md:text-base" : "text-lg md:text-xl"}`}>{product.name}</h2>
          <p className={`font-ui font-medium text-black/80 ${compact ? "mt-1.5 text-sm" : "mt-2 text-base"}`}>
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
      {product.colors.length ? <ProductSwatches colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} className="mt-3" /> : null}
    </article>
  );
}
