import type { MetadataRoute } from "next";
import { getProducts, getShopCategories } from "@/lib/products";
import { getSiteUrl } from "@/lib/siteUrl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  const url = (path: string) => new URL(path, origin).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/shop"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [categories, products] = await Promise.all([getShopCategories(), getProducts()]);
    return [
      ...staticRoutes,
      ...categories.map(({ slug }) => ({
        url: url(`/shop/category/${slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...products.map(({ slug }) => ({
        url: url(`/shop/${slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // A catalog outage should not take the whole sitemap down with it.
    return staticRoutes;
  }
}
