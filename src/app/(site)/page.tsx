import { HeroGallery } from "@/components/home/HeroGallery";
import { ShopStorefront } from "@/components/shop/ShopStorefront";

export default function HomePage() {
  return (
    <>
      <HeroGallery />
      <div id="mini-shop" className="scroll-mt-[var(--site-header-height)]">
        <ShopStorefront />
      </div>
    </>
  );
}
