import Link from "next/link";

type CartLinkProps = {
  className?: string;
};

export function CartLink({ className = "" }: CartLinkProps) {
  return (
    <Link
      href="/cart"
      aria-label="Shopping cart, 0 items"
      className={`relative flex min-h-11 min-w-11 items-center justify-center rounded-full text-[#282828] transition hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <circle cx="9" cy="20" r="1" />
        <circle cx="19" cy="20" r="1" />
        <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
      </svg>
      <span className="absolute right-0 top-0 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#183247] px-1 text-sm font-bold leading-none text-white">
        0
      </span>
    </Link>
  );
}
