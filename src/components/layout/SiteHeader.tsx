import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
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
      <div className="fixed inset-x-0 top-0 z-50 hidden h-[73px] border-b border-black/10 bg-white/65 shadow-sm backdrop-blur-md md:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link href="/" aria-label="NYES NECK home">
            <Wordmark className="text-[1.15rem]" />
          </Link>
          <nav aria-label="Primary navigation" className="flex items-center gap-6 text-[0.95rem] text-[#282828]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-sm py-3 hover:text-black/55">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <MobileMenu links={links} />
    </header>
  );
}
