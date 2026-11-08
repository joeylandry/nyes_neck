import Link from "next/link";
import { Garland } from "@/components/holiday/Garland";
import { FAVORITES_SUBSECTION_THRESHOLD, getFavoriteGroups } from "@/lib/favorites";
import { HOLIDAY_DECOR } from "@/lib/holiday";
import { getFeaturedShopProducts, getShopSettings } from "@/lib/products";
import { ProductReel } from "./ProductReel";
import { ShopBrowseSections } from "./ShopBrowseSections";

export async function ShopStorefront() {
  const settings = await getShopSettings();
  const featuredProducts = await getFeaturedShopProducts(settings);
  const featuredCategory = settings.featuredCategory;
  const favoriteGroups = getFavoriteGroups(featuredProducts);
  const favoriteCount = favoriteGroups.reduce((total, group) => total + group.products.length, 0);
  // Until the catalog has products matching the staples, keep showing the
  // featured collection so the homepage never opens on an empty row.
  const showSubsections = favoriteCount > FAVORITES_SUBSECTION_THRESHOLD && favoriteGroups.length > 1;
  const reelProducts = favoriteCount ? favoriteGroups.flatMap((group) => group.products) : featuredProducts;

  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-10 md:px-6 md:py-16">
        <section aria-labelledby="featured-heading">
          {HOLIDAY_DECOR ? <Garland className="mb-3 md:mb-4" /> : null}
          <div className="mb-5 flex items-end justify-between gap-4 md:mb-7">
            <h2 id="featured-heading" className="font-ui text-[1.9rem] font-semibold leading-none tracking-[-0.04em] md:text-5xl">
              Our Favorites
            </h2>
            {featuredCategory ? (
              <Link href={`/shop/category/${featuredCategory.slug}`} className="font-ui group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-bold underline-offset-4 hover:underline md:text-base">
                Shop all
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            ) : null}
          </div>
          {showSubsections ? (
            <div className="space-y-9 md:space-y-12">
              {favoriteGroups.map((group, index) => (
                <section key={group.label} aria-labelledby={`favorites-${index}-heading`}>
                  <h3 id={`favorites-${index}-heading`} className="font-ui mb-3 text-lg font-bold tracking-[-0.03em] md:mb-4 md:text-2xl">
                    {group.label}
                  </h3>
                  <ProductReel products={group.products} prioritizeFirst={index === 0} />
                </section>
              ))}
            </div>
          ) : (
            <ProductReel products={reelProducts} />
          )}
        </section>

        <ShopBrowseSections settings={settings} className="mt-14 md:mt-20" showProductTypes />
      </div>
    </>
  );
}
