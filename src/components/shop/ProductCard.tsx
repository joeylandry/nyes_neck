"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product, ProductImage } from "@/types/product";

const ROTATION_INTERVAL_MS = 3600;

function getOrderedImages(images: ProductImage[]) {
  const mainImage = images.find((image) => image.role === "main") ?? images[0];
  if (!mainImage) return [];
  return [mainImage, ...images.filter((image) => image.id !== mainImage.id)];
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
  const galleryImages = useMemo(() => getOrderedImages(product.images), [product.images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const rotation = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % galleryImages.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(rotation);
  }, [galleryImages.length]);

  if (!activeImage) return null;

  return (
    <article>
      <Link
        href={{ pathname: `/shop/${product.slug}`, query: { from: returnTo } }}
        className={`group block ${compact ? "rounded-[16px] focus-visible:rounded-[16px] md:rounded-[20px] md:focus-visible:rounded-[20px]" : "rounded-[20px] focus-visible:rounded-[20px] md:rounded-[30px] md:focus-visible:rounded-[30px]"}`}
      >
        <div className={`product-pattern relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#e9e1d3] ${compact ? "rounded-[16px] shadow-[0_8px_24px_rgba(22,22,22,0.05)] md:rounded-[20px]" : "rounded-[20px] shadow-[0_12px_35px_rgba(22,22,22,0.05)] md:rounded-[30px]"}`}>
          {galleryImages.map((image, index) => (
            <Image
              key={image.id}
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              fill
              priority={priority && index === 0}
              sizes={compact ? "(max-width: 640px) 44vw, 185px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              aria-hidden={index === activeIndex ? undefined : true}
              className={`object-cover transition duration-700 motion-reduce:transition-none ${index === activeIndex ? "opacity-100 group-hover:scale-[1.025]" : "opacity-0"}`}
            />
          ))}
          {galleryImages.length > 1 ? (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              {galleryImages.map((image, index) => (
                <span
                  key={`${image.id}-indicator`}
                  className={`size-1.5 rounded-full bg-white shadow-sm transition ${index === activeIndex ? "opacity-95" : "opacity-45"}`}
                />
              ))}
            </div>
          ) : null}
          {!product.available ? (
            <span className={`absolute rounded-full bg-white/90 font-bold uppercase tracking-[0.12em] backdrop-blur ${compact ? "left-3 top-3 px-2.5 py-1 text-[0.82rem]" : "left-4 top-4 px-3 py-1.5 text-[0.95rem]"}`}>
              Coming soon
            </span>
          ) : null}
        </div>
        <div className={`px-0.5 pb-2 md:px-1 ${compact ? "pt-2.5 md:pt-3" : "pt-3.5 md:pt-5"}`}>
          {product.collectionLabel ? (
            <p className={`font-bold uppercase tracking-[0.13em] text-black/45 ${compact ? "mb-1 text-[0.68rem] md:text-xs" : "mb-1.5 text-xs md:text-[0.8rem]"}`}>
              {product.collectionLabel}
            </p>
          ) : null}
          <h2 className={`font-heading font-semibold leading-tight tracking-[-0.025em] ${compact ? "text-[0.95rem] md:text-lg" : "text-lg md:text-xl"}`}>{product.name}</h2>
          <p className={`text-black/55 ${compact ? "mt-1.5 text-sm" : "mt-2 text-base"}`}>
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
