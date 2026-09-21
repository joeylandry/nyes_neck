"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // The storefront reads from Printful and Sanity at request time, so a
    // failure here is usually an upstream hiccup worth surfacing in logs.
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-20 text-center md:py-28">
      <h1 className="font-heading text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
        We couldn&apos;t load this page
      </h1>
      <p className="mt-4 leading-7 text-black/60">
        Something went wrong on our end. Try again in a moment—your cart is saved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#183247] px-7 text-lg font-semibold text-white transition hover:bg-[#274d66]"
        >
          Try again
        </button>
        <Link
          href="/shop"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-black px-7 text-lg font-semibold transition hover:bg-black hover:text-white"
        >
          Back to shop
        </Link>
      </div>
      {error.digest ? <p className="mt-6 text-xs text-black/40">Reference: {error.digest}</p> : null}
    </section>
  );
}
