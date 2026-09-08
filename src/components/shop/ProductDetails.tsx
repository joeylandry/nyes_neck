"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PurchaseAction } from "@/components/shop/PurchaseAction";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types/product";

const swatches: Record<string, string> = {
  black: "#171717", white: "#ffffff", navy: "#182b49", "navy blue": "#182b49",
  natural: "#eee5d3", cream: "#f5edda", sand: "#d5c5aa", charcoal: "#414448",
  "sport grey": "#b4b4b2", "sport gray": "#b4b4b2", "heather grey": "#b7b7b5",
  "dark heather": "#55565a", "light blue": "#b9d7e8", "royal blue": "#2455a4",
  "forest green": "#254b36", "military green": "#62674c", maroon: "#651d32",
};

export function ProductDetails({ product }: { product: Product }) {
  const initial = product.variants.find((variant) => variant.available) ?? product.variants[0];
  const [color, setColor] = useState(initial?.color ?? product.colors[0] ?? "");
  const [size, setSize] = useState(initial?.size ?? product.sizes[0] ?? "");
  const variant = product.variants.find((item) => (!color || item.color === color) && (!size || item.size === size));
  const available = product.available && (!product.variants.length || Boolean(variant?.available));
  const price = variant?.priceCents ?? product.priceCents;
  const colorImages = product.images.filter((image) => image.colors?.includes(color));
  const images = color ? colorImages : product.images.filter((image) => !image.colors?.length);

  function selectColor(nextColor: string) {
    setColor(nextColor);
    const matches = product.variants.filter((item) => item.color === nextColor && item.available);
    if (!matches.some((item) => item.size === size)) setSize(matches[0]?.size ?? "");
  }

  return (
    <div className="mt-6 grid items-start gap-8 md:mt-8 md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-16">
      <div>
        {images.length ? <ProductGallery key={color} images={images} productName={product.name} /> : (
          <div className="flex aspect-square items-center justify-center rounded-[30px] bg-[#e9e1d3] p-8 text-center text-black/60">Photo unavailable for {color}.</div>
        )}
        <p className="mt-3 text-xs tracking-wide text-black/50">{colorImages.length ? `${color} · Explore the details` : color ? `Product gallery · ${color} photo not available` : "Explore the details"}</p>
      </div>
      <div className="md:sticky md:top-24 md:py-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#183247]/60">{product.collectionLabel || product.categoryLabel}</p>
        <h1 className="font-heading mt-3 text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.045em] lg:text-5xl">{product.name}</h1>
        <p className="mt-5 text-2xl font-medium" aria-live="polite">{price === null ? "Pricing to be announced" : formatCurrency(price, product.currency)}</p>
        <div className="mt-7 space-y-6 border-y border-black/10 py-7">
          {product.colors.length ? <fieldset>
            <legend className="text-sm font-semibold">Color <span className="ml-2 font-normal text-black/55">{color}</span></legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((option) => {
                const code = product.variants.find((item) => item.color === option && item.colorCode)?.colorCode;
                return <button key={option} type="button" aria-pressed={color === option} onClick={() => selectColor(option)}
                  className={`flex min-h-12 items-center gap-2.5 rounded-full border px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183247] ${color === option ? "border-[#183247] bg-white ring-1 ring-[#183247]" : "border-black/15 hover:border-black/50"}`}>
                  <span aria-hidden="true" className="size-6 rounded-full border border-black/15" style={{ backgroundColor: code || swatches[option.toLowerCase()] || option.toLowerCase().replaceAll(" ", "") }} />
                  {option}
                </button>;
              })}
            </div>
          </fieldset> : null}
          {product.sizes.length ? <fieldset>
            <legend className="text-sm font-semibold">Size <span className="ml-2 font-normal text-black/55">{size || "Choose a size"}</span></legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => {
                const disabled = product.variants.length > 0 && !product.variants.some((item) => (!color || item.color === color) && item.size === option && item.available);
                return <button key={option} type="button" disabled={disabled} aria-pressed={size === option} onClick={() => setSize(option)}
                  className={`min-h-12 min-w-12 rounded-xl border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183247] disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${size === option ? "border-[#183247] bg-[#183247] text-white" : "border-black/15 bg-white/50 hover:border-[#183247]"}`}>{option}</button>;
              })}
            </div>
          </fieldset> : null}
        </div>
        <div className="mt-7">
          <PurchaseAction productId={product.id} variantId={variant?.id} available={available} href={product.externalLink} />
          <p className="mt-3 text-center text-sm text-black/50" aria-live="polite">{!available ? "This selection is currently unavailable." : !product.externalLink ? "Purchasing is not enabled for this product." : [color, size].filter(Boolean).join(" / ")}</p>
        </div>
        <div className="mt-8"><h2 className="text-sm font-semibold">The details</h2><p className="mt-3 text-base leading-7 text-black/60">{product.description}</p></div>
      </div>
    </div>
  );
}
