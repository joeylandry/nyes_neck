"use client";

import { usePathname } from "next/navigation";

export type NavLink = { href: string; label: string };

export const primaryNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

/**
 * Marks a nav entry current when it is the page, or an ancestor of it, so
 * "Shop" stays highlighted on category and product routes.
 */
export function useActivePath() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
}
