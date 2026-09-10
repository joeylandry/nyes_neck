import { slugifyProductValue } from "@/lib/productSlugs";
import type { ShopCategory } from "@/types/product";

const productTypeRules: Array<{ category: string; label: string; patterns: RegExp[] }> = [
  { category: "polos", label: "Polos", patterns: [/\bpolos?\b/i] },
  { category: "button-down-shirts", label: "Button-down shirts", patterns: [/\bbutton(?:-|\s)*(?:down|up)?\s*shirts?\b/i] },
  { category: "quarter-zips", label: "Quarter-zips", patterns: [/\bquarter[-\s]?zips?\b/i, /\b1\/4[-\s]?zips?\b/i] },
  { category: "sweatshirts", label: "Sweatshirts", patterns: [/\bsweatshirts?\b/i, /\bcrew\s*necks?\b/i] },
  { category: "hoodies", label: "Hoodies", patterns: [/\bhoodies?\b/i, /\bhooded\s+sweatshirts?\b/i] },
  { category: "t-shirts", label: "T-shirts", patterns: [/\bt-?shirts?\b/i, /\btees?\b/i] },
  { category: "shirts", label: "Shirts", patterns: [/\bshirts?\b/i] },
  { category: "jackets", label: "Jackets", patterns: [/\bjackets?\b/i, /\bpullovers?\b/i] },
  { category: "vests", label: "Vests", patterns: [/\bvests?\b/i] },
  { category: "hats", label: "Hats", patterns: [/\bhats?\b/i, /\bcaps?\b/i, /\bbeanies?\b/i, /\bbooney\b/i] },
  { category: "aprons", label: "Aprons", patterns: [/\baprons?\b/i] },
  { category: "glassware", label: "Glassware", patterns: [/\bwine\s+glass(?:es)?\b/i, /\bstemless\s+glass(?:es)?\b/i, /\bglassware\b/i] },
  { category: "tumblers", label: "Tumblers", patterns: [/\btumblers?\b/i] },
  { category: "drinkware", label: "Drinkware", patterns: [/\bdrinkware\b/i, /\bmugs?\b/i, /\bbottles?\b/i, /\bcups?\b/i] },
  { category: "towels", label: "Towels", patterns: [/\btowels?\b/i] },
  { category: "stickers", label: "Stickers", patterns: [/\bstickers?\b/i, /\bdecals?\b/i] },
  { category: "bags", label: "Bags", patterns: [/\btotes?\b/i, /\bbags?\b/i, /\bpouches?\b/i] },
];

const genericProductionTypes = /^(dtg|dtfilm|embroidery|all-over print|default)$/i;

function categoryFor(category: string, label: string, categories: ShopCategory[]): ShopCategory {
  return categories.find((item) => item.kind === "product-type" && (item.value === category || item.slug === category)) ?? {
    slug: category,
    label,
    description: `Explore NYES NECK ${label.toLowerCase()}.`,
    kind: "product-type",
    value: category,
  };
}

export function inferProductTypeCategory({
  categories,
  requested,
  preferredType,
  searchText,
}: {
  categories: ShopCategory[];
  requested?: string;
  preferredType?: string;
  searchText: string;
}): ShopCategory | undefined {
  const productTypes = categories.filter((category) => category.kind === "product-type");
  const explicit = requested ? productTypes.find((category) => category.value === requested || category.slug === requested) : undefined;
  if (explicit) return explicit;

  const source = `${preferredType ?? ""} ${searchText}`;
  const inferred = productTypeRules.find((rule) => rule.patterns.some((pattern) => pattern.test(source)));
  if (inferred) return categoryFor(inferred.category, inferred.label, categories);

  const supplied = preferredType?.trim();
  if (supplied && !genericProductionTypes.test(supplied)) {
    return categoryFor(slugifyProductValue(supplied), supplied, categories);
  }

  return categoryFor("other", "Other", categories);
}

// The synchronized Shopify payload exposes the storefront vendor, not always
// the blank-garment manufacturer. This compact list is only a fallback when
// Printful's authoritative catalog brand is temporarily unavailable.
const manufacturerFallbacks = [
  "Under Armour",
  "Comfort Colors",
  "Stanley/Stella",
  "Liberty Bags",
  "Otto Cap",
  "Columbia",
  "Adidas",
];

export function inferManufacturer(searchText: string, authoritative?: string) {
  if (authoritative?.trim()) return authoritative.trim();
  return manufacturerFallbacks.find((brand) => searchText.toLowerCase().includes(brand.toLowerCase()));
}
