import "server-only";

import { collectionTileLabel } from "@/lib/shopLabels";
import type { Product, ProductImage, ProductVariant, ShopCategory } from "@/types/product";

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html?: string | null;
  product_type?: string;
  tags?: string;
  images?: Array<{ id: number; src: string; alt?: string | null; variant_ids?: number[] }>;
  variants?: Array<{
    id: number;
    title?: string;
    price?: string;
    available?: boolean;
    option1?: string | null;
    option2?: string | null;
    option3?: string | null;
    featured_image?: { id?: number | null } | null;
  }>;
  options?: Array<{ name?: string; values?: string[] }>;
};

type ShopifyProductsResponse = { products?: ShopifyProduct[] };

const SHOPIFY_TIMEOUT_MS = 12000;
const knownSizes = new Set(["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "YXS", "YS", "YM", "YL", "YXL", "ONE SIZE"]);

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

export function getShopifyCartUrl(productId: string, variantId: string): string | undefined {
  const origin = getShopifyOrigin();
  if (!origin || !/^\d+$/.test(productId) || !/^\d+$/.test(variantId)) return undefined;
  return `${origin}/cart/add?id=${variantId}&quantity=1`;
}

export function applyLaunchAvailability(product: Product): Product {
  return product;
}

function cleanText(value?: string | null) {
  return value?.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim() ?? "";
}

function classifyProduct(product: ShopifyProduct, categories: ShopCategory[]) {
  const productTypes = categories.filter((category) => category.kind === "product-type");
  const haystack = `${product.product_type ?? ""} ${product.tags ?? ""} ${product.title}`.toLowerCase();
  const rules: Array<[string, RegExp]> = [
    ["hats", /\b(cap|hat|beanie)\b/],
    ["crewnecks", /\b(crewneck|sweatshirt)\b/],
    ["hoodies", /\bhoodie\b/],
    ["quarter-zips", /\b(quarter.?zip|1\/4 zip)\b/],
    ["towels", /\btowel\b/],
    ["drinkware", /\b(glass|tumbler|mug|bottle|cup)\b/],
    ["beach-boat-accessories", /\b(tote|bag|beach|boat)\b/],
    ["stickers", /\b(sticker|decal|notecard)\b/],
    ["t-shirts", /\b(tee|t-shirt|tshirt|polo)\b/],
  ];
  const match = rules.find(([, pattern]) => pattern.test(haystack))?.[0] ?? "t-shirts";
  return productTypes.find((category) => category.value === match) ?? productTypes[0];
}

function variantOptions(product: ShopifyProduct, variant: NonNullable<ShopifyProduct["variants"]>[number]) {
  const values = [variant.option1, variant.option2, variant.option3].map((value) => value?.trim()).filter((value): value is string => Boolean(value && value !== "Default Title"));
  const options = product.options ?? [];
  const colorIndex = options.findIndex((option) => /colou?r/i.test(option.name ?? ""));
  const sizeIndex = options.findIndex((option) => /size/i.test(option.name ?? ""));
  const size = sizeIndex >= 0 ? values[sizeIndex] : values.find((value) => knownSizes.has(value.toUpperCase()));
  const color = colorIndex >= 0 ? values[colorIndex] : values.find((value) => value !== size);
  return { size, color };
}

function mapShopifyProduct(product: ShopifyProduct, categories: ShopCategory[]): Product | null {
  const productType = classifyProduct(product, categories);
  const collection = categories.find((category) => category.kind === "collection" && category.value === "nyes-neck") ?? categories.find((category) => category.kind === "collection");
  if (!productType || !collection || !product.handle) return null;

  const variants: ProductVariant[] = (product.variants ?? []).map((variant) => {
    const { size, color } = variantOptions(product, variant);
    const price = Number.parseFloat(variant.price ?? "");
    return {
      id: String(variant.id),
      cartUrl: getShopifyCartUrl(String(product.id), String(variant.id)),
      size,
      color,
      priceCents: Number.isFinite(price) ? Math.round(price * 100) : undefined,
      available: Boolean(variant.available),
    };
  });
  const colorByVariantId = new Map(variants.map((variant) => [Number(variant.id), variant.color]));
  const colorsByFeaturedImageId = new Map<number, string[]>();
  (product.variants ?? []).forEach((variant, index) => {
    const imageId = variant.featured_image?.id;
    const color = variants[index]?.color;
    if (!imageId || !color) return;
    colorsByFeaturedImageId.set(imageId, [...(colorsByFeaturedImageId.get(imageId) ?? []), color]);
  });
  const images: ProductImage[] = (product.images ?? []).map((image, index) => {
    const matchingColors = new Set([
      ...(image.variant_ids ?? []).map((id) => colorByVariantId.get(id)).filter((color): color is string => Boolean(color)),
      ...(colorsByFeaturedImageId.get(image.id) ?? []),
    ]);
    return {
      id: String(image.id),
      src: image.src,
      alt: image.alt?.trim() || product.title,
      role: index === 0 ? "main" : "gallery",
      colors: [...matchingColors],
    };
  });
  if (!images.length) return null;
  const prices = variants.map((variant) => variant.priceCents).filter((price): price is number => price !== undefined);

  return {
    id: String(product.id),
    slug: product.handle,
    name: product.title,
    shortDescription: cleanText(product.body_html).slice(0, 150) || `${collectionTileLabel(collection.label)} ${productType.label.toLowerCase()}.`,
    description: cleanText(product.body_html) || `A NYES NECK ${productType.label.toLowerCase()} from the ${collectionTileLabel(collection.label)} collection.`,
    category: productType.value,
    categoryLabel: productType.label,
    collection: collection.value,
    collectionLabel: collectionTileLabel(collection.label),
    collections: [collection.value],
    priceCents: prices.length ? Math.min(...prices) : null,
    currency: "USD",
    images,
    sizes: Array.from(new Set(variants.map((variant) => variant.size).filter((size): size is string => Boolean(size)))),
    colors: Array.from(new Set(variants.map((variant) => variant.color).filter((color): color is string => Boolean(color)))),
    variants,
    featured: true,
    available: variants.some((variant) => variant.available),
  };
}

export async function fetchShopifyProducts(categories: ShopCategory[]): Promise<Product[] | null> {
  const origin = getShopifyOrigin();
  if (!origin) return null;
  try {
    const response = await fetch(`${origin}/products.json?limit=250`, {
      redirect: "follow",
      signal: AbortSignal.timeout(SHOPIFY_TIMEOUT_MS),
      next: { revalidate: 300, tags: ["shopify-products"] },
    });
    if (!response.ok) throw new Error(`Shopify catalog request failed: ${response.status}`);
    const payload = await response.json() as ShopifyProductsResponse;
    const products = (payload.products ?? []).map((product) => mapShopifyProduct(product, categories)).filter((product): product is Product => Boolean(product));
    return products.length ? products : null;
  } catch (error) {
    console.error("Could not fetch Shopify products:", error);
    return null;
  }
}
