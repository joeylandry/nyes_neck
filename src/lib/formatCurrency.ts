export function formatCurrency(priceCents: number, currency: "USD") {
  // Whole-dollar amounts read better without trailing zeros. Amounts that carry
  // cents keep them: cart lines and the subtotal have to match what the
  // checkout actually charges.
  const fractionDigits = priceCents % 100 === 0 ? 0 : 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(priceCents / 100);
}
