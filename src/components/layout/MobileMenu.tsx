"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeaderBrand } from "@/components/brand/HeaderBrand";
import { Wordmark } from "@/components/brand/Wordmark";
import { CartLink } from "@/components/shop/CartLink";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerElement?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div data-site-header-offset className="fixed inset-x-0 top-[var(--announcement-offset)] z-50 flex h-[var(--mobile-header-height)] items-center justify-between border-b border-black/10 bg-white px-3 shadow-sm">
        <button
          ref={triggerRef}
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-1.5 text-[0.95rem] font-semibold"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          Menu
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span className="h-px w-full bg-black" />
            <span className="h-px w-full bg-black" />
          </span>
        </button>
        <Link href="/" aria-label="NYES NECK home" className="absolute left-1/2 -translate-x-1/2">
          <HeaderBrand showWordmark={false} logoSize="mobileHeader" />
        </Link>
        <CartLink />
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/35 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <aside
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
        className={`fixed left-0 top-0 z-[70] flex h-[100dvh] w-[min(20rem,86vw)] flex-col border-r border-black/10 bg-white p-4 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex min-h-12 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wordmark className="text-[1.1rem]" />
            <HeaderBrand compact showWordmark={false} />
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 text-2xl leading-none"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="mt-7 flex flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-14 items-center border-b border-black/10 text-[1.15rem] font-semibold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
