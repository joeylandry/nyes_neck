import Link from "next/link";
import { getFeaturedShopProducts, getShopSettings } from "@/lib/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductReel } from "./ProductReel";
import { ShopBrowseSections } from "./ShopBrowseSections";

export async function ShopStorefront({ showHeader = true }: { showHeader?: boolean }) {
  const settings = await getShopSettings();
  const featuredProducts = await getFeaturedShopProducts(settings);
  const featuredCategory = settings.featuredCategory;

  return (
    <>
      {showHeader ? <PageHeader title="Shop" tone="blue" /> : null}
      <div className="mx-auto max-w-6xl px-4 py-7 md:px-6 md:py-12">
        <section aria-labelledby="featured-heading">
          <div className="mb-4 flex items-end justify-between gap-5 md:mb-5">
            <h2 id="featured-heading" className="font-heading text-[1.45rem] font-semibold tracking-[-0.04em] md:text-4xl">
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

        <ShopBrowseSections settings={settings} className="mt-8 md:mt-14" />
      </div>
    </>
  );
}
