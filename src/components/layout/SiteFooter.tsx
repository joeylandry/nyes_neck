import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#e9e1d3] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <div className="inline-flex items-center gap-2">
            <Wordmark className="text-lg" />
            <span aria-hidden="true" className="relative block h-5 w-8 shrink-0">
              <Image
                src="/images/retro_logo.png"
                alt=""
                width={1536}
                height={1024}
                sizes="40px"
                className="absolute -left-1 -top-0.5 w-10 max-w-none"
                style={{ clipPath: "polygon(13% 13%, 87% 46%, 13% 79%)" }}
              />
            </span>
          </div>
          <p className="mt-3 text-sm text-black/65">North Falmouth, Massachusetts</p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-black/55">
            Proceeds support St. Jude Children&apos;s Research Hospital
          </p>
        </div>
        <div className="flex flex-col gap-5 md:items-end">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p className="text-xs text-black/55">© {new Date().getFullYear()} NYES NECK</p>
        </div>
      </div>
    </footer>
  );
}
