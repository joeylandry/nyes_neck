import type { Metadata } from "next";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { categoryLabels } from "@/data/products";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop | NYES NECK",
  description: "Explore the first NYES NECK Upper Cape apparel and lifestyle collection.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main>
      <PageHeader title="Shop" tone="blue" />
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xl leading-8 text-black/70 md:text-2xl md:leading-9">
            The first NYES NECK collection is taking shape—enduring apparel and useful coastal goods, designed with the Upper Cape in mind.
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#183247]">
            Products and pricing coming soon
          </p>
        </div>

        <nav aria-label="Product collections" className="my-10 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
          {Object.entries(categoryLabels).map(([slug, label]) => (
            <a
              key={slug}
              href={`#${slug}`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-black/10 bg-white px-4 text-sm transition hover:border-black/30"
            >
              {label}
            </a>
          ))}
        </nav>

        <ProductGrid products={products} />
      </div>
    </main>
  );
}
