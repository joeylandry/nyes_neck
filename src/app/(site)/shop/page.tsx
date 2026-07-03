import type { Metadata } from "next";
import { ShopStorefront } from "@/components/shop/ShopStorefront";

export const metadata: Metadata = {
  title: "Shop | NYES NECK",
  description: "Explore the first NYES NECK Upper Cape apparel and lifestyle collection.",
};

export default function ShopPage() {
  return (
    <main>
      <ShopStorefront />
    </main>
  );
}
