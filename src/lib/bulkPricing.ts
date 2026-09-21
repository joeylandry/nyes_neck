/**
 * Volume pricing for the order as a whole.
 *
 * The storefront never charges anyone — Shopify does — so these tiers only
 * mirror a discount configured in the Shopify admin ("percentage off order"
 * with a minimum item quantity). Everything the site shows is an estimate that
 * checkout confirms, which keeps one source of truth for money while still
 * letting a customer see the saving before they leave the site.
 */
export type BulkTier = {
  /** Total items in the order needed to unlock the tier. */
  minimumQuantity: number;
  percentOff: number;
  /** Customer-facing name for the quantity, such as "Half dozen". */
  name: string;
};

export const bulkTiers: BulkTier[] = [
  { minimumQuantity: 3, percentOff: 5, name: "3 or more" },
  { minimumQuantity: 6, percentOff: 10, name: "Half dozen" },
  { minimumQuantity: 12, percentOff: 15, name: "Dozen" },
];

/** Set `NEXT_PUBLIC_BULK_DISCOUNTS=off` before the matching Shopify discounts exist. */
export const bulkPricingEnabled = process.env.NEXT_PUBLIC_BULK_DISCOUNTS !== "off";

/** Quick quantity choices offered on a product page, by product-type category. */
const presetsByCategory: Record<string, number[]> = {
  glassware: [1, 6, 12],
  tumblers: [1, 6, 12],
  drinkware: [1, 6, 12],
  hats: [1, 6, 12],
  stickers: [1, 6, 12],
};

const defaultPresets = [1, 3, 6, 12];

export function getQuantityPresets(category?: string): number[] {
  return (category ? presetsByCategory[category] : undefined) ?? defaultPresets;
}

export function quantityPresetLabel(quantity: number): string {
  if (quantity === 1) return "Single";
  if (quantity === 6) return "Half dozen";
  if (quantity === 12) return "Dozen";
  return `${quantity}-pack`;
}

/** The best tier a quantity qualifies for, or `undefined` below the first one. */
export function getBulkTier(quantity: number): BulkTier | undefined {
  if (!bulkPricingEnabled) return undefined;
  return bulkTiers.reduce<BulkTier | undefined>(
    (best, tier) => (quantity >= tier.minimumQuantity ? tier : best),
    undefined,
  );
}

/** The next tier up, used to tell a customer how close they are to it. */
export function getNextBulkTier(quantity: number): BulkTier | undefined {
  if (!bulkPricingEnabled) return undefined;
  return bulkTiers.find((tier) => quantity < tier.minimumQuantity);
}

export function getBulkDiscountCents(subtotalCents: number, quantity: number): number {
  const tier = getBulkTier(quantity);
  if (!tier || subtotalCents <= 0) return 0;
  return Math.round((subtotalCents * tier.percentOff) / 100);
}

/**
 * Only needed by stores that use discount *codes* rather than Shopify's
 * automatic discounts. Format: `3:CODE3,6:CODE6,12:CODE12`.
 */
function parseDiscountCodes(raw: string | undefined) {
  const codes = new Map<number, string>();
  for (const entry of raw?.split(",") ?? []) {
    const [quantity, code] = entry.split(":").map((part) => part.trim());
    // A malformed pair is skipped rather than sent to Shopify, where an
    // unrecognised code surfaces as an error on the customer's checkout.
    if (!/^\d+$/.test(quantity ?? "") || !/^[A-Za-z0-9_-]+$/.test(code ?? "")) continue;
    codes.set(Number(quantity), code);
  }
  return codes;
}

const discountCodes = parseDiscountCodes(process.env.NEXT_PUBLIC_SHOPIFY_BULK_DISCOUNT_CODES);

export function getBulkDiscountCode(quantity: number): string | undefined {
  const tier = getBulkTier(quantity);
  return tier ? discountCodes.get(tier.minimumQuantity) : undefined;
}
