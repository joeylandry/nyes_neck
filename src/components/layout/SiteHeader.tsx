import Link from "next/link";
import { HeaderBrand } from "@/components/brand/HeaderBrand";
import { CartLink } from "@/components/shop/CartLink";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { MobileMenu } from "./MobileMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header>
      <AnnouncementBanner />
      <div data-site-header-offset className="fixed inset-x-0 top-[var(--announcement-offset)] z-50 hidden h-[73px] border-b border-black/10 bg-white/65 shadow-sm backdrop-blur-md md:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link href="/" aria-label="NYES NECK home">
            <HeaderBrand wordmarkClassName="text-[1.55rem]" />
          </Link>
          <div className="flex items-center gap-4">
            <nav aria-label="Primary navigation" className="flex items-center gap-6 text-lg font-semibold text-[#282828]">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-sm py-3 hover:text-black/55">
                  {link.label}
                </Link>
              ))}
            </nav>
            <CartLink />
          </div>
        </div>
      </div>
      <MobileMenu links={links} />
    </header>
  );
}
