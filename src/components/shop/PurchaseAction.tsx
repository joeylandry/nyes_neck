"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart, type CartItem } from "./CartProvider";

type PurchaseActionProps = {
  productId: string;
  variantId?: string;
  available: boolean;
  cartUrl?: string;
  quantity?: number;
  comingSoon?: boolean;
  /** Set when a required option (such as size) has not been chosen yet. */
  needsSelection?: boolean;
  item?: Omit<CartItem, "quantity">;
};

const CONFIRMATION_MS = 4000;

export function PurchaseAction({ productId, variantId, available, cartUrl, quantity = 1, comingSoon = false, needsSelection = false, item }: PurchaseActionProps) {
  const { addItem } = useCart();
  // Storing which selection was confirmed (rather than a bare boolean) means a
  // changed size, colour, or quantity clears the message without an effect.
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionKey = `${variantId ?? ""}:${quantity}`;
  const justAdded = addedKey === selectionKey;

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  if (available && cartUrl && item && !needsSelection) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            addItem(item, quantity);
            setAddedKey(selectionKey);
            if (resetTimer.current) clearTimeout(resetTimer.current);
            resetTimer.current = setTimeout(() => setAddedKey(null), CONFIRMATION_MS);
          }}
          data-product-id={productId}
          data-variant-id={variantId}
          className={`inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#183247] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#274d66] ${justAdded ? "animate-cart-added" : ""}`}
        >
          Add to cart
        </button>
        {/* Announced to screen readers and shown visually, so adding an item
            always offers a route onward instead of leaving the visitor to hunt
            for the cart icon. */}
        <p role="status" aria-live="polite" className="mt-3 min-h-6 text-center text-sm">
          {justAdded ? (
            <span className="text-[#246a43]">
              Added to cart.{" "}
              <Link href="/cart" className="font-semibold underline underline-offset-4 hover:text-[#183247]">
                View cart
              </Link>
            </span>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled
      data-product-id={productId}
      data-variant-id={variantId}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#183247] px-6 py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {comingSoon ? "Coming soon" : needsSelection ? "Select a size" : "Sold out"}
    </button>
  );
}
