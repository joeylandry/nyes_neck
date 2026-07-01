type PurchaseActionProps = {
  productId: string;
  variantId?: string;
  available: boolean;
};

export function PurchaseAction({ productId, variantId, available }: PurchaseActionProps) {
  return (
    <button
      type="button"
      disabled
      data-product-id={productId}
      data-variant-id={variantId}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#161616] px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {available ? "Purchasing available soon" : "Coming soon"}
    </button>
  );
}
