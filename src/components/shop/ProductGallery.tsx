"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types/product";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const galleryImages = images.filter((image) => image.role !== "hover");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  if (!activeImage) return null;

  const showPrevious = () => setActiveIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % galleryImages.length);

  return (
    <section aria-label={`${productName} image gallery`}>
      <div className="product-pattern relative aspect-[4/5] overflow-hidden rounded-[20px] border border-black/10 bg-[#e9e1d3] shadow-sm md:rounded-[30px]">
        <Image
          key={activeImage.id}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover"
        />
        {galleryImages.length > 1 ? (
          <>
            <button type="button" onClick={showPrevious} aria-label="Previous image" className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm backdrop-blur transition hover:bg-white">←</button>
            <button type="button" onClick={showNext} aria-label="Next image" className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm backdrop-blur transition hover:bg-white">→</button>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
              {activeIndex + 1} / {galleryImages.length}
            </span>
          </>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <ul className="mt-4 grid grid-cols-5 gap-3" aria-label="Choose product image">
          {galleryImages.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`relative block aspect-[4/5] w-full overflow-hidden rounded-xl border-2 bg-[#e9e1d3] transition ${index === activeIndex ? "border-[#183247]" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
