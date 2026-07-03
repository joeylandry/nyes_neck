import Link from "next/link";

export function ShopBackLink({ href, label }: { href: string; label: string }) {
  const linkLabel = label === "Shop" ? "Back to Shop" : label;

  return (
    <Link
      href={href}
      className="inline-flex max-w-2xl items-center gap-2 text-2xl leading-8 text-black/80 transition-colors hover:text-black md:text-3xl md:leading-9"
    >
      <span aria-hidden="true">←</span>
      {linkLabel}
    </Link>
  );
}
