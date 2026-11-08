import type { Product } from "@/types/product";

/**
 * The staple products shown under "Our Favorites" on the homepage and as
 * "Our picks" at the top of the main collection. Products are matched by name,
 * type and brand, so a new Comfort Colors tee or retro hat is picked up
 * automatically. Rules run in order and a product is only used once.
 */
type FavoriteRule = { group: FavoriteGroupLabel; test: (text: string, product: Product) => boolean };

export type FavoriteGroupLabel = "T-shirts" | "Sweatshirts" | "Hats" | "Beach towels" | "Wine glasses";
export type FavoriteGroup = { label: FavoriteGroupLabel; products: Product[] };

const isTee = /\bt-?shirts?\b|\btees?\b/;
const isSweatshirt = /\bsweatshirts?\b|\bcrewnecks?\b|\bhoodies?\b|\bpullovers?\b/;
const isHat = /\bhats?\b|\bcaps?\b|\btrucker\b|\bdad hat\b/;

const favoriteRules: FavoriteRule[] = [
  { group: "T-shirts", test: (text) => isTee.test(text) && /\bspirit\b/.test(text) },
  { group: "T-shirts", test: (text) => isTee.test(text) && /comfort colors/.test(text) },
  { group: "Sweatshirts", test: (text) => isSweatshirt.test(text) && /\bembroider/.test(text) },
  { group: "Sweatshirts", test: (text) => isSweatshirt.test(text) && /\bretro\b/.test(text) },
  { group: "Hats", test: (text) => isHat.test(text) && /\b(?:classic|retro)\b/.test(text) },
  { group: "Beach towels", test: (text) => /\btowels?\b/.test(text) && /\b(?:classic|beach)\b/.test(text) },
  { group: "Wine glasses", test: (text) => /\bwine\b/.test(text) && /\bglass(?:es)?\b/.test(text) },
];

const groupOrder: FavoriteGroupLabel[] = ["T-shirts", "Sweatshirts", "Hats", "Beach towels", "Wine glasses"];

/** Caps keep one style (say, five Comfort Colors tees) from crowding out the rest. */
export const MAX_FAVORITES_PER_GROUP = 3;
const MAX_FAVORITES_PER_RULE = 2;

/** Past this many favorites, one long horizontal row gets hard to scan, so it splits by group. */
export const FAVORITES_SUBSECTION_THRESHOLD = 6;

function searchText(product: Product) {
  return `${product.name} ${product.categoryLabel} ${product.brand ?? ""}`.toLowerCase();
}

export function getFavoriteGroups(products: Product[]): FavoriteGroup[] {
  const used = new Set<string>();
  const byGroup = new Map<FavoriteGroupLabel, Product[]>();
  for (const rule of favoriteRules) {
    const group = byGroup.get(rule.group) ?? [];
    let taken = 0;
    for (const product of products) {
      if (group.length >= MAX_FAVORITES_PER_GROUP || taken >= MAX_FAVORITES_PER_RULE) break;
      if (used.has(product.id) || !rule.test(searchText(product), product)) continue;
      used.add(product.id);
      group.push(product);
      taken += 1;
    }
    byGroup.set(rule.group, group);
  }
  return groupOrder
    .map((label) => ({ label, products: byGroup.get(label) ?? [] }))
    .filter((group) => group.products.length);
}

export function getFavoriteProducts(products: Product[]): Product[] {
  return getFavoriteGroups(products).flatMap((group) => group.products);
}
