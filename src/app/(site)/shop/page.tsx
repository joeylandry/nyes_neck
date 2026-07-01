import type { Metadata } from "next";
import Link from "next/link";
import { ProductReel } from "@/components/shop/ProductReel";
import { ShopBrowseSections } from "@/components/shop/ShopBrowseSections";
import { PageHeader } from "@/components/ui/PageHeader";
import { getFeaturedShopProducts, getShopSettings } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop | NYES NECK",
  description: "Explore the first NYES NECK Upper Cape apparel and lifestyle collection.",
};

export default async function ShopPage() {
  const settings = await getShopSettings();
  const featuredProducts = await getFeaturedShopProducts(settings);
  const featuredCategory = settings.featuredCategory;

  return (
    <main>
      <PageHeader title="Shop" tone="blue" />
      <div className="mx-auto max-w-6xl px-5 py-9 md:px-6 md:py-12">
        <section aria-labelledby="featured-heading">
          <div className="mb-5 flex items-end justify-between gap-5">
            <h2 id="featured-heading" className="font-heading text-2xl font-semibold tracking-[-0.04em] sm:text-3xl md:text-4xl">
              {settings.featuredLabel}{featuredCategory ? `: ${featuredCategory.label}` : ""}
            </h2>
            {featuredCategory ? (
              <Link href={`/shop/category/${featuredCategory.slug}`} className="hidden shrink-0 text-base font-semibold text-black/60 hover:text-black sm:inline-flex">
                View all <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>
          <ProductReel products={featuredProducts} />
        </section>

        <ShopBrowseSections settings={settings} className="mt-10 md:mt-14" />
      </div>
    </main>
  );
}
