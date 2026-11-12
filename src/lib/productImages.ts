import { FAVORITE_START_COLORS } from "@/data/favoritePicks";
import { PERSON_PHOTO_FILES } from "@/data/personPhotos";
import type { Product, ProductImage, ProductImageView } from "@/types/product";

const nonFrontViewTokens = new Set([
  "back", "left", "right", "side", "sleeve", "detail", "details", "zoomed", "zoom", "closeup", "close", "label", "inside", "bottom", "top",
]);
const viewTokens = new Set([...nonFrontViewTokens, "front"]);

export function imageFileName(source: string) {
  let path = source;
  try { path = new URL(source).pathname; } catch { /* treat as a plain path or file name */ }
  try { path = decodeURIComponent(path); } catch { /* keep the encoded path */ }
  return path.split("/").pop() ?? path;
}

/**
 * Printful mockup file names end with the view they show, for example
 * `unisex-hoodie-navy-front-65f1.png`, `...-back-2-65f1.png` or
 * `mockup_Left_Front_Black.png`. Only the last view word counts so a product
 * name such as "Back Bay tee" does not mark every mockup as a back view.
 */
export function detectProductImageView(...sources: Array<string | undefined>): ProductImageView | undefined {
  for (const source of sources) {
    if (!source) continue;
    const tokens = imageFileName(source).toLowerCase().replace(/\.[a-z0-9]+$/, "").split(/[^a-z0-9]+/).filter(Boolean);
    const lastIndex = tokens.findLastIndex((token) => viewTokens.has(token));
    if (lastIndex < 0) continue;
    if (tokens[lastIndex] !== "front") return "other";
    return tokens[lastIndex - 1] === "left" || tokens[lastIndex - 1] === "right" ? "angled-front" : "front";
  }
  return undefined;
}

// Words that mark a lifestyle or on-model mockup. "men", "mens", "women" and
// "youth" are left out on purpose: they are part of many product names
// ("Classic Men's Columbia Jacket") and say nothing about the photo itself.
const personTokens = new Set(["model", "models", "onmodel", "lifestyle", "person", "people", "human", "wearing", "worn"]);
const personAltPattern = /\b(model|on-model|lifestyle|person|people|wearing|worn)\b/i;
const normalizeFileName = (name: string) => name.trim().toLowerCase().replace(/\?.*$/, "");
const flaggedPersonPhotos = new Set(PERSON_PHOTO_FILES.map((name) => normalizeFileName(imageFileName(name))).filter(Boolean));

/**
 * Whether a product photo shows a person rather than the product by itself:
 * either it is listed in src/data/personPhotos.ts, or its file name or alt
 * text says it is a lifestyle or on-model shot.
 */
export function isPersonPhoto(image: Pick<ProductImage, "src"> & Partial<Pick<ProductImage, "alt">>): boolean {
  const fileName = normalizeFileName(imageFileName(image.src));
  if (flaggedPersonPhotos.has(fileName)) return true;
  if (fileName.replace(/[^a-z0-9]+/g, " ").split(" ").some((token) => personTokens.has(token))) return true;
  return Boolean(image.alt && personAltPattern.test(image.alt));
}

const viewRank = (image: ProductImage) => {
  // Photos of people always come last so they never become the front image.
  if (isPersonPhoto(image)) return 4;
  const view = image.view ?? detectProductImageView(image.src);
  return view === "front" ? 0 : view === "angled-front" ? 1 : view === "other" ? 3 : 2;
};

/**
 * Puts each color's front mockup first so cards and product pages open on the
 * front of the garment, and moves photos of people to the end so the first
 * image always shows the product by itself. Images only move within the slots their own color
 * already occupies, so the published primary image keeps deciding which color
 * a product opens on.
 */
export function orderFrontViewsFirst(images: ProductImage[]): ProductImage[] {
  const colorKey = (image: ProductImage) => [...(image.colors ?? [])].sort().join("\u0000");
  const groups = new Map<string, ProductImage[]>();
  for (const image of images) {
    const key = colorKey(image);
    groups.set(key, [...(groups.get(key) ?? []), image]);
  }
  for (const group of groups.values()) {
    group.splice(0, group.length, ...group.map((image, index) => ({ image, index }))
      .sort((a, b) => viewRank(a.image) - viewRank(b.image) || a.index - b.index)
      .map(({ image }) => image));
  }
  const cursors = new Map<string, number>();
  return images.map((image, index) => {
    const key = colorKey(image);
    const cursor = cursors.get(key) ?? 0;
    cursors.set(key, cursor + 1);
    const ordered = groups.get(key)![cursor];
    const role = index === 0 ? "main" : ordered.role === "main" ? "gallery" : ordered.role;
    return ordered.role === role ? ordered : { ...ordered, role };
  });
}

export function getProductDefaultColor(product: Pick<Product, "colors" | "images" | "variants"> & Partial<Pick<Product, "id" | "externalId">>) {
  // A hand-picked cover color wins when it has a photo and can be bought.
  const chosen = (product.id && FAVORITE_START_COLORS[product.id]) || (product.externalId && FAVORITE_START_COLORS[product.externalId]);
  const cover = chosen ? product.colors.find((color) => color.toLowerCase() === chosen.trim().toLowerCase()) : undefined;
  if (cover && product.images.some((image) => image.colors?.includes(cover)) &&
    (!product.variants.length || product.variants.some((variant) => variant.color === cover && variant.available))) {
    return cover;
  }

  const primaryImage = product.images.find((image) => image.role === "main") ?? product.images[0];
  const primaryColor = primaryImage?.colors?.find((color) => product.colors.includes(color));
  const purchasable = (color: string) => !product.variants.length || product.variants.some((variant) => variant.color === color && variant.available);
  // Open on a color that has a photo of the product by itself, when there is one.
  const hasProductOnlyPhoto = (color: string) => product.images.some((image) => image.colors?.includes(color) && !isPersonPhoto(image));
  if (primaryColor && purchasable(primaryColor) && (hasProductOnlyPhoto(primaryColor) || !product.colors.some(hasProductOnlyPhoto))) {
    return primaryColor;
  }
  const productOnlyColor = product.colors.find((color) => hasProductOnlyPhoto(color) && purchasable(color));
  if (productOnlyColor) return productOnlyColor;
  if (primaryColor && purchasable(primaryColor)) return primaryColor;

  return product.variants.find((variant) => variant.available && variant.color)?.color ?? primaryColor ?? product.colors[0] ?? "";
}

export function mergeSynchronizedProductImages(
  printfulImages: ProductImage[],
  shopifyImages: ProductImage[],
): ProductImage[] {
  const shopifyMain = shopifyImages.find((image) => image.role === "main");
  const isFrontView = (image: ProductImage) => (image.view ?? detectProductImageView(image.src)) === "front";
  const frontColors = (images: ProductImage[]) => new Set(images.filter(isFrontView).flatMap((image) => image.colors ?? []));
  const printfulFrontColors = frontColors(printfulImages);
  const shopifyFrontColors = frontColors(shopifyImages);
  const printfulColors = new Set(printfulImages.flatMap((image) => image.colors ?? []));

  // Shopify holds the same Printful mockups under descriptive file names
  // (`...-front-...`), while Printful's own previews often have no view in
  // their name. When only Shopify can say which mockup is the front (common
  // for drinkware, whose default preview is often a side angle), use
  // Shopify's images for that color so the centered front is never lost.
  const preferShopify = (image: ProductImage) => Boolean(image.colors?.length) &&
    image.colors!.every((color) => shopifyFrontColors.has(color) && !printfulFrontColors.has(color));

  const seenSources = new Set<string>();
  const merged: ProductImage[] = [];
  const addImage = (image: ProductImage) => {
    if (seenSources.has(image.src)) return;
    seenSources.add(image.src);
    merged.push(image);
  };

  if (shopifyMain) addImage(shopifyMain);

  let skippedMatchingPrintfulFront = false;
  for (const image of printfulImages) {
    if (preferShopify(image)) continue;
    const matchesPrimaryColor = Boolean(shopifyMain?.colors?.some((color) => image.colors?.includes(color)));
    // Shopify's primary front and Printful's front for that color are the same
    // mockup, unless Shopify's shows a person: then Printful's is a different
    // photo, and the one to open on.
    if (shopifyMain && isFrontView(shopifyMain) && !isPersonPhoto(shopifyMain) && matchesPrimaryColor && !skippedMatchingPrintfulFront && isFrontView(image)) {
      skippedMatchingPrintfulFront = true;
      continue;
    }
    addImage(image);
  }

  for (const image of shopifyImages) {
    if (image.id === shopifyMain?.id) continue;
    // Drop Shopify's front only when Printful already supplies that color's
    // images and they are kept; otherwise it is the only front for the color.
    const coveredByPrintful = image.colors?.length
      ? image.colors.some((color) => printfulColors.has(color)) && !preferShopify(image)
      : printfulImages.length > 0;
    if (isFrontView(image) && coveredByPrintful) continue;
    addImage(image);
  }

  return orderFrontViewsFirst(merged).map((image, index) => ({
    ...image,
    role: index === 0 ? "main" : "gallery",
  }));
}
