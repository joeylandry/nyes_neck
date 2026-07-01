import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#e9e1d3] px-5 py-10 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark className="text-lg" />
          <p className="mt-3 text-sm text-black/65">North Falmouth, Massachusetts</p>
          <p className="mt-1 text-sm text-black/65">Rooted in Nyes Neck and the Upper Cape.</p>
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
