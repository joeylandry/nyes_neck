import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopBackLink } from "@/components/shop/ShopBackLink";
import { ShopBrowseSections } from "@/components/shop/ShopBrowseSections";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProductsByCategory, getProductsByCollection, getShopCategories, getShopSettings } from "@/lib/products";
import { collectionPageLabel } from "@/lib/shopLabels";

type CategoryPageProps = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const shopCategories = await getShopCategories();
  return shopCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const shopCategories = await getShopCategories();
  const category = shopCategories.find(({ slug }) => slug === categorySlug);

  if (!category) return { title: "Collection not found | NYES NECK" };

  return {
    title: `${category.label} | NYES NECK`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const shopCategories = await getShopCategories();
  const category = shopCategories.find(({ slug }) => slug === categorySlug);

  if (!category) notFound();

  const products = category.kind === "collection"
    ? await getProductsByCollection(category.value)
    : await getProductsByCategory(category.value);
  const settings = await getShopSettings();
  const pageTitle = category.kind === "collection" ? collectionPageLabel(category.label) : category.label;

  return (
    <main>
      <PageHeader title={pageTitle} tone="blue" />
      <div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-16">
        <div className="mb-7 md:mb-10">
          <ShopBackLink href="/shop" label="Shop" />
        </div>
        {products.length ? (
          <ProductGrid products={products} returnTo={category.slug} />
        ) : (
          <div className="rounded-[22px] border border-black/10 bg-white px-6 py-14 text-center shadow-[0_10px_28px_rgba(22,22,22,0.04)]">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em]">Collection items coming soon</h2>
            <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-black/60">
              New pieces for the {pageTitle} are currently taking shape.
            </p>
          </div>
        )}

        <ShopBrowseSections settings={settings} className="mt-11 border-t border-black/10 pt-11 md:mt-20 md:pt-20" />
      </div>
    </main>
  );
}
