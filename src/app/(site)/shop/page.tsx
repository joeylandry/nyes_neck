import { redirect } from "next/navigation";
import { getShopSettings } from "@/lib/products";

// "Shop" opens straight onto the main collection, which starts with our picks.
export default async function ShopPage() {
  const settings = await getShopSettings();
  redirect(`/shop/category/${settings.featuredCategory?.slug ?? "nyes-neck-collection"}`);
}
