import type { Metadata } from "next";
import { CartContents } from "@/components/shop/CartContents";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Cart | NYES NECK",
  description: "Review the items in your NYES NECK shopping cart.",
};

export default function CartPage() {
  return (
    <main>
      <PageHeader title="Cart" tone="sand" />
      <CartContents />
    </main>
  );
}
