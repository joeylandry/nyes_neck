import type { Product, ProductCategory, ShopCategory } from "@/types/product";
import { collectionTileLabel } from "@/lib/shopLabels";

const image = (name: string) => [
  { id: `${name}-main`, src: "/images/products/product-placeholder.svg", alt: `${name} product placeholder`, role: "main" as const },
];

const variants = (id: string, sizes: string[], colors: string[]) =>
  (sizes.length ? sizes : [undefined]).flatMap((size) =>
    (colors.length ? colors : [undefined]).map((color, index) => ({
      id: `${id}-v${index + 1}-${size ?? "one"}`.toLowerCase(),
      size,
      color,
      available: false,
    })),
  );

type ProductSeed = Omit<Product, "currency" | "images" | "variants" | "available" | "priceCents" | "categoryLabel" | "collectionLabel" | "collections">;

function getCollectionLabel(collection: string) {
  const label = collectionCategories.find((category) => category.value === collection)?.label ?? collection;
  return collectionTileLabel(label);
}

function product(seed: ProductSeed): Product {
  return {
    ...seed,
    currency: "USD",
    categoryLabel: categoryLabels[seed.category],
    collectionLabel: getCollectionLabel(seed.collection),
    collections: [seed.collection],
    priceCents: null,
    images: image(seed.name),
    variants: variants(seed.id, seed.sizes, seed.colors),
    available: false,
  };
}

export const categoryLabels: Record<ProductCategory, string> = {
  "t-shirts": "T-shirts",
  hoodies: "Hoodies",
  crewnecks: "Crewnecks",
  "quarter-zips": "Quarter-zips",
  hats: "Hats",
  towels: "Towels",
  stickers: "Stickers",
  drinkware: "Drinkware",
  "beach-boat-accessories": "Beach & boat accessories",
};

export const productTypeCategories: ShopCategory[] = Object.entries(categoryLabels).map(([slug, label]) => ({
  slug: slug as ProductCategory,
  label,
  description: `Explore NYES NECK ${label.toLowerCase()}.`,
  kind: "product-type",
  value: slug as ProductCategory,
}));

export const collectionCategories: ShopCategory[] = [
  {
    slug: "nyes-neck-collection",
    label: "Nyes Neck Collection",
    description: "The complete collection of NYES NECK apparel and coastal goods.",
    kind: "collection",
    value: "nyes-neck",
  },
  {
    slug: "new-silver-collection",
    label: "New Silver Collection",
    description: "Easy coastal pieces inspired by New Silver Beach.",
    kind: "collection",
    value: "new-silver",
  },
  {
    slug: "megansett-collection",
    label: "Megansett Collection",
    description: "Polished coastal essentials inspired by Megansett Harbor.",
    kind: "collection",
    value: "megansett",
  },
  {
    slug: "wild-harbor-collection",
    label: "Wild Harbor Collection",
    description: "Relaxed goods influenced by the quiet shoreline of Wild Harbor.",
    kind: "collection",
    value: "wild-harbor",
  },
  {
    slug: "chapoquoit-collection",
    label: "Chapoquoit Collection",
    description: "Coastal staples inspired by Chapoquoit Beach and West Falmouth.",
    kind: "collection",
    value: "chapoquoit",
  },
  {
    slug: "patuisset-collection",
    label: "Patuisset Collection",
    description: "Relaxed coastal pieces inspired by the shores of Patuisset.",
    kind: "collection",
    value: "patuisset",
  },
  {
    slug: "cape-collection",
    label: "Cape Collection",
    description: "Everyday Cape Cod apparel and goods with an understated coastal point of view.",
    kind: "collection",
    value: "cape",
  },
  {
    slug: "seascape-collection",
    label: "Seascape Collection",
    description: "Coastal layers and goods shaped by sea, sand, and open water.",
    kind: "collection",
    value: "seascape",
  },
  {
    slug: "old-silver-collection",
    label: "Old Silver Collection",
    description: "Relaxed pieces inspired by long days at Old Silver Beach.",
    kind: "collection",
    value: "old-silver",
  },
];

export const shopCategories: ShopCategory[] = [...productTypeCategories, ...collectionCategories];

export const products: Product[] = [
  product({
    id: "prod-classic-tee",
    slug: "nyes-neck-classic-tee",
    name: "Nyes Neck Classic Tee",
    shortDescription: "An everyday tee with an understated coastal point of view.",
    description: "A considered everyday layer designed around soft structure, lasting comfort, and a restrained NYES NECK identity.",
    category: "t-shirts",
    collection: "nyes-neck",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Warm white", "Coastal navy"],
    featured: true,
  }),
  product({
    id: "prod-upper-cape-hoodie",
    slug: "upper-cape-hoodie",
    name: "Upper Cape Hoodie",
    shortDescription: "A substantial layer for cool mornings and late beach days.",
    description: "A premium-weight hoodie inspired by shifting Upper Cape weather and easy year-round layering.",
    category: "hoodies",
    collection: "seascape",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Weathered sand", "Coastal navy"],
    featured: true,
  }),
  product({
    id: "prod-old-silver-crewneck",
    slug: "old-silver-crewneck",
    name: "Old Silver Crewneck",
    shortDescription: "Clean, comfortable, and made for the shoulder seasons.",
    description: "A refined crewneck that pairs a familiar silhouette with quiet coastal color and an easy, enduring fit.",
    category: "crewnecks",
    collection: "old-silver",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dune", "Atlantic blue"],
    featured: true,
  }),
  product({
    id: "prod-megansett-quarter-zip",
    slug: "megansett-quarter-zip",
    name: "Megansett Quarter-Zip",
    shortDescription: "A polished coastal layer with practical warmth.",
    description: "A versatile quarter-zip designed to move easily from a cool shoreline morning to the rest of the day.",
    category: "quarter-zips",
    collection: "megansett",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Coastal navy", "Sea glass"],
    featured: false,
  }),
  product({
    id: "prod-nyes-neck-cap",
    slug: "nyes-neck-cap",
    name: "Nyes Neck Cap",
    shortDescription: "A low-profile cap with a clean, unhurried character.",
    description: "A classic adjustable cap with simple proportions and subtle branding for everyday wear.",
    category: "hats",
    collection: "nyes-neck",
    sizes: [],
    colors: ["Coastal navy", "Natural"],
    featured: true,
  }),
  product({
    id: "prod-coastal-towel",
    slug: "coastal-towel",
    name: "Coastal Towel",
    shortDescription: "A generous beach towel in muted coastal tones.",
    description: "A substantial towel designed for long beach days, with a restrained palette drawn from the Upper Cape.",
    category: "towels",
    collection: "seascape",
    sizes: [],
    colors: ["Atlantic blue", "Dune"],
    featured: false,
  }),
  product({
    id: "prod-nyes-neck-decal",
    slug: "nyes-neck-decal",
    name: "Nyes Neck Decal",
    shortDescription: "A simple, durable NYES NECK mark.",
    description: "A weather-resistant decal with the NYES NECK wordmark in a clean monochrome treatment.",
    category: "stickers",
    collection: "nyes-neck",
    sizes: [],
    colors: ["White", "Black"],
    featured: false,
  }),
  product({
    id: "prod-harbor-tumbler",
    slug: "harbor-tumbler",
    name: "Harbor Tumbler",
    shortDescription: "A durable tumbler for days moving between shore and town.",
    description: "An insulated everyday vessel planned with a matte finish and minimal NYES NECK branding.",
    category: "drinkware",
    collection: "megansett",
    sizes: [],
    colors: ["Coastal navy", "Warm white"],
    featured: false,
  }),
  product({
    id: "prod-boat-day-tote",
    slug: "boat-day-tote",
    name: "Boat Day Tote",
    shortDescription: "A useful carryall with room for the day ahead.",
    description: "A sturdy, unfussy tote intended for beach layers, market stops, and everything that follows.",
    category: "beach-boat-accessories",
    collection: "seascape",
    sizes: [],
    colors: ["Natural canvas", "Coastal navy"],
    featured: false,
  }),
];
