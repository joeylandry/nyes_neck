import type { Product } from "@/types/product";

// Only this product is included in the initial store launch.
export const RETRO_CREWNECK_ID = "printful-463171219";

export function getShopifyOrigin(): string | undefined {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) return undefined;
  try {
    const url = new URL(domain.includes("://") ? domain : `https://${domain}`);
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
      url.pathname !== "/" || url.search || url.hash || !url.hostname.endsWith(".myshopify.com")) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function getShopifyCheckoutUrl(productId: string, variantId: string): string | undefined {
  const origin = getShopifyOrigin();
  if (!origin || productId !== RETRO_CREWNECK_ID || !/^\d+$/.test(variantId)) return undefined;
  return `${origin}/cart/${variantId}:1`;
}

export function applyLaunchAvailability(product: Product): Product {
  const launched = product.id === RETRO_CREWNECK_ID;
  const variants = product.variants.map((variant) => {
    const checkoutUrl = launched ? variant.checkoutUrl : undefined;

    return {
      ...variant,
      // Shopify owns the sellable state at checkout. Printful's sync status can
      // lag behind a newly published Shopify variant, so do not hide the launch
      // product when its valid Shopify checkout link is already available.
      available: launched ? Boolean(checkoutUrl) : variant.available,
      checkoutUrl,
    };
  });

  return {
    ...product,
    externalLink: undefined,
    available: launched && variants.some((variant) => variant.available),
    variants,
  };
}
