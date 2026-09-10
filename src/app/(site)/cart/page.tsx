import type { Metadata } from "next";
import { CartContents } from "@/components/shop/CartContents";

export const metadata: Metadata = {
  title: "Cart | Nyes Neck Shop",
  description: "Review the items in your NYES NECK shopping cart.",
};

export default function CartPage() {
  return (
    <main>
      <CartContents />
    </main>
  );
}
