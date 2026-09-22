"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { useCart } from "./CartProvider";

// Keep checkout closed until product pricing is finalized. The cart can still
// be used to review products and variants without exposing a purchase link.
const CHECKOUT_ENABLED = true;

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

function CheckoutAction({ checkout }: { checkout?: string }) {
  if (!checkout) {
    return <p className="mt-6 rounded-2xl bg-white/60 p-4 text-sm leading-6">This cart can’t be checked out right now. Please remove and add the item again.</p>;
  }

  if (!CHECKOUT_ENABLED) {
    return (
      <div className="mt-6">
        <button
          type="button"
          disabled
          className="inline-flex min-h-14 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#183247]/45 px-6 py-4 text-lg font-semibold text-white/90"
        >
          Secure checkout
        </button>
        <p className="mt-3 text-center text-sm leading-5 text-black/55">Checkout is temporarily unavailable while pricing is finalized.</p>
      </div>
    );
  }

  return (
    <a href={checkout} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#183247] px-6 py-4 text-lg font-semibold !text-white transition hover:bg-[#274d66]">
      Secure checkout
    </a>
  );
}

function EmptyCart({ browse }: { browse?: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 md:px-6 md:py-16">
      <div className="product-pattern relative overflow-hidden rounded-[22px] border border-black/10 bg-[#e9e1d3] px-6 py-12 text-center shadow-[0_10px_28px_rgba(22,22,22,0.05)] md:rounded-[30px] md:px-12 md:py-16">
        <span aria-hidden="true" className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/75 text-[#183247] shadow-[0_6px_18px_rgba(22,22,22,0.08)] md:size-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-8 md:size-9">
            <circle cx="9" cy="20" r="1" />
            <circle cx="19" cy="20" r="1" />
            <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
          </svg>
        </span>
        <h1 className="font-heading mt-7 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Your cart is empty</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-black/60">
          Nothing in the bag yet. Browse Nyes Neck apparel and coastal goods made for life on the Upper Cape.
        </p>
        <div className="mx-auto mt-9 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-full bg-[#183247] px-8 text-lg font-semibold !text-white transition hover:bg-[#274d66]"
          >
            Shop the collection
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-full border border-black/15 bg-white/70 px-8 text-lg font-semibold transition hover:bg-white"
          >
            Back to home
          </Link>
        </div>
      </div>

      {browse ? (
        <section aria-labelledby="empty-cart-browse-heading" className="mt-12 md:mt-16">
          <h2 id="empty-cart-browse-heading" className="font-heading mb-5 text-[1.8rem] font-semibold tracking-[-0.04em] md:mb-7 md:text-5xl">
            Start with a collection
          </h2>
          {browse}
        </section>
      ) : null}
    </section>
  );
}

export function CartContents({ browse }: { browse?: ReactNode }) {
  const { items, updateQuantity, removeItem } = useCart();
  const checkout = useMemo(() => checkoutUrl(items), [items]);
  const subtotal = items.reduce((total, item) => total + (item.priceCents ?? 0) * item.quantity, 0);

  if (!items.length) return <EmptyCart browse={browse} />;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-16">
        <div className="lg:max-h-[calc(100dvh-var(--site-header-height)-8rem)] lg:overflow-y-auto lg:pr-6">
          <div className="divide-y divide-black/10 border-y border-black/10">
            {items.map((item) => (
              <article key={item.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-6">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#e9e1d3] sm:rounded-2xl">
                  {item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 640px) 88px, 128px" className="object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-xl font-semibold leading-tight sm:text-2xl">{item.name}</h2>
                  {item.options ? <p className="mt-1 text-sm text-black/60 sm:text-base">{item.options}</p> : null}
                  <p className="mt-2 font-semibold sm:hidden">{item.priceCents === null ? "Price at checkout" : formatCurrency(item.priceCents * item.quantity, item.currency)}</p>
                  <p className="mt-1 hidden text-sm text-black/55 sm:block">{item.priceCents === null ? "Price at checkout" : `${formatCurrency(item.priceCents, item.currency)} each`}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <label className="text-sm font-semibold" htmlFor={`quantity-${item.id}`}>Quantity</label>
                    <select id={`quantity-${item.id}`} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="min-h-10 rounded-lg border border-black/15 bg-white px-3">
                      {Array.from({ length: Math.max(10, item.quantity) }, (_, index) => index + 1).map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}
                    </select>
                    <button type="button" onClick={() => removeItem(item.id)} className="min-h-10 px-2 text-sm font-semibold underline underline-offset-4 hover:text-[#183247]">Remove</button>
                  </div>
                </div>
                <p className="hidden text-right font-semibold sm:block sm:pt-1">
                  {item.priceCents === null ? "" : formatCurrency(item.priceCents * item.quantity, item.currency)}
                </p>
              </article>
            ))}
          </div>
          <aside className="mt-8 rounded-2xl bg-[#e9e1d3] p-5 sm:p-6 lg:hidden">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">Order summary</h2>
            <div className="mt-5 flex items-center justify-between border-y border-black/10 py-4 text-xl font-semibold"><span>Subtotal</span><span>{formatCurrency(subtotal, "USD")}</span></div>
            <p className="mt-4 text-sm leading-6 text-black/55">Taxes and shipping are calculated securely during checkout.</p>
            <CheckoutAction checkout={checkout} />
            <Link href="/shop" className="mt-5 block text-center font-semibold underline underline-offset-4 hover:text-[#183247]">Continue shopping</Link>
          </aside>
        </div>
        <aside className="hidden self-start rounded-2xl bg-[#e9e1d3] p-6 lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:block">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">Order summary</h2>
          <ul aria-label="Items in your order" className="mt-5 max-h-64 divide-y divide-black/10 overflow-y-auto border-y border-black/10">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3 pr-2 text-sm leading-tight">
                <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-white/60">
                  {item.image ? <Image src={item.image} alt="" fill sizes="40px" className="object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="mt-1 text-black/55">Qty {item.quantity}</p>
                </div>
                <p className="shrink-0 font-semibold">{item.priceCents === null ? "—" : formatCurrency(item.priceCents * item.quantity, item.currency)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-y border-black/10 py-4 text-xl font-semibold"><span>Subtotal</span><span>{formatCurrency(subtotal, "USD")}</span></div>
          <p className="mt-4 text-sm leading-6 text-black/55">Taxes and shipping are calculated securely during checkout.</p>
          <CheckoutAction checkout={checkout} />
          <Link href="/shop" className="mt-5 block text-center font-semibold underline underline-offset-4 hover:text-[#183247]">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
}
