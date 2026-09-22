"use client";

import Link from "next/link";
import { useState } from "react";
import { HeaderBrand } from "@/components/brand/HeaderBrand";
import { Wordmark } from "@/components/brand/Wordmark";
import { CartLink } from "@/components/shop/CartLink";
import { useDialog } from "@/hooks/useDialog";
import { useActivePath, type NavLink } from "./navigation";

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const isActive = useActivePath();
  const panelRef = useDialog({ open, onClose: () => setOpen(false) });

  return (
    <div className="md:hidden">
      <div data-site-header-offset className="fixed inset-x-0 top-[var(--announcement-offset)] z-50 flex h-[var(--mobile-header-height)] items-center justify-between border-b border-black/10 bg-white px-3 shadow-sm">
        <Link href="/" aria-label="Nyes Neck home" className="flex min-h-12 min-w-0 items-center">
          <HeaderBrand logoSize="mobileHeader" wordmarkClassName="text-[0.98rem] tracking-[0.16em]" />
        </Link>
        <div className="flex items-center gap-1">
          <CartLink />
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 text-[#282828] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/35 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panelRef as React.RefObject<HTMLElement>}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
        className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(20rem,86vw)] flex-col border-l border-black/10 bg-white p-4 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex min-h-12 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wordmark className="text-[1.1rem]" />
            <HeaderBrand compact showWordmark={false} />
          </div>
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 text-2xl leading-none"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="mt-7 flex flex-col">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 items-center border-b border-black/10 text-[1.15rem] font-semibold ${active ? "text-[#183247]" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
                {active ? <span aria-hidden="true" className="ml-2 inline-block size-1.5 rounded-full bg-[#183247]" /> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
