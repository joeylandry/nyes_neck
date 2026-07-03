import type { ShopSettings } from "@/types/product";
import { CategoryGrid } from "./CategoryGrid";

export function ShopBrowseSections({ settings, className = "" }: { settings: ShopSettings; className?: string }) {
  return (
    <div className={className}>
      <section aria-labelledby="shop-by-product-heading">
        <h2 id="shop-by-product-heading" className="font-heading mb-5 text-[1.8rem] font-semibold tracking-[-0.04em] md:mb-7 md:text-5xl">
          Shop by product
        </h2>
        <CategoryGrid tiles={settings.productTiles} ariaLabel="Product types" />
      </section>

      <section className="mt-11 md:mt-20" aria-labelledby="shop-by-collection-heading">
        <h2 id="shop-by-collection-heading" className="font-heading mb-5 text-[1.8rem] font-semibold tracking-[-0.04em] md:mb-7 md:text-5xl">
          Shop by collection
        </h2>
        <CategoryGrid tiles={settings.collectionTiles} ariaLabel="Collections" />
      </section>
    </div>
  );
}
