import { collectionCategories, productTypeCategories, products as localProducts, shopCategories as localShopCategories } from "@/data/products";
import { getSanityClient } from "@/sanity/client";
import { sanityImageUrl } from "@/sanity/image";
import type {
  Product,
  ProductCategory,
  ProductCollection,
  ProductImage,
  ProductImageRole,
  ShopCategory,
  ShopSettings,
  ShopTile,
} from "@/types/product";

type SanityImage = {
  _key?: string;
  role?: ProductImageRole;
  alt?: string;
  image?: { asset?: { _ref?: string }; crop?: unknown; hotspot?: unknown };
};

type SanityTaxonomy = {
  _id: string;
  _type: "productType" | "collection";
  title: string;
  slug: string;
  description: string;
  tileImage?: { asset?: { _ref?: string }; crop?: unknown; hotspot?: unknown };
  tileImageAlt?: string;
};

type SanityProduct = {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  price?: number;
  currency?: "USD";
  available?: boolean;
  externalLink?: string;
  featured?: boolean;
  images?: SanityImage[];
  productType?: { slug: string; title: string };
  collections?: { slug: string; title: string }[];
  sizes?: string[];
  colors?: string[];
  variants?: { _key?: string; sku?: string; size?: string; color?: string; available?: boolean }[];
};

type SanityShopSettings = {
  featuredLabel?: string;
  featuredCategory?: SanityTaxonomy;
};

const productQuery = `*[_type == "product" && defined(slug.current)] | order(title asc) {
  _id,
  "slug": slug.current,
  title,
  shortDescription,
  description,
  price,
  currency,
  available,
  externalLink,
  featured,
  images[]{_key, role, alt, image{asset, crop, hotspot}},
  "productType": productType->{"slug": slug.current, title},
  "collections": collections[]->{"slug": slug.current, title},
  sizes,
  colors,
  variants[]{_key, sku, size, color, available}
}`;

const taxonomyQuery = `*[_type in ["productType", "collection"] && defined(slug.current)] | order(title asc) {
  _id, _type, title, "slug": slug.current, description,
  tileImage{asset, crop, hotspot},
  tileImageAlt
}`;

const shopSettingsQuery = `*[_type == "shopSettings"][0] {
  featuredLabel,
  "featuredCategory": featuredCategory->{_id, _type, title, "slug": slug.current, description}
}`;

function mapProduct(record: SanityProduct): Product | null {
  if (!record.productType?.slug) return null;
  const collections = record.collections?.map((collection) => collection.slug).filter(Boolean) ?? [];
  const images: ProductImage[] = (record.images ?? []).flatMap((item, index) => {
    if (!item.image || !item.role) return [];
    const src = sanityImageUrl(item.image, 1200, 1500);
    if (!src) return [];
    return [{ id: item._key ?? `${record._id}-image-${index}`, src, alt: item.alt ?? record.title, role: item.role }];
  });
  const mainImage = images.find((image) => image.role === "main");
  if (!mainImage) return null;

  return {
    id: record._id,
    slug: record.slug,
    name: record.title,
    shortDescription: record.shortDescription,
    description: record.description,
    category: record.productType.slug,
    categoryLabel: record.productType.title,
    collection: collections[0] ?? "",
    collections,
    priceCents: typeof record.price === "number" ? Math.round(record.price * 100) : null,
    currency: record.currency ?? "USD",
    externalLink: record.externalLink,
    images,
    sizes: record.sizes ?? [],
    colors: record.colors ?? [],
    variants: (record.variants ?? []).map((variant, index) => ({
      id: variant.sku ?? variant._key ?? `${record._id}-variant-${index}`,
      size: variant.size,
      color: variant.color,
      available: Boolean(variant.available),
    })),
    featured: Boolean(record.featured),
    available: Boolean(record.available),
  };
}

function taxonomyToCategory(item: SanityTaxonomy): ShopCategory {
  if (item._type === "collection") {
    return {
      slug: `${item.slug}-collection`,
      label: item.title,
      description: item.description,
      kind: "collection",
      value: item.slug,
    };
  }
  return {
    slug: item.slug,
    label: item.title,
    description: item.description,
    kind: "product-type",
    value: item.slug,
  };
}

function taxonomyToTile(item: SanityTaxonomy): ShopTile {
  const category = taxonomyToCategory(item);
  const src = item.tileImage ? sanityImageUrl(item.tileImage, 1200, 900) : undefined;
  return {
    id: item._id,
    name: item.title,
    href: `/shop/category/${category.slug}`,
    image: src ? { src, alt: item.tileImageAlt ?? item.title } : undefined,
  };
}

function fallbackTiles(categories: ShopCategory[]): ShopTile[] {
  return categories.map((category) => ({
    id: category.slug,
    name: category.label,
    href: `/shop/category/${category.slug}`,
  }));
}

async function fetchSanityProducts(): Promise<Product[] | null> {
  const client = getSanityClient();
  if (!client) return null;
  const records = await client.fetch<SanityProduct[]>(productQuery, {}, { next: { revalidate: 60, tags: ["product"] } });
  if (!records.length) return null;
  return records.map(mapProduct).filter((product): product is Product => Boolean(product));
}

export async function getProducts(): Promise<Product[]> {
  return (await fetchSanityProducts()) ?? localProducts;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.featured);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.category === category);
}

export async function getProductsByCollection(collection: ProductCollection): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.collections.includes(collection));
}

export async function getShopCategories(): Promise<ShopCategory[]> {
  const client = getSanityClient();
  if (!client) return localShopCategories;
  const records = await client.fetch<SanityTaxonomy[]>(taxonomyQuery, {}, { next: { revalidate: 60, tags: ["productType", "collection"] } });
  return records.map(taxonomyToCategory);
}

export async function getShopSettings(): Promise<ShopSettings> {
  const client = getSanityClient();
  if (!client) {
    return {
      featuredLabel: "Featured",
      featuredCategory: localShopCategories.find((category) => category.slug === "nyes-neck-collection"),
      productTiles: fallbackTiles(productTypeCategories),
      collectionTiles: fallbackTiles(collectionCategories),
    };
  }
  const [settings, taxonomies] = await Promise.all([
    client.fetch<SanityShopSettings | null>(shopSettingsQuery, {}, { next: { revalidate: 60, tags: ["shopSettings"] } }),
    client.fetch<SanityTaxonomy[]>(taxonomyQuery, {}, { next: { revalidate: 60, tags: ["productType", "collection"] } }),
  ]);
  return {
    featuredLabel: settings?.featuredLabel ?? "Featured",
    featuredCategory: settings?.featuredCategory ? taxonomyToCategory(settings.featuredCategory) : undefined,
    productTiles: taxonomies.filter((item) => item._type === "productType").map(taxonomyToTile),
    collectionTiles: taxonomies.filter((item) => item._type === "collection").map(taxonomyToTile),
  };
}

export async function getFeaturedShopProducts(settings: ShopSettings): Promise<Product[]> {
  const category = settings.featuredCategory;
  if (!category) return getFeaturedProducts();
  return category.kind === "collection"
    ? getProductsByCollection(category.value)
    : getProductsByCategory(category.value);
}
