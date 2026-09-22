import type { Metadata } from "next";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { CartContents } from "@/components/shop/CartContents";
import { getShopSettings } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your Nyes Neck shopping cart.",
};

export default async function CartPage() {
  // Rendered on the server and handed to the client cart as a slot, so an empty
  // cart can point somewhere useful without shipping the grid to the browser.
  const settings = await getShopSettings();
  const tiles = settings.collectionTiles.slice(0, 4);

  return <CartContents browse={tiles.length ? <CategoryGrid tiles={tiles} ariaLabel="Collections" /> : null} />;
}
