"use client";

import { useEffect, useRef, useState } from "react";
import { useCart, type CartItem } from "./CartProvider";

type PurchaseActionProps = {
  productId: string;
  variantId?: string;
  available: boolean;
  cartUrl?: string;
  quantity?: number;
  comingSoon?: boolean;
  item?: Omit<CartItem, "quantity">;
};

export function PurchaseAction({ productId, variantId, available, cartUrl, quantity = 1, comingSoon = false, item }: PurchaseActionProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  if (available && cartUrl && item) {
    return (
      <button
        type="button"
        onClick={() => {
          addItem(item, quantity);
          setJustAdded(true);
          if (resetTimer.current) clearTimeout(resetTimer.current);
          resetTimer.current = setTimeout(() => setJustAdded(false), 1800);
        }}
        data-product-id={productId}
        data-variant-id={variantId}
        className={`inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#183247] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#274d66] ${justAdded ? "animate-cart-added" : ""}`}
      >
        {justAdded ? "Added to cart ✓" : "Add to cart"}
      </button>
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
      {comingSoon ? "Coming soon" : "Sold out"}
    </button>
  );
}
