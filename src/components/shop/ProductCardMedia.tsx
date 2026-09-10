"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";

type ProductHref = { pathname: string; query: { from: string } };

export function ProductCardMedia({
  product,
  selectedColor,
  href,
  priority = false,
  sizes,
  aspectClass = "aspect-[3/4]",
  roundedClass = "",
}: {
  product: Product;
  selectedColor: string;
  href: ProductHref;
  priority?: boolean;
  sizes: string;
  aspectClass?: string;
  roundedClass?: string;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressNextClick = useRef(false);
  const mainImage = product.images.find((image) => image.role === "main") ?? product.images[0];
  const images = useMemo(() => {
    const colorImages = selectedColor ? product.images.filter((image) => image.colors?.includes(selectedColor)) : [];
    return colorImages.length ? colorImages : mainImage ? [mainImage] : [];
  }, [mainImage, product.images, selectedColor]);
  const selectedImage = images[imageIndex] ?? images[0];

  if (!selectedImage) return null;

  const moveImage = (direction: number) => {
    if (images.length < 2) return;
    setImageIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div className={`group relative ${roundedClass}`}>
      <Link
        href={href}
        draggable={false}
        aria-label={`View ${product.name}`}
        className="block rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          pointerStart.current = { x: event.clientX, y: event.clientY };
          suppressNextClick.current = false;
        }}
        onPointerUp={(event) => {
          if (!pointerStart.current) return;
          const distanceX = event.clientX - pointerStart.current.x;
          const distanceY = event.clientY - pointerStart.current.y;
          pointerStart.current = null;
          if (images.length < 2 || Math.abs(distanceX) < 32 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
          suppressNextClick.current = true;
          moveImage(distanceX < 0 ? 1 : -1);
        }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onDragStart={(event) => event.preventDefault()}
        onClick={(event) => {
          if (!suppressNextClick.current) return;
          event.preventDefault();
          suppressNextClick.current = false;
        }}
      >
        <div className={`relative ${aspectClass} touch-pan-y select-none overflow-hidden rounded-[inherit] bg-white`}>
          <Image
            key={selectedImage.id}
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            priority={priority}
            sizes={sizes}
            draggable={false}
            className="pointer-events-none object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
          />
          {!product.available ? <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] backdrop-blur">Coming soon</span> : null}
        </div>
      </Link>

      {images.length > 1 ? (
        <>
          <button type="button" onClick={() => moveImage(-1)} className="absolute left-2 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus-visible:grid focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:grid" aria-label={`Previous ${product.name} image`}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" onClick={() => moveImage(1)} className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus-visible:grid focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:grid" aria-label={`Next ${product.name} image`}>
            <span aria-hidden="true">›</span>
          </button>
          {images.length <= 6 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
              {images.map((image, index) => <span key={image.id} className={`size-1.5 rounded-full shadow-sm ${index === imageIndex ? "bg-white" : "bg-white/55"}`} />)}
            </div>
          ) : (
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur" aria-hidden="true">{imageIndex + 1} / {images.length}</span>
          )}
          <span className="sr-only" aria-live="polite">Image {imageIndex + 1} of {images.length}</span>
        </>
      ) : null}
    </div>
  );
}
