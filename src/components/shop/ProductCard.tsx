"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductColor } from "@/lib/productColors";
import type { Product } from "@/types/product";

export function ProductSwatches({ colors, className = "", selectedColor, onColorChange, colorCodes = {} }: { colors: string[]; className?: string; selectedColor?: string; onColorChange?: (color: string) => void; colorCodes?: Record<string, string | undefined> }) {
  const visibleColors = colors.slice(0, 5);
  const overflow = colors.length - visibleColors.length;
  return <div className={`flex items-center gap-1.5 ${className}`} aria-label={`${colors.length} color${colors.length === 1 ? "" : "s"} available`}>
    {visibleColors.map((color) => {
      const swatch = <span aria-hidden="true" className="block size-4 rounded-full border border-black/25 ring-1 ring-white" style={{ backgroundColor: getProductColor(color, colorCodes[color]) }} />;
      return onColorChange ? <button key={color} type="button" title={color} aria-label={`Show ${color}`} aria-pressed={selectedColor === color} onClick={() => onColorChange(color)} className={`grid size-6 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedColor === color ? "ring-1 ring-black" : "hover:scale-110"}`}>{swatch}</button> : <span key={color} title={color}>{swatch}</span>;
    })}
    {overflow > 0 ? <span className="ml-0.5 text-sm font-medium text-black/60">+{overflow}</span> : null}
  </div>;
}

export function ProductCard({ product, returnTo, priority = false, compact = false }: { product: Product; returnTo: string; priority?: boolean; compact?: boolean }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [imageIndex, setImageIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const mainImage = product.images.find((image) => image.role === "main") ?? product.images[0];
  const colorCodes = useMemo(() => Object.fromEntries(product.colors.map((color) => [color, product.variants.find((variant) => variant.color === color && variant.colorCode)?.colorCode])), [product.colors, product.variants]);
  const images = useMemo(() => {
    const colorImages = selectedColor ? product.images.filter((image) => image.colors?.includes(selectedColor)) : [];
    return colorImages.length ? colorImages : mainImage ? [mainImage] : [];
  }, [mainImage, product.images, selectedColor]);
  const selectedImage = images[imageIndex] ?? images[0];
  const moveImage = (direction: number) => setImageIndex((current) => (current + direction + images.length) % images.length);
  const changeColor = (color: string) => { setSelectedColor(color); setImageIndex(0); };
  if (!selectedImage) return null;

  return <article className="font-ui">
    <div className={`group relative ${compact ? "rounded-[16px] md:rounded-[20px]" : "rounded-[20px] md:rounded-[30px]"}`}>
      <Link href={{ pathname: `/shop/${product.slug}`, query: { from: returnTo } }} onPointerDown={(event) => { pointerStart.current = event.clientX; didSwipe.current = false; }} onPointerUp={(event) => {
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(distance) < 28 || images.length < 2) return;
        didSwipe.current = true;
        moveImage(distance < 0 ? 1 : -1);
      }} onPointerCancel={() => { pointerStart.current = null; }} onClick={(event) => { if (didSwipe.current) { event.preventDefault(); didSwipe.current = false; } }} className="block rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[inherit] bg-white">
          <Image src={selectedImage.src} alt={selectedImage.alt} fill priority={priority} sizes={compact ? "(max-width: 640px) 44vw, 185px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"} className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none" />
          {!product.available ? <span className={`absolute bg-white/90 font-bold uppercase tracking-[0.1em] backdrop-blur ${compact ? "left-3 top-3 px-2.5 py-1 text-[0.65rem]" : "left-4 top-4 px-3 py-1.5 text-[0.75rem]"}`}>Coming soon</span> : null}
        </div>
      </Link>
      {images.length > 1 ? <>
        <button type="button" onClick={() => moveImage(-1)} className="absolute left-2 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow-sm transition hover:bg-white focus-visible:grid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:grid" aria-label={`Previous ${product.name} image`}><span aria-hidden="true">‹</span></button>
        <button type="button" onClick={() => moveImage(1)} className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow-sm transition hover:bg-white focus-visible:grid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:grid" aria-label={`Next ${product.name} image`}><span aria-hidden="true">›</span></button>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">{images.map((image, index) => <span key={image.id} className={`size-1.5 rounded-full shadow-sm ${index === imageIndex ? "bg-white" : "bg-white/55"}`} />)}</div>
      </> : null}
    </div>
    <Link href={{ pathname: `/shop/${product.slug}`, query: { from: returnTo } }} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3">
      <div className={`px-0.5 pb-2 md:px-1 ${compact ? "pt-3 md:pt-4" : "pt-4 md:pt-5"}`}>
        {product.collectionLabel ? <p className={`font-bold uppercase tracking-[0.13em] text-black/45 ${compact ? "mb-1 text-[0.62rem] md:text-xs" : "mb-1.5 text-xs md:text-[0.8rem]"}`}>{product.collectionLabel}</p> : null}
        <h2 className={`font-ui font-bold leading-[1.2] tracking-[-0.025em] ${compact ? "text-[0.9rem] md:text-base" : "text-lg md:text-xl"}`}>{product.name}</h2>
        <p className={`font-ui font-medium text-black/80 ${compact ? "mt-1.5 text-sm" : "mt-2 text-base"}`}>{product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}</p>
      </div>
    </Link>
    {product.colors.length ? <ProductSwatches colors={product.colors} selectedColor={selectedColor} onColorChange={changeColor} colorCodes={colorCodes} className="mt-3" /> : null}
  </article>;
}
