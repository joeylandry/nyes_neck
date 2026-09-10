import type { Product } from "@/types/product";

export function slugifyProductValue(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Product names can change and Printful/Shopify can spell symbols differently.
 * Appending the commerce ID gives both data sources the same durable route.
 */
export function makeProductSlug(name: string, externalId?: string, fallbackId?: string) {
  const id = externalId?.trim() || fallbackId?.trim();
  return slugifyProductValue(id ? `${name}-${id}` : name);
}

export function productMatchesSlug(product: Product, candidate: string) {
  if (product.slug === candidate || product.legacySlugs?.includes(candidate)) return true;
  let decodedCandidate = candidate;
  try { decodedCandidate = decodeURIComponent(candidate); } catch { /* compare the original value */ }
  const normalizedCandidate = slugifyProductValue(decodedCandidate);
  if (normalizedCandidate === slugifyProductValue(product.name)) return true;
  if (product.legacySlugs?.some((slug) => slugifyProductValue(slug) === normalizedCandidate)) return true;
  return Boolean(product.externalId && (candidate === product.externalId || candidate.endsWith(`-${product.externalId}`)));
}
