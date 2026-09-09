import "server-only";
import { getShopifyCartUrl } from "@/lib/commerce/shopify";

import { collectionTileLabel } from "@/lib/shopLabels";
import type { Product, ProductImage, ProductVariant, ShopCategory } from "@/types/product";

type PrintfulPaging = {
  total?: number;
  offset?: number;
  limit?: number;
};

type PrintfulSyncProductSummary = {
  id: number;
  external_id?: string;
  name: string;
  variants?: number;
  synced?: number;
  thumbnail_url?: string;
  is_ignored?: boolean;
};

type PrintfulSyncVariant = {
  id: number;
  external_id?: string;
  name?: string;
  sku?: string;
  retail_price?: string;
  currency?: string;
  synced?: boolean;
  size?: string;
  color?: string;
  availability_status?: string;
  variant_id?: number;
  product?: { product_id?: number; image?: string };
  files?: { type?: string; preview_url?: string; thumbnail_url?: string; status?: string }[];
  color_code?: string;

};

type PrintfulSyncProductDetail = {
  sync_product: PrintfulSyncProductSummary;
  sync_variants?: PrintfulSyncVariant[];
};

type PrintfulListResponse = {
  code: number;
  result?: PrintfulSyncProductSummary[];
  paging?: PrintfulPaging;
};

type PrintfulDetailResponse = {
  code: number;
  result?: PrintfulSyncProductDetail;
};

type PrintfulProductOverride = {
  category?: string;
  collection?: string;
  featured?: boolean;
  hidden?: boolean;
  slug?: string;
};

type PrintfulCatalogProduct = {
  product?: { description?: string };
  variants?: { id: number; color_code?: string }[];
};

const DEFAULT_REVALIDATE_SECONDS = 300;
const DEFAULT_COLLECTION = "nyes-neck";
const DEFAULT_PRODUCT_TYPE = "t-shirts";
const PRINTFUL_TIMEOUT_MS = 10000;

const productTypeRules: Array<{ category: string; patterns: RegExp[] }> = [
  { category: "t-shirts", patterns: [/\bt-?shirts?\b/i, /\btees?\b/i, /\bpolos?\b/i] },
  { category: "hoodies", patterns: [/\bhoodies?\b/i] },
  { category: "crewnecks", patterns: [/\bcrew\s*necks?\b/i, /\bsweatshirts?\b/i] },
  { category: "quarter-zips", patterns: [/\bquarter[-\s]?zips?\b/i, /\b1\/4[-\s]?zips?\b/i] },
  { category: "hats", patterns: [/\bhats?\b/i, /\bcaps?\b/i, /\bbeanies?\b/i] },
  { category: "towels", patterns: [/\btowels?\b/i] },
  { category: "stickers", patterns: [/\bstickers?\b/i, /\bdecals?\b/i] },
  { category: "drinkware", patterns: [/\bdrinkware\b/i, /\btumblers?\b/i, /\bmugs?\b/i, /\bbottles?\b/i, /\bcups?\b/i] },
  { category: "beach-boat-accessories", patterns: [/\btotes?\b/i, /\bbags?\b/i, /\bpouches?\b/i, /\bbeach\b/i, /\bboat\b/i] },
];

const knownSizes = new Set([
  "2XS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "YXS",
  "YS",
  "YM",
  "YL",
  "YXL",
  "ONE SIZE",
]);

function getPrintfulToken() {
  return process.env.PRINTFUL_API_TOKEN ?? process.env.PRINTFUL_OAUTH_TOKEN;
}

function getRevalidateSeconds() {
  const value = Number(process.env.PRINTFUL_REVALIDATE_SECONDS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_REVALIDATE_SECONDS;
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseOverrides(): Record<string, PrintfulProductOverride> {
  const raw = process.env.PRINTFUL_PRODUCT_OVERRIDES;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, PrintfulProductOverride>;
  } catch (error) {
    console.error("Invalid PRINTFUL_PRODUCT_OVERRIDES JSON:", error);
    return {};
  }
}

function getOverride(product: PrintfulSyncProductSummary, overrides: Record<string, PrintfulProductOverride>) {
  return overrides[String(product.id)] ?? (product.external_id ? overrides[product.external_id] : undefined) ?? overrides[product.name];
}

function normalizeOption(value?: string) {
  return value?.trim().replace(/\s+/g, " ");
}

function parseVariantOptions(variant: PrintfulSyncVariant, productName: string) {
  const directSize = normalizeOption(variant.size);
  const directColor = normalizeOption(variant.color);
  if (directSize || directColor) return { size: directSize, color: directColor };

  const variantName = normalizeOption(variant.name);
  if (!variantName) return {};

  const withoutProductName = variantName
    .replace(productName, "")
    .replace(/^[-–—:|/\s]+/, "")
    .trim();

  const source = withoutProductName || variantName;
  const parts = source
    .split(/\s+(?:\/|\||-)\s+|\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return {};

  let size: string | undefined;
  let color: string | undefined;

  for (const part of parts) {
    const normalized = part.toUpperCase();
    if (!size && knownSizes.has(normalized)) {
      size = part;
      continue;
    }
    if (!color) color = part;
  }

  return { size, color };
}

function parsePriceCents(variants: PrintfulSyncVariant[]) {
  const prices = variants
    .map((variant) => Number.parseFloat(variant.retail_price ?? ""))
    .filter((price) => Number.isFinite(price) && price >= 0);

  if (!prices.length) return null;
  return Math.round(Math.min(...prices) * 100);
}

function isVariantAvailable(variant: PrintfulSyncVariant) {
  return variant.synced === true && variant.availability_status === "active";
}

function findProductTypeCategory(productName: string, override: PrintfulProductOverride | undefined, categories: ShopCategory[]) {
  const productTypes = categories.filter((category) => category.kind === "product-type");
  const requested = override?.category ?? process.env.PRINTFUL_DEFAULT_PRODUCT_TYPE_SLUG;
  const explicit = requested ? productTypes.find((category) => category.value === requested || category.slug === requested) : undefined;
  if (explicit) return explicit;

  const inferred = productTypeRules.find((rule) => rule.patterns.some((pattern) => pattern.test(productName)));
  const inferredCategory = inferred
    ? productTypes.find((category) => category.value === inferred.category || category.slug === inferred.category)
    : undefined;

  return inferredCategory ?? productTypes.find((category) => category.value === DEFAULT_PRODUCT_TYPE) ?? productTypes[0];
}

function findCollectionCategory(productName: string, override: PrintfulProductOverride | undefined, categories: ShopCategory[]) {
  const collections = categories.filter((category) => category.kind === "collection");
  const requested = override?.collection ?? process.env.PRINTFUL_DEFAULT_COLLECTION_SLUG;
  const explicit = requested ? collections.find((category) => category.value === requested || category.slug === requested) : undefined;
  if (explicit) return explicit;

  const loweredName = productName.toLowerCase();
  const inferred = collections.find((category) => {
    const label = collectionTileLabel(category.label).toLowerCase();
    return loweredName.includes(category.value.toLowerCase()) || loweredName.includes(label);
  });

  return inferred ?? collections.find((category) => category.value === DEFAULT_COLLECTION) ?? collections[0];
}

async function printfulFetch<T>(path: string, token: string): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (process.env.PRINTFUL_STORE_ID) {
    headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  }

  const response = await fetch(`https://api.printful.com${path}`, {
    headers,
    signal: AbortSignal.timeout(PRINTFUL_TIMEOUT_MS),
    next: { revalidate: getRevalidateSeconds(), tags: ["printful-products"] },
  });

  if (!response.ok) {
    throw new Error(`Printful request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function fetchSyncProductSummaries(token: string) {
  const products: PrintfulSyncProductSummary[] = [];
  const limit = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await printfulFetch<PrintfulListResponse>(`/sync/products?limit=${limit}&offset=${offset}`, token);
    const result = response.result ?? [];
    products.push(...result);

    total = response.paging?.total ?? products.length;
    offset += response.paging?.limit ?? limit;
  } while (offset < total);

  return products;
}

async function fetchSyncProductDetail(productId: number, token: string) {
  const response = await printfulFetch<PrintfulDetailResponse>(`/sync/products/${productId}`, token);
  return response.result ?? null;
}

function mapPrintfulProduct(
  detail: PrintfulSyncProductDetail,
  categories: ShopCategory[],
  override: PrintfulProductOverride | undefined,
  catalogDescriptions: Map<number, string>,
): Product | null {
  const syncProduct = detail.sync_product;
  if (syncProduct.is_ignored || override?.hidden) return null;

  const productType = findProductTypeCategory(syncProduct.name, override, categories);
  const collection = findCollectionCategory(syncProduct.name, override, categories);
  if (!productType || !collection) return null;

  const variants: ProductVariant[] = (detail.sync_variants ?? []).map((variant) => {
    const options = parseVariantOptions(variant, syncProduct.name);
    return {
      id: variant.external_id ?? `printful-${variant.id}`,
      cartUrl: variant.external_id ? getShopifyCartUrl(`printful-${syncProduct.id}`, variant.external_id) : undefined,
      size: options.size,
      color: options.color,
      colorCode: variant.color_code,
      priceCents: parsePriceCents([variant]) ?? undefined,
      available: isVariantAvailable(variant),
    };
  });

  const sizes = Array.from(new Set(variants.map((variant) => variant.size).filter((size): size is string => Boolean(size))));
  const colors = Array.from(new Set(variants.map((variant) => variant.color).filter((color): color is string => Boolean(color))));
  const images: ProductImage[] = [];
  const addImage = (src: string | undefined, color?: string) => {
    if (!src) return;
    // Identical fallback URLs must remain separate for each color. Otherwise a
    // generic image assigned to Black would also leak into every other color.
    if (images.some((image) => image.src === src && image.colors?.[0] === color)) return;
    images.push({ id: `printful-${syncProduct.id}-${images.length}`, src,
      alt: `${syncProduct.name}${color ? ` — ${color}` : ""}`,
      role: images.length ? "gallery" : "main", colors: color ? [color] : undefined });
  };
  const hasImageForColor = (color?: string) => images.some((image) => (
    color ? image.colors?.includes(color) : !image.colors?.length
  ));

  // Printful's preview files are the generated, branded product mockups. They
  // are deliberately scoped to the variant color so switching colors never
  // exposes another color's image.
  for (const variant of detail.sync_variants ?? []) {
    const { color } = parseVariantOptions(variant, syncProduct.name);
    const preview = variant.files?.find((file) => file.type === "preview" && file.preview_url)?.preview_url;
    addImage(preview, color);
  }

  // Keep a scoped catalog fallback only for colors that do not yet have a
  // branded Printful mockup. This preserves a usable product page while never
  // showing that fallback under a different color selection.
  for (const color of colors.length ? colors : [undefined]) {
    if (hasImageForColor(color)) continue;
    const colorVariant = (detail.sync_variants ?? []).find((variant) => parseVariantOptions(variant, syncProduct.name).color === color);
    addImage(colorVariant?.product?.image ?? syncProduct.thumbnail_url, color);
  }
  if (!images.length) addImage("/images/products/product-placeholder.svg");

  const catalogProductId = (detail.sync_variants ?? [])
    .map((variant) => variant.product?.product_id)
    .find((id): id is number => Boolean(id));
  const catalogDescription = catalogProductId ? catalogDescriptions.get(catalogProductId) : undefined;

  return {
    id: `printful-${syncProduct.id}`,
    slug: override?.slug ? makeSlug(override.slug) : makeSlug(`${syncProduct.name}-${syncProduct.id}`),
    name: syncProduct.name,
    shortDescription: `${collectionTileLabel(collection.label)} ${productType.label.toLowerCase()}.`,
    description: catalogDescription ?? `A NYES NECK ${productType.label.toLowerCase()} from the ${collectionTileLabel(collection.label)} collection.`,
    category: productType.value,
    categoryLabel: productType.label,
    collection: collection.value,
    collectionLabel: collectionTileLabel(collection.label),
    collections: [collection.value],
    priceCents: parsePriceCents(detail.sync_variants ?? []),
    currency: "USD",
    images,
    sizes,
    colors,
    variants,
    featured: override?.featured ?? false,
    available: variants.length ? variants.some((variant) => variant.available) : Boolean(syncProduct.synced),
  };
}

function ensureUniqueSlugs(products: Product[]) {
  const seen = new Map<string, number>();

  return products.map((product) => {
    const count = seen.get(product.slug) ?? 0;
    seen.set(product.slug, count + 1);
    if (count === 0) return product;

    return {
      ...product,
      slug: `${product.slug}-${count + 1}`,
    };
  });
}

export async function fetchPrintfulProducts(categories: ShopCategory[]): Promise<Product[] | null> {
  const token = getPrintfulToken();
  if (!token) return null;

  try {
    const overrides = parseOverrides();
    const summaries = await fetchSyncProductSummaries(token);
    const visibleSummaries = summaries.filter((product) => !product.is_ignored && !getOverride(product, overrides)?.hidden);
    const details = await Promise.all(visibleSummaries.map((product) => fetchSyncProductDetail(product.id, token)));
    const catalogIds = [...new Set(details.flatMap((detail) =>
      (detail?.sync_variants ?? []).flatMap((variant) => variant.product?.product_id ? [variant.product.product_id] : [])))];
    const catalog = new Map<number, { color_code?: string }>();
    const catalogDescriptions = new Map<number, string>();
    // One cached catalog request per garment style, rather than per size/color.
    for (const id of catalogIds) {
      try {
        const response = await printfulFetch<{ result?: PrintfulCatalogProduct }>(`/products/${id}`, token);
        for (const variant of response.result?.variants ?? []) catalog.set(variant.id, variant);
        const description = response.result?.product?.description?.trim();
        if (description) catalogDescriptions.set(id, description);
      } catch {
        console.error(`Could not load Printful color metadata for product ${id}`);
      }
    }
    for (const detail of details) {
      for (const variant of detail?.sync_variants ?? []) {
        variant.color_code = variant.variant_id ? catalog.get(variant.variant_id)?.color_code : undefined;
      }
    }
    const products = details
      .flatMap((detail) => {
        if (!detail) return [];
        const override = getOverride(detail.sync_product, overrides);
        const product = mapPrintfulProduct(detail, categories, override, catalogDescriptions);
        return product ? [product] : [];
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return ensureUniqueSlugs(products);
  } catch (error) {
    console.error("Could not fetch Printful products:", error);
    return null;
  }
}
