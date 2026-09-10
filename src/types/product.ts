export type ProductCategory = string;

export type ProductCollection = string;

export type CollectionCategorySlug = `${string}-collection`;
export type ShopCategorySlug = string;

export type ShopCategory = {
  slug: ShopCategorySlug;
  label: string;
  description: string;
  kind: "product-type" | "collection";
  value: string;
};

export type ProductImageRole = "main" | "hover" | "gallery";

export type ProductImage = {
  id: string;
  src: string;
  alt: string;
  role: ProductImageRole;
  colors?: string[];
};

export type ShopTile = {
  id: string;
  name: string;
  href: string;
  comingSoon?: boolean;
  image?: { src: string; alt: string };
};

export type ShopSettings = {
  featuredLabel: string;
  featuredCategory?: ShopCategory;
  featuredProductOrder: string[];
  productTiles: ShopTile[];
  collectionTiles: ShopTile[];
};

export type ProductVariant = {
  id: string;
  cartUrl?: string;
  size?: string;
  color?: string;
  colorCode?: string;
  priceCents?: number;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  categoryLabel: string;
  collection: ProductCollection;
  collectionLabel: string;
  collections: ProductCollection[];
  // Printful does not guarantee this field for every catalog item. When it is
  // present, it is deliberately kept with the synchronized product rather
  // than maintained as a storefront-only list.
  brand?: string;
  priceCents: number | null;
  currency: "USD";
  externalLink?: string;
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  featured: boolean;
  available: boolean;
};
