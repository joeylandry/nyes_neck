import { getBulkDiscountCode } from "@/lib/bulkPricing";

export type CheckoutLine = {
  /** The stored `/cart/add?id=…` permalink captured when the item was added. */
  cartUrl: string;
  quantity: number;
};

/**
 * Turns the local cart into a Shopify cart permalink that lands on checkout.
 *
 * The site never holds cart state on Shopify's side, so the whole order is
 * handed over in the URL. A malformed or cross-store line is rejected outright
 * rather than sending a customer to a checkout missing part of their order.
 */
export function buildShopifyCheckoutUrl(lines: CheckoutLine[]): string | undefined {
  if (!lines.length) return undefined;

  try {
    const first = new URL(lines[0].cartUrl);
    const permalinkLines = lines.map((line) => {
      const url = new URL(line.cartUrl);
      if (url.origin !== first.origin) throw new Error("Cart items use different checkout hosts");
      const variantId = url.searchParams.get("id");
      if (!variantId || !/^\d+$/.test(variantId)) throw new Error("Invalid checkout variant");
      if (!Number.isInteger(line.quantity) || line.quantity < 1) throw new Error("Invalid checkout quantity");
      return `${variantId}:${line.quantity}`;
    });
    // Stores that price volume through a discount *code* need it on the
    // permalink. Stores using Shopify's automatic discounts leave the mapping
    // unset and Shopify applies the tier itself.
    const code = getBulkDiscountCode(lines.reduce((total, line) => total + line.quantity, 0));
    const discount = code ? `discount=${encodeURIComponent(code)}&` : "";
    return `${first.origin}/cart/${permalinkLines.join(",")}?${discount}checkout`;
  } catch {
    return undefined;
  }
}
