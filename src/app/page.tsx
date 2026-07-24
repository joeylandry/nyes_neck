import type { Metadata } from "next";
import { HeroGallery } from "@/components/home/HeroGallery";
import { HomepageAnnouncement } from "@/components/home/HomepageAnnouncement";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ShopStorefront } from "@/components/shop/ShopStorefront";
import { getHomepageAnnouncement } from "@/lib/homepageAnnouncement";

export const metadata: Metadata = {
  title: "NYES NECK",
};

export default async function HomePage() {
  const announcement = await getHomepageAnnouncement();

  return (
    <>
      <SiteHeader />
      <main className="site-main">
        <HeroGallery />
        <HomepageAnnouncement announcement={announcement} />
        <div
          id="mini-shop"
          className="scroll-mt-[var(--site-header-height)]"
        >
          <ShopStorefront showHeader={false} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
