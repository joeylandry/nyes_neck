"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PurchaseAction } from "@/components/shop/PurchaseAction";
import { useCart } from "@/components/shop/CartProvider";
import { bulkPricingEnabled, bulkTiers, getBulkTier, getNextBulkTier, getQuantityPresets, quantityPresetLabel } from "@/lib/bulkPricing";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductColor } from "@/lib/productColors";
import { getProductDefaultColor } from "@/lib/productImages";
import type { Product } from "@/types/product";

export function ProductDetails({ product }: { product: Product }) {
  const defaultColor = getProductDefaultColor(product);
  const initial = product.variants.find((variant) => variant.color === defaultColor && variant.available)
    ?? product.variants.find((variant) => variant.available)
    ?? product.variants[0];
  const [color, setColor] = useState(initial?.color ?? defaultColor);
  const [size, setSize] = useState(initial?.size ?? product.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const { itemCount } = useCart();
  // One-size goods (glasses, hats, decals) have nothing to choose, so they must
  // never be held at "Select a size". A size is only ambiguous when the product
  // genuinely offers more than one, where the lookup below would otherwise
  // silently resolve to whichever size happens to be first.
  const onlySize = product.sizes.length === 1 ? product.sizes[0] : undefined;
  const needsSize = product.sizes.length > 1 && !size;
  const variant = needsSize
    ? undefined
    : product.variants.find((item) => (!color || item.color === color) && (!size || item.size === size));
  const available = product.available && (!product.variants.length || Boolean(variant?.available));
  const price = variant?.priceCents ?? product.priceCents;
  // Color-tagged Printful images are intentionally never mixed. This ensures a
  // customer sees every available view for the selected color—and no other.
  const colorImages = color
    ? product.images.filter((image) => image.colors?.includes(color))
    : product.images.filter((image) => !image.colors?.length);
  const images = colorImages.length ? colorImages : product.images;
  // Volume pricing is an order-level Shopify discount, so the tier depends on
  // everything already in the cart plus what is about to be added.
  const quantityPresets = getQuantityPresets(product.category);
  const quantityOptions = Array.from(new Set([...Array.from({ length: 12 }, (_, index) => index + 1), ...quantityPresets, quantity])).sort((first, second) => first - second);
  const orderQuantity = itemCount + quantity;
  const orderTier = getBulkTier(orderQuantity);
  const nextTier = getNextBulkTier(orderQuantity);
  const itemsAway = nextTier ? nextTier.minimumQuantity - orderQuantity : 0;

  function selectColor(nextColor: string) {
    setColor(nextColor);
    const matches = product.variants.filter((item) => item.color === nextColor && item.available);
    if (!matches.some((item) => item.size === size)) setSize(onlySize ?? matches[0]?.size ?? "");
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
                  <span aria-hidden="true" className="size-6 rounded-full border border-black/15" style={{ backgroundColor: getProductColor(option, code) }} />
                  {option}
                </button>;
              })}
            </div>
          </fieldset> : null}
          {product.sizes.length === 1 ? <p className="text-sm font-semibold">Size <span className="ml-2 font-normal text-black/55">{onlySize}</span></p> : null}
          {product.sizes.length > 1 ? <fieldset>
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
          {product.available ? <div className="mb-5">
            <label className="flex items-center gap-4 text-sm font-semibold" htmlFor="product-quantity">
              Quantity
              <select id="product-quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="min-h-12 rounded-xl border border-black/15 bg-white px-4">
                {quantityOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            {bulkPricingEnabled ? <div className="mt-4 rounded-2xl bg-[#e9e1d3]/70 p-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Bulk quantities">
                {quantityPresets.map((preset) => {
                  const tier = getBulkTier(preset);
                  return <button key={preset} type="button" aria-pressed={quantity === preset} onClick={() => setQuantity(preset)}
                    className={`min-h-12 min-w-28 flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183247] ${quantity === preset ? "border-[#183247] bg-[#183247] text-white" : "border-black/15 bg-white/70 hover:border-[#183247]"}`}>
                    {quantityPresetLabel(preset)}
                    <span className={`mt-0.5 block text-xs font-medium ${quantity === preset ? "text-white/75" : "text-black/55"}`}>
                      {preset === 1 ? "1 item" : `${preset} items`}{tier ? ` · save ${tier.percentOff}%` : ""}
                    </span>
                  </button>;
                })}
              </div>
              <p className="mt-3 text-sm leading-6 text-black/60" aria-live="polite">
                {orderTier
                  ? `${orderQuantity} ${orderQuantity === 1 ? "item" : "items"} with this selection — ${orderTier.percentOff}% off your order at checkout.`
                  : nextTier
                    ? `Add ${itemsAway} more ${itemsAway === 1 ? "item" : "items"} to save ${nextTier.percentOff}% on your order.`
                    : ""}
              </p>
              <p className="mt-1 text-xs leading-5 text-black/45">
                Volume pricing: {bulkTiers.map((tier) => `${tier.minimumQuantity}+ save ${tier.percentOff}%`).join(" · ")}. Mix any items.
              </p>
            </div> : null}
          </div> : null}
          <PurchaseAction productId={product.id} variantId={variant?.id} available={available} cartUrl={variant?.cartUrl} quantity={quantity} comingSoon={!product.available} needsSelection={needsSize} item={variant?.cartUrl ? {
            id: variant.id,
            productId: product.id,
            name: product.name,
            image: images[0]?.src,
            priceCents: price,
            currency: product.currency,
            options: [color, size].filter(Boolean).join(" / "),
            cartUrl: variant.cartUrl,
          } : undefined} />
          {!product.available || !available ? <p className="mt-3 text-center text-sm text-black/50" aria-live="polite">{!product.available ? "Coming soon. Check back for availability." : needsSize ? "Choose a size to continue." : "This selection is currently unavailable. Please choose another size or color."}</p> : null}
        </div>
        <div className="mt-8"><h2 className="text-sm font-semibold">Item details</h2><p className="mt-3 text-base leading-7 text-black/60">{product.description}</p></div>
      </div>
    </div>
  );
}
