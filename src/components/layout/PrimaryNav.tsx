"use client";

import Link from "next/link";
import { useActivePath, type NavLink } from "./navigation";

export function PrimaryNav({ links }: { links: NavLink[] }) {
  const isActive = useActivePath();

  return (
    <nav aria-label="Primary navigation" className="flex items-center gap-6 text-base text-[#282828]">
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-sm py-3 transition-colors after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:bg-current after:transition-transform ${
              active ? "text-[#183247] after:scale-x-100" : "after:scale-x-0 hover:text-black/55 hover:after:scale-x-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
