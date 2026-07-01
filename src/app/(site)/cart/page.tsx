import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Cart | NYES NECK",
  description: "Review the items in your NYES NECK shopping cart.",
};

export default function CartPage() {
  return (
    <main>
      <PageHeader title="Cart" tone="sand" />
      <section className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center md:px-6 md:py-28">
        <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          Your cart is empty
        </h2>
        <p className="mt-4 max-w-md leading-7 text-black/60">
          Explore the shop to find NYES NECK apparel and coastal goods.
        </p>
        <Button href="/shop" variant="ink" className="mt-8">
          Continue shopping
        </Button>
      </section>
    </main>
  );
}
