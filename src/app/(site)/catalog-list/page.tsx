import type { Metadata } from "next";
import { CatalogPicker, type CatalogRow } from "./CatalogPicker";
import { getFavoriteProducts, productStyle } from "@/lib/favorites";
import { getProducts } from "@/lib/products";

// An unlinked working page for choosing "Our Favorites". Kept out of search.
export const metadata: Metadata = {
  title: "Catalog list",
  robots: { index: false, follow: false },
};

export default async function CatalogListPage() {
  const products = await getProducts();
  const current = new Set(getFavoriteProducts(products).map((product) => product.id));
  const rows: CatalogRow[] = products.map((product) => ({
    id: product.externalId ?? product.id,
    name: product.name,
    type: product.categoryLabel,
    brand: product.brand ?? "",
    decoration: product.decoration ?? "",
    style: productStyle(product) ?? "",
    favorite: current.has(product.id),
  }));

  return (
    <div className="mx-auto max-w-6xl px-3 py-10 md:px-6 md:py-14">
      <h1 className="font-ui text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Catalog list</h1>
      <p className="mt-3 max-w-2xl text-black/65">
        Every product on the site. Tick the ones for Our Favorites (today&apos;s picks are pre-ticked), then use
        “Copy selected” and send the list over.
      </p>
      <CatalogPicker rows={rows} />
    </div>
  );
}
