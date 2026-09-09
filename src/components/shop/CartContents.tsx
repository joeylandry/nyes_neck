"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useCart } from "./CartProvider";

function checkoutUrl(items: ReturnType<typeof useCart>["items"]) {
  if (!items.length) return undefined;

  try {
    const first = new URL(items[0].cartUrl);
    const lines = items.map((item) => {
      const url = new URL(item.cartUrl);
      if (url.origin !== first.origin) throw new Error("Cart items use different checkout hosts");
      const variantId = url.searchParams.get("id");
      if (!variantId || !/^\d+$/.test(variantId)) throw new Error("Invalid checkout variant");
      return `${variantId}:${item.quantity}`;
    });
    return `${first.origin}/cart/${lines.join(",")}?checkout`;
  } catch {
    return undefined;
  }
}

export function CartContents() {
  const { items, updateQuantity, removeItem } = useCart();
  const checkout = useMemo(() => checkoutUrl(items), [items]);
  const subtotal = items.reduce((total, item) => total + (item.priceCents ?? 0) * item.quantity, 0);

  if (!items.length) {
    return (
      <section className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center md:px-6 md:py-28">
        <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Your cart is empty</h2>
        <p className="mt-4 max-w-md leading-7 text-black/60">Discover NYES NECK apparel and coastal goods.</p>
        <Link href="/shop" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#183247] px-7 py-3 text-lg font-semibold text-white transition hover:bg-[#274d66]">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-16">
        <div className="lg:max-h-[calc(100dvh-var(--site-header-height)-8rem)] lg:overflow-y-auto lg:pr-6">
          <div className="divide-y divide-black/10 border-y border-black/10">
            {items.map((item) => (
              <article key={item.id} className="grid grid-cols-[6rem_1fr] gap-4 py-5 sm:grid-cols-[8rem_1fr_auto] sm:gap-6">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e9e1d3]">
                  {item.image ? <Image src={item.image} alt="" fill sizes="128px" className="object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-2xl font-semibold leading-tight">{item.name}</h2>
                  {item.options ? <p className="mt-1 text-black/60">{item.options}</p> : null}
                  <p className="mt-2 font-semibold">{item.priceCents === null ? "Price at checkout" : formatCurrency(item.priceCents, item.currency)}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-sm font-semibold" htmlFor={`quantity-${item.id}`}>Quantity</label>
                    <select id={`quantity-${item.id}`} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="min-h-10 rounded-lg border border-black/15 bg-white px-3">
                      {Array.from({ length: Math.max(10, item.quantity) }, (_, index) => index + 1).map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}
                    </select>
                    <button type="button" onClick={() => removeItem(item.id)} className="min-h-10 px-2 text-sm font-semibold underline underline-offset-4 hover:text-[#183247]">Remove</button>
                  </div>
                </div>
                <p className="col-start-2 text-right font-semibold sm:col-start-3 sm:pt-1">
                  {item.priceCents === null ? "" : formatCurrency(item.priceCents * item.quantity, item.currency)}
                </p>
              </article>
            ))}
          </div>
        </div>
        <aside className="self-start rounded-2xl bg-[#e9e1d3] p-6 lg:sticky lg:top-[calc(var(--site-header-height)+2rem)]">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">Order summary</h2>
          <div className="mt-6 flex items-center justify-between border-y border-black/10 py-4 text-xl font-semibold"><span>Subtotal</span><span>{formatCurrency(subtotal, "USD")}</span></div>
          <p className="mt-4 text-sm leading-6 text-black/55">Taxes and shipping are calculated securely during checkout.</p>
          {checkout ? (
            <a href={checkout} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#183247] px-6 py-4 text-lg font-semibold !text-white transition hover:bg-[#274d66]">
              Secure checkout
            </a>
          ) : <p className="mt-6 rounded-2xl bg-white/60 p-4 text-sm leading-6">This cart can’t be checked out right now. Please remove and add the item again.</p>}
          <Link href="/shop" className="mt-5 block text-center font-semibold underline underline-offset-4 hover:text-[#183247]">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
}
