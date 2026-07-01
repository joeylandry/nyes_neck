export function formatCurrency(priceCents: number, currency: "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(priceCents / 100);
}
