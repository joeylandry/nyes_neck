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
  const [quantity, setQuantity] = useState(1);
  const variant = product.variants.find((item) => (!color || item.color === color) && (!size || item.size === size));
  const available = product.available && (!product.variants.length || Boolean(variant?.available));
  const price = variant?.priceCents ?? product.priceCents;
  // Color-tagged Printful images are intentionally never mixed. This ensures a
  // customer sees every available view for the selected color—and no other.
  const colorImages = color
    ? product.images.filter((image) => image.colors?.includes(color))
    : product.images.filter((image) => !image.colors?.length);
  const images = colorImages.length ? colorImages : product.images;

  function selectColor(nextColor: string) {
    setColor(nextColor);
    const matches = product.variants.filter((item) => item.color === nextColor && item.available);
    if (!matches.some((item) => item.size === size)) setSize(matches[0]?.size ?? "");
  }

  return (
    <div className="mt-6 grid items-start gap-8 md:mt-8 md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-16">
      <div>
        {images.length ? <ProductGallery key={color} images={images} productName={product.name} /> : (
          <div className="flex aspect-[4/5] items-center justify-center rounded-[30px] bg-[#e9e1d3] p-8 text-center text-black/60">Photo unavailable for {color}.</div>
        )}
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
                const disabled = product.variants.length > 0 && !product.variants.some((item) => item.color === option && item.available && item.cartUrl);
                return <button key={option} type="button" disabled={disabled} aria-pressed={color === option} onClick={() => selectColor(option)}
                  className={`flex min-h-12 items-center gap-2.5 rounded-full border px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183247] disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${color === option ? "border-[#183247] bg-white ring-1 ring-[#183247]" : "border-black/15 hover:border-black/50"}`}>
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
                const disabled = product.variants.length > 0 && !product.variants.some((item) => (!color || item.color === color) && item.size === option && item.available && item.cartUrl);
                return <button key={option} type="button" disabled={disabled} aria-pressed={size === option} onClick={() => setSize(option)}
                  className={`min-h-12 min-w-12 rounded-xl border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183247] disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${size === option ? "border-[#183247] bg-[#183247] text-white" : "border-black/15 bg-white/50 hover:border-[#183247]"}`}>{option}</button>;
              })}
            </div>
          </fieldset> : null}
        </div>
        <div className="mt-7">
          {product.available ? <label className="mb-5 flex items-center gap-4 text-sm font-semibold">
            Quantity
            <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="min-h-12 rounded-xl border border-black/15 bg-white px-4">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label> : null}
          <PurchaseAction productId={product.id} variantId={variant?.id} available={available} cartUrl={variant?.cartUrl} quantity={quantity} comingSoon={!product.available} item={variant?.cartUrl ? {
            id: variant.id,
            productId: product.id,
            name: product.name,
            image: images[0]?.src,
            priceCents: price,
            currency: product.currency,
            options: [color, size].filter(Boolean).join(" / "),
            cartUrl: variant.cartUrl,
          } : undefined} />
          {!product.available || !available ? <p className="mt-3 text-center text-sm text-black/50" aria-live="polite">{!product.available ? "Coming soon. Check back for availability." : "This selection is currently unavailable. Please choose another size or color."}</p> : null}
        </div>
        <div className="mt-8"><h2 className="text-sm font-semibold">Item details</h2><p className="mt-3 text-base leading-7 text-black/60">{product.description}</p></div>
      </div>
    </div>
  );
}
