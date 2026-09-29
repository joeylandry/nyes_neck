import Link from "next/link";
import { getFeaturedShopProducts, getShopSettings } from "@/lib/products";
import { ProductReel } from "./ProductReel";
import { ShopBrowseSections } from "./ShopBrowseSections";

export async function ShopStorefront() {
  const settings = await getShopSettings();
  const featuredProducts = await getFeaturedShopProducts(settings);
  const featuredCategory = settings.featuredCategory;

  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-10 md:px-6 md:py-16">
        <section aria-labelledby="featured-heading">
          <div className="mb-5 flex items-end justify-between gap-4 md:mb-7">
            <h2 id="featured-heading" className="font-ui text-[1.9rem] font-semibold leading-none tracking-[-0.04em] md:text-5xl">
              The Nyes Neck Collection
            </h2>
            {featuredCategory ? (
              <Link href={`/shop/category/${featuredCategory.slug}`} className="font-ui group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-bold underline-offset-4 hover:underline md:text-base">
                Shop all
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            ) : null}
          </div>
          <ProductReel products={featuredProducts} />
        </section>

        <ShopBrowseSections settings={settings} className="mt-14 md:mt-20" showProductTypes />
      </div>
    </>
  );
}
