import type { ProductImage } from "@/types/product";

export function mergeSynchronizedProductImages(
  printfulImages: ProductImage[],
  shopifyImages: ProductImage[],
): ProductImage[] {
  const seenSources = new Set(printfulImages.map((image) => image.src));

  return [
    ...printfulImages,
    ...shopifyImages.filter((image) => {
      // Shopify's primary image mirrors Printful's first mockup, but the two
      // services publish it at different URLs. Keep Printful's color-scoped
      // primary and only append genuinely supplemental Shopify gallery shots.
      if (image.role === "main" || seenSources.has(image.src)) return false;
      seenSources.add(image.src);
      return true;
    }),
  ];
}
