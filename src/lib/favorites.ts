import { FAVORITE_PRODUCT_IDS } from "@/data/favoritePicks";
import type { Product } from "@/types/product";

/**
 * The products shown under "Our Favorites" on the homepage and at the top of
 * the main collection. Hand-picked IDs in src/data/favoritePicks.ts win; with
 * none listed, products are matched by name, type and brand by the rules
 * below. Rules run in order and a product is only used once.
 */
type FavoriteGroupLabel = "T-shirts" | "Sweatshirts" | "Hats" | "Beach towels" | "Wine glasses" | "Top brands";
type FavoriteRule = { group: FavoriteGroupLabel; test: (text: string) => boolean };

const isTee = /\bt-?shirts?\b|\btees?\b/;
const isSweatshirt = /\bsweatshirts?\b|\bcrewnecks?\b|\bhoodies?\b|\bpullovers?\b/;
const isHat = /\bhats?\b|\bcaps?\b|\btrucker\b|\bsnapbacks?\b|\bbeanies?\b|\bvisors?\b|\bheadwear\b/;
const isRetro = /\bretro\b|\bvintage\b/;
const isComfortColors = /comfort colors/;

/** Brands we are proud to carry; their pieces earn a spot after the staples. */
export const FAVORITE_BRANDS = [
  "Comfort Colors",
  "Columbia",
  "Under Armour",
  "Patagonia",
  "The North Face",
  "Carhartt",
  "Champion",
  "Nike",
  "Adidas",
  "Richardson",
];

const favoriteRules: FavoriteRule[] = [
  { group: "T-shirts", test: (text) => isTee.test(text) && /\bspirit\b/.test(text) },
  { group: "T-shirts", test: (text) => isTee.test(text) && isRetro.test(text) && isComfortColors.test(text) },
  { group: "T-shirts", test: (text) => isTee.test(text) && isComfortColors.test(text) },
  { group: "T-shirts", test: (text) => isTee.test(text) && isRetro.test(text) },
  { group: "Sweatshirts", test: (text) => isSweatshirt.test(text) && /\bembroider/.test(text) },
  { group: "Sweatshirts", test: (text) => isSweatshirt.test(text) && isRetro.test(text) },
  { group: "Hats", test: (text) => isHat.test(text) && isRetro.test(text) },
  { group: "Hats", test: (text) => isHat.test(text) && /\bclassic\b/.test(text) },
  { group: "Beach towels", test: (text) => /\btowels?\b/.test(text) && /\b(?:classic|beach)\b/.test(text) },
  { group: "Wine glasses", test: (text) => /\bwine\b/.test(text) && /\bglass(?:es)?\b/.test(text) },
  ...FAVORITE_BRANDS.map((brand): FavoriteRule => ({ group: "Top brands", test: (text) => text.includes(brand.toLowerCase()) })),
];

/** Caps keep one style (say, ten Comfort Colors tees) from crowding out the rest. */
const MAX_FAVORITES_PER_RULE = 2;
const MAX_FAVORITES_PER_GROUP: Record<FavoriteGroupLabel, number> = {
  "T-shirts": 4,
  Sweatshirts: 3,
  Hats: 3,
  "Beach towels": 2,
  "Wine glasses": 2,
  "Top brands": 6,
};

function searchText(product: Product) {
  return `${product.name} ${product.categoryLabel} ${product.brand ?? ""} ${product.decoration ?? ""}`.toLowerCase();
}

/** The staple group a product belongs to, so brand picks respect the same caps. */
function stapleGroup(text: string): FavoriteGroupLabel | undefined {
  if (isTee.test(text)) return "T-shirts";
  if (isSweatshirt.test(text)) return "Sweatshirts";
  if (isHat.test(text)) return "Hats";
  return undefined;
}

export function getFavoriteProducts(products: Product[], pickedIds: string[] = FAVORITE_PRODUCT_IDS): Product[] {
  if (pickedIds.length) {
    const byId = new Map(products.flatMap((product) => [[product.id, product], ...(product.externalId ? [[product.externalId, product] as const] : [])]));
    const picked = pickedIds.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
    if (picked.length) return [...new Set(picked)];
  }
  const used = new Set<string>();
  const counts = new Map<FavoriteGroupLabel, number>();
  const favorites: Product[] = [];
  for (const rule of favoriteRules) {
    let taken = 0;
    for (const product of products) {
      if ((counts.get(rule.group) ?? 0) >= MAX_FAVORITES_PER_GROUP[rule.group] || taken >= MAX_FAVORITES_PER_RULE) break;
      const text = searchText(product);
      if (used.has(product.id) || !rule.test(text)) continue;
      const staple = rule.group === "Top brands" ? stapleGroup(text) : undefined;
      if (staple && (counts.get(staple) ?? 0) >= MAX_FAVORITES_PER_GROUP[staple]) continue;
      used.add(product.id);
      favorites.push(product);
      counts.set(rule.group, (counts.get(rule.group) ?? 0) + 1);
      if (staple) counts.set(staple, (counts.get(staple) ?? 0) + 1);
      taken += 1;
    }
  }
  return favorites;
}

/** "Retro" or "Classic" when the product name says so, for the catalog list. */
export function productStyle(product: Pick<Product, "name">): "Retro" | "Classic" | undefined {
  if (isRetro.test(product.name.toLowerCase())) return "Retro";
  if (/\bclassic\b/i.test(product.name)) return "Classic";
  return undefined;
}
