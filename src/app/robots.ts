import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The embedded Sanity Studio and the cart are per-visitor, not content.
      disallow: ["/studio", "/studio/", "/cart", "/api/", "/catalog-list"],
    },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
