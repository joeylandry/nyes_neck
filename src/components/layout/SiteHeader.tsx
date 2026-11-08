import Link from "next/link";
import { HeaderBrand } from "@/components/brand/HeaderBrand";
import { ChristmasLights } from "@/components/holiday/ChristmasLights";
import { CartLink } from "@/components/shop/CartLink";
import { HOLIDAY_DECOR } from "@/lib/holiday";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { MobileMenu } from "./MobileMenu";
import { PrimaryNav } from "./PrimaryNav";
import { primaryNavLinks } from "./navigation";

export function SiteHeader() {
  return (
    <header>
      <AnnouncementBanner />
      <div data-site-header-offset className="fixed inset-x-0 top-[var(--announcement-offset)] z-50 hidden h-[73px] border-b border-black/10 bg-white/65 shadow-sm backdrop-blur-md md:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link href="/" aria-label="Nyes Neck home">
            <HeaderBrand wordmarkClassName="text-[1.55rem]" />
          </Link>
          <div className="flex items-center gap-4">
            <PrimaryNav links={primaryNavLinks} />
            <CartLink />
          </div>
        </div>
        {HOLIDAY_DECOR ? <ChristmasLights /> : null}
      </div>
      <MobileMenu links={primaryNavLinks} decoration={HOLIDAY_DECOR ? <ChristmasLights /> : null} />
    </header>
  );
}
