import type { Product, ProductImage } from "@/types/product";

export function getProductDefaultColor(product: Pick<Product, "colors" | "images" | "variants">) {
  const primaryImage = product.images.find((image) => image.role === "main") ?? product.images[0];
  const primaryColor = primaryImage?.colors?.find((color) => product.colors.includes(color));
  if (primaryColor && (!product.variants.length || product.variants.some((variant) => variant.color === primaryColor && variant.available))) {
    return primaryColor;
  }

  return product.variants.find((variant) => variant.available && variant.color)?.color ?? primaryColor ?? product.colors[0] ?? "";
}

export function mergeSynchronizedProductImages(
  printfulImages: ProductImage[],
  shopifyImages: ProductImage[],
): ProductImage[] {
  const shopifyMain = shopifyImages.find((image) => image.role === "main");
  const seenSources = new Set<string>();

  const isShopifyFrontView = (image: ProductImage) => {
    try {
      return /(?:^|[-_/])front(?:[-_./]|$)/i.test(decodeURIComponent(new URL(image.src).pathname));
    } catch {
      return /(?:^|[-_/])front(?:[-_./]|$)/i.test(decodeURIComponent(image.src));
    }
  };

  const merged: ProductImage[] = [];
  const addImage = (image: ProductImage) => {
    if (seenSources.has(image.src)) return;
    seenSources.add(image.src);
    merged.push(image);
  };

  if (shopifyMain) addImage(shopifyMain);

  let skippedMatchingPrintfulFront = false;
  for (const image of printfulImages) {
    const matchesPrimaryColor = Boolean(shopifyMain?.colors?.some((color) => image.colors?.includes(color)));
    if (shopifyMain && isShopifyFrontView(shopifyMain) && matchesPrimaryColor && !skippedMatchingPrintfulFront) {
      skippedMatchingPrintfulFront = true;
      continue;
    }
    addImage(image);
  }

  for (const image of shopifyImages) {
    if (image.id === shopifyMain?.id) continue;
    if (isShopifyFrontView(image)) continue;
    addImage(image);
  }

  return merged.map((image, index) => ({
    ...image,
    role: index === 0 ? "main" : "gallery",
  }));
}
