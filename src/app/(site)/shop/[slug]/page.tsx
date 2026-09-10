import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { ProductReel } from "@/components/shop/ProductReel";
import { ShopBackLink } from "@/components/shop/ShopBackLink";
import { findProductBySlug, getProductBySlug, getProducts, getShopCategories } from "@/lib/products";
import { collectionPageLabel } from "@/lib/shopLabels";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

// The inventory changes independently of site deploys. Resolving this route at
// request time keeps product-card links valid when Shopify adds a new product.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | Nyes Neck Shop" };
  return { title: `${product.name} | Nyes Neck Shop`, description: product.shortDescription };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { from } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getShopCategories()]);
  const product = findProductBySlug(products, slug);
  if (!product) redirect("/shop");

  const source = typeof from === "string" ? from : undefined;
  const sourceCategory = categories.find((category) => category.slug === source);
  const fallbackCategory = categories.find((category) => category.slug === product.category);
  const backCategory = sourceCategory ?? fallbackCategory;
  const backHref = source === "shop" || !backCategory ? "/shop" : `/shop/category/${backCategory.slug}`;
  const backLabel = source === "shop" || !backCategory
    ? "Shop"
    : backCategory.kind === "collection"
      ? collectionPageLabel(backCategory.label)
      : backCategory.label;
  const relatedProducts = products.filter(
    (candidate) => candidate.id !== product.id
      && candidate.collections.some((collection) => product.collections.includes(collection)),
  );
  const relatedCollection = categories.find(
    (category) => category.kind === "collection" && product.collections.includes(category.value),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-7 md:px-6 md:py-14">
      <ShopBackLink href={backHref} label={backLabel} />

      <ProductDetails key={product.id} product={product} />

      <section className="mt-12 border-t border-black/10 pt-9 md:mt-24 md:pt-16" aria-labelledby="related-products-heading">
        <h2 id="related-products-heading" className="font-heading text-[2rem] font-semibold tracking-[-0.045em] md:text-5xl">
          You may also like
        </h2>
        {relatedProducts.length ? (
          <div className="mt-7">
            <ProductReel
              products={relatedProducts}
              returnTo={relatedCollection?.slug ?? "shop"}
              prioritizeFirst={false}
            />
          </div>
        ) : (
          <p className="mt-4 text-lg text-black/60">More from this collection is coming soon.</p>
        )}
      </section>
    </main>
  );
}
