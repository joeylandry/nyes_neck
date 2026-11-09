import { homeHero } from "@/data/home-hero";
import type { ShopSettings, ShopTile } from "@/types/product";
import { CategoryGrid } from "./CategoryGrid";

export function ShopBrowseSections({ settings, className = "", showProductTypes = false }: { settings: ShopSettings; className?: string; showProductTypes?: boolean }) {
  return (
    <div className={className}>
      {showProductTypes ? <section aria-labelledby="shop-by-product-heading">
        <h2 id="shop-by-product-heading" className="font-heading mb-5 text-[1.8rem] font-semibold tracking-[-0.04em] md:mb-7 md:text-5xl">
          Shop by product
        </h2>
        <CategoryGrid tiles={settings.productTiles} ariaLabel="Product types" solid />
      </section> : null}

      <section className={showProductTypes ? "mt-11 md:mt-20" : ""} aria-labelledby="shop-by-collection-heading">
        <h2 id="shop-by-collection-heading" className="font-heading mb-5 text-[1.8rem] font-semibold tracking-[-0.04em] md:mb-7 md:text-5xl">
          Shop by collection
        </h2>
        <CategoryGrid tiles={settings.collectionTiles.map(withHeroImage)} ariaLabel="Collections" />
      </section>
    </div>
  );
}

// The main collection's tile uses the homepage hero photo of Nyes Neck.
function withHeroImage(tile: ShopTile): ShopTile {
  if (!tile.href.endsWith("/nyes-neck-collection")) return tile;
  return { ...tile, image: { src: homeHero.image.src, alt: homeHero.image.alt } };
}
