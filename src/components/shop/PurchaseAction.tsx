type PurchaseActionProps = {
  productId: string;
  variantId?: string;
  available: boolean;
  cartUrl?: string;
  quantity?: number;
  comingSoon?: boolean;
};

export function PurchaseAction({ productId, variantId, available, cartUrl, quantity = 1, comingSoon = false }: PurchaseActionProps) {
  if (available && cartUrl) {
    return (
      <a
        href={cartUrl.replace(/([?&]quantity=)\d+/, `$1${quantity}`)}
        data-product-id={productId}
        data-variant-id={variantId}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#b86b43] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#9e5432]"
      >
        Add to cart
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      data-product-id={productId}
      data-variant-id={variantId}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#b86b43] px-6 py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {comingSoon ? "Coming soon" : "Sold out"}
    </button>
  );
}
