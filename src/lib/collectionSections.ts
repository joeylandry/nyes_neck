import type { Product } from "@/types/product";

export type CollectionSection = { key: string; label: string; products: Product[] };

/**
 * Product types are grouped into families so the filter drawer, the quick
 * filters, and the grouped grid all present apparel before headwear,
 * drinkware, and everything else.
 */
export const typeFamilies = [
  { label: "Clothing", match: /shirt|hoodie|sweatshirt|crewneck|polo|quarter|jacket|vest|apron/i },
  { label: "Headwear", match: /hat|cap|beanie/i },
  { label: "Drinkware", match: /glass|tumbler|drinkware|mug|bottle|cup/i },
];

export const OTHER_FAMILY_LABEL = "Home & accessories";
export const UNGROUPED_SECTION_KEY = "more-from-collection";

/**
 * Below this many products the grid reads fine as one block, so headings would
 * add chrome without making anything easier to scan.
 */
export const GROUPING_THRESHOLD = 8;

export function familyRank(label: string) {
  const index = typeFamilies.findIndex(({ match }) => match.test(label));
  return index === -1 ? typeFamilies.length : index;
}

export function byFamilyThenLabel(a: string, b: string) {
  return familyRank(a) - familyRank(b) || a.localeCompare(b, undefined, { numeric: true });
}

/**
 * Splits a collection into one section per product type. Types holding a single
 * product are pooled into a trailing section so the page does not turn into a
 * run of one-item headings.
 */
export function groupByProductType(products: Product[]): CollectionSection[] {
  const byType = new Map<string, Product[]>();
  products.forEach((product) => {
    const label = product.categoryLabel?.trim() || OTHER_FAMILY_LABEL;
    const existing = byType.get(label);
    if (existing) existing.push(product);
    else byType.set(label, [product]);
  });

  const sections = [...byType.entries()]
    .map(([label, items]) => ({ key: label, label, products: items }))
    .sort((a, b) => familyRank(a.label) - familyRank(b.label) || b.products.length - a.products.length || a.label.localeCompare(b.label));
  const singles = sections.filter((section) => section.products.length === 1);
  if (singles.length < 2) return sections;

  return [
    ...sections.filter((section) => section.products.length > 1),
    { key: UNGROUPED_SECTION_KEY, label: "More from the collection", products: singles.flatMap((section) => section.products) },
  ];
}
