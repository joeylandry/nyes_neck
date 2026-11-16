import type { Product, ProductVariant } from "@/types/product";

/**
 * Variants hidden from the storefront entirely, matched by SKU (the SKU is the
 * same in Printful and Shopify).
 *
 * These are Printful supplier-out-of-stock/unavailable as of Nov 2026: Printful
 * cannot currently make them, so customers must not be able to select or buy
 * them. Nothing is deleted in Shopify or Printful; remove an entry here when
 * the variant comes back and it will reappear on the site.
 */
export const HIDDEN_VARIANT_SKUS: ReadonlySet<string> = new Set([
  // Classic Under Armour hoodie (Shopify product 15420252913949)
  "7715585_19721", // Black / L
  "7715585_19731", // Black / 2XL
  "7715585_19713", // Navy / S
  "7715585_19723", // Navy / L
  "7715585_19733", // Navy / 2XL
  // Under Armour® retro hoodie (Shopify product 10388803911965)
  "7725255_19727", // Grey / XL
  "7725255_19713", // Navy / S
  "7725255_19723", // Navy / L
]);

export function isHiddenVariant(variant: Pick<ProductVariant, "sku">) {
  const sku = variant.sku?.trim();
  return Boolean(sku && HIDDEN_VARIANT_SKUS.has(sku));
}

/**
 * Shopify's own availability (`availableForSale`; the public catalog's
 * `available` flag is false when inventory is ≤ 0 under a "deny" policy).
 * A variant Shopify will not sell stays visible but becomes unpurchasable.
 */
export function applyStoreAvailability(variant: ProductVariant, storeAvailable: boolean | undefined): ProductVariant {
  if (storeAvailable !== false) return variant;
  return { ...variant, available: false, storeSoldOut: true };
}

/**
 * Removes hidden variants and recomputes everything derived from the variant
 * list, so no picker, default selection, or cart action can reach them:
 * - sizes that no longer have any variant are dropped;
 * - colors with no purchasable size are hidden (while anything at all can be
 *   bought; a fully unavailable product keeps its colors to stay browsable);
 * - the product is unavailable when nothing purchasable is left, and is marked
 *   sold out (rather than "coming soon") when that is because of stock.
 */
export function applyVariantAvailability(product: Product): Product {
  const hiddenCount = product.variants.filter(isHiddenVariant).length;
  const storeSoldOut = product.variants.some((variant) => variant.storeSoldOut);
  const variants = hiddenCount ? product.variants.filter((variant) => !isHiddenVariant(variant)) : product.variants;
  const purchasable = variants.filter((variant) => variant.available);
  const available = product.available && purchasable.length > 0;

  // Only narrow an option list when variants actually carry that option.
  const variantsHaveSizes = product.variants.some((variant) => variant.size);
  const variantsHaveColors = product.variants.some((variant) => variant.color);
  const sizes = variantsHaveSizes ? product.sizes.filter((size) => variants.some((variant) => variant.size === size)) : product.sizes;
  const colorSource = available ? purchasable : variants;
  const colors = variantsHaveColors ? product.colors.filter((color) => colorSource.some((variant) => variant.color === color)) : product.colors;

  const unchanged = !hiddenCount && !storeSoldOut && sizes.length === product.sizes.length && colors.length === product.colors.length;
  if (unchanged) return product;

  return {
    ...product,
    variants,
    sizes,
    colors,
    available,
    soldOut: !available && (product.available || hiddenCount > 0 || storeSoldOut),
  };
}

/** A variant a customer can actually add and check out. */
export function isPurchasable(variant: ProductVariant) {
  return variant.available && Boolean(variant.cartUrl) && !isHiddenVariant(variant);
}

/**
 * Cart lines (saved in the browser) whose variant can no longer be bought:
 * hidden, sold out in Shopify, or gone. Lines for products that did not load
 * are left alone so a catalog outage never blocks checkout.
 */
export function findUnavailableCartLines(products: Product[], lines: { id: string; productId: string }[]): string[] {
  const byId = new Map(products.flatMap((product) => [[product.id, product] as const, ...(product.externalId ? [[product.externalId, product] as const] : [])]));
  return lines.flatMap((line) => {
    const product = byId.get(line.productId);
    if (!product) return [];
    const variant = product.variants.find((item) => item.id === line.id);
    return variant && product.available && isPurchasable(variant) ? [] : [line.id];
  });
}

/**
 * Printful variants carry the linked Shopify variant ID. Shopify stays
 * authoritative for whether a variant is for sale (and supplies the SKU when
 * Printful omits one).
 */
export function mergeShopifyVariantState(printfulVariants: ProductVariant[], shopifyVariants: ProductVariant[]): ProductVariant[] {
  const byId = new Map(shopifyVariants.map((variant) => [variant.id, variant]));
  return printfulVariants.map((variant) => {
    const shopifyVariant = byId.get(variant.id);
    if (!shopifyVariant) return variant;
    const withSku = variant.sku || !shopifyVariant.sku ? variant : { ...variant, sku: shopifyVariant.sku };
    return applyStoreAvailability(withSku, !shopifyVariant.storeSoldOut);
  });
}
