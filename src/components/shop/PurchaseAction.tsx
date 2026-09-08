type PurchaseActionProps = {
  productId: string;
  variantId?: string;
  available: boolean;
  href?: string;
  quantity?: number;
  comingSoon?: boolean;
};

export function PurchaseAction({ productId, variantId, available, href, quantity = 1, comingSoon = false }: PurchaseActionProps) {
  if (available && href) {
    return (
      <a
        href={href.replace(/:1$/, `:${quantity}`)}
        data-product-id={productId}
        data-variant-id={variantId}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#161616] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#183247]"
      >
        Buy now
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      data-product-id={productId}
      data-variant-id={variantId}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#161616] px-6 py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {comingSoon ? "Coming soon" : "Sold out"}
    </button>
  );
}
