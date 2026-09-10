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
          <div className="mb-8 md:mb-10">
            <h2 id="featured-heading" className="font-ui max-w-[13ch] text-[2.9rem] font-normal leading-[0.95] tracking-[-0.07em] sm:text-6xl md:max-w-[15ch] md:text-7xl">
              The Nyes Neck Collection
            </h2>
            {featuredCategory ? (
              <Link href={`/shop/category/${featuredCategory.slug}`} className="font-ui mt-7 inline-flex min-h-12 items-center rounded-full bg-[#161616] px-7 text-base font-bold !text-white transition hover:bg-[#183247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3">
                Shop Nyes Neck Collection
              </Link>
            ) : null}
          </div>
          <ProductReel products={featuredProducts} />
        </section>

        <ShopBrowseSections settings={settings} className="mt-14 md:mt-20" />
      </div>
    </>
  );
}
