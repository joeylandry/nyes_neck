import type { Metadata } from "next";
import { HeroGallery } from "@/components/home/HeroGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ShopStorefront } from "@/components/shop/ShopStorefront";

export const metadata: Metadata = {
  title: "NYES NECK",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="site-main">
        <HeroGallery />
        <div
          id="mini-shop"
          className="scroll-mt-[var(--mobile-header-height)] md:scroll-mt-[var(--desktop-header-height)]"
        >
          <ShopStorefront showHeader={false} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
