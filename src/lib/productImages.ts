import type { ProductImage } from "@/types/product";

export function mergeSynchronizedProductImages(
  printfulImages: ProductImage[],
  shopifyImages: ProductImage[],
): ProductImage[] {
  const seenSources = new Set(printfulImages.map((image) => image.src));

  const isShopifyFrontView = (image: ProductImage) => {
    try {
      return /(?:^|[-_/])front(?:[-_./]|$)/i.test(decodeURIComponent(new URL(image.src).pathname));
    } catch {
      return /(?:^|[-_/])front(?:[-_./]|$)/i.test(decodeURIComponent(image.src));
    }
  };

  return [
    ...printfulImages,
    ...shopifyImages.filter((image) => {
      // Printful supplies the color-scoped front preview. Shopify can publish
      // that same front view more than once and mark later copies as gallery
      // images, so role alone is not enough to identify the duplicate.
      if (image.role === "main" || isShopifyFrontView(image) || seenSources.has(image.src)) return false;
      seenSources.add(image.src);
      return true;
    }),
  ];
}
