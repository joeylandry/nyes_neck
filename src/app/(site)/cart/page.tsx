import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { getShopifyOrigin } from "@/lib/commerce/shopify";

export const metadata: Metadata = {
  title: "Cart | NYES NECK",
  description: "Review the items in your NYES NECK shopping cart.",
};

export default function CartPage() {
  const shopifyOrigin = getShopifyOrigin();
  return (
    <main>
      <PageHeader title="Cart" tone="sand" />
      <section className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center md:px-6 md:py-28">
        <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          {shopifyOrigin ? "Ready to check out?" : "Explore the collection"}
        </h2>
        <p className="mt-4 max-w-md leading-7 text-black/60">
          {shopifyOrigin ? "Choose your retro crewneck’s size and color in the shop, then add it to your cart. Your order is completed securely with Shopify." : "Browse NYES NECK apparel and coastal goods. More items are coming soon."}
        </p>
        <Button href="/shop" variant="ink" className="mt-8">
          Continue shopping
        </Button>
        {shopifyOrigin ? <a href={`${shopifyOrigin}/cart`} className="mt-5 underline underline-offset-4">View your Shopify cart</a> : null}
      </section>
    </main>
  );
}
