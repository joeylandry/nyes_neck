"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();

  if (available && cartUrl && item) {
    return (
      <button
        type="button"
        onClick={() => {
          addItem(item, quantity);
          router.push("/cart");
        }}
        data-product-id={productId}
        data-variant-id={variantId}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#183247] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#274d66]"
      >
        Add to cart
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
