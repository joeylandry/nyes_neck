export type ProductCategory =
  | "t-shirts"
  | "hoodies"
  | "crewnecks"
  | "quarter-zips"
  | "hats"
  | "towels"
  | "stickers"
  | "drinkware"
  | "beach-boat-accessories";

export type ProductImage = { src: string; alt: string };

export type ProductVariant = {
  id: string;
  size?: string;
  color?: string;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  priceCents: number | null;
  currency: "USD";
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  featured: boolean;
  available: boolean;
};
