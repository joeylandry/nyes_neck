"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductColor } from "@/lib/productColors";
import { getProductDefaultColor } from "@/lib/productImages";
import type { Product } from "@/types/product";
import { ProductCardMedia } from "./ProductCardMedia";

export function ProductSwatches({ colors, className = "", selectedColor, onColorChange, colorCodes = {} }: { colors: string[]; className?: string; selectedColor?: string; onColorChange?: (color: string) => void; colorCodes?: Record<string, string | undefined> }) {
  return <div className={`flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`} aria-label={`${colors.length} color${colors.length === 1 ? "" : "s"} available`}>
    {colors.map((color) => {
      const swatch = <span aria-hidden="true" className="block size-4 rounded-full border border-black/25 ring-1 ring-white" style={{ backgroundColor: getProductColor(color, colorCodes[color]) }} />;
      return onColorChange ? <button key={color} type="button" title={color} aria-label={`Show ${color}`} aria-pressed={selectedColor === color} onClick={() => onColorChange(color)} className={`grid size-6 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedColor === color ? "ring-1 ring-black" : "hover:scale-110"}`}>{swatch}</button> : <span key={color} title={color}>{swatch}</span>;
    })}
  </div>;
}

export function ProductCard({ product, returnTo, priority = false, compact = false, touchSwipeFallback = false }: { product: Product; returnTo: string; priority?: boolean; compact?: boolean; touchSwipeFallback?: boolean }) {
  const [selectedColor, setSelectedColor] = useState(() => getProductDefaultColor(product));
  const colorCodes = useMemo(() => Object.fromEntries(product.colors.map((color) => [color, product.variants.find((variant) => variant.color === color && variant.colorCode)?.colorCode])), [product.colors, product.variants]);
  const href = { pathname: `/shop/${product.slug}`, query: { from: returnTo } };

  return <article className="font-ui">
    <ProductCardMedia key={selectedColor} product={product} selectedColor={selectedColor} href={href} priority={priority} sizes={compact ? "(max-width: 640px) 72vw, 260px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"} aspectClass="aspect-[4/5]" roundedClass={compact ? "rounded-[16px] md:rounded-[20px]" : "rounded-[20px] md:rounded-[30px]"} touchSwipeFallback={touchSwipeFallback} />
    <Link href={href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3">
      <div className={`px-0.5 pb-2 md:px-1 ${compact ? "pt-3 md:pt-4" : "pt-4 md:pt-5"}`}>
        {product.collectionLabel ? <p className={`font-bold uppercase tracking-[0.13em] text-black/45 ${compact ? "mb-1 text-[0.62rem] md:text-xs" : "mb-1.5 text-xs md:text-[0.8rem]"}`}>{product.collectionLabel}</p> : null}
        <h2 className={`font-ui font-bold leading-[1.2] tracking-[-0.025em] ${compact ? "text-[0.9rem] md:text-base" : "text-lg md:text-xl"}`}>{product.name}</h2>
        <p className={`font-ui font-medium text-black/80 ${compact ? "mt-1.5 text-sm" : "mt-2 text-base"}`}>{product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}</p>
      </div>
    </Link>
    {product.colors.length ? <ProductSwatches colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} colorCodes={colorCodes} className="mt-3" /> : null}
  </article>;
}
