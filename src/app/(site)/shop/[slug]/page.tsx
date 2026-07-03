import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PurchaseAction } from "@/components/shop/PurchaseAction";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductReel } from "@/components/shop/ProductReel";
import { ShopBackLink } from "@/components/shop/ShopBackLink";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductBySlug, getProducts, getShopCategories } from "@/lib/products";
import { collectionPageLabel } from "@/lib/shopLabels";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | NYES NECK" };
  return { title: `${product.name} | NYES NECK`, description: product.shortDescription };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { from } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getShopCategories()]);
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

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

      <div className="mt-5 grid gap-7 md:mt-6 md:grid-cols-[1.05fr_0.95fr] md:gap-14 lg:gap-20">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="md:pt-5">
          <h1 className="font-heading text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.055em] md:text-7xl">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-black/65 md:mt-5 md:text-xl md:leading-8">{product.description}</p>
          <p className="mt-5 text-lg font-semibold md:mt-6 md:text-xl">
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>

          {product.sizes.length ? (
            <section className="mt-8" aria-labelledby="size-heading">
              <h2 id="size-heading" className="text-sm font-bold uppercase tracking-[0.14em] text-black/55">Planned sizes</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => <span key={size} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/15 bg-white px-3 text-base">{size}</span>)}
              </div>
            </section>
          ) : null}

          {product.colors.length ? (
            <section className="mt-7" aria-labelledby="color-heading">
              <h2 id="color-heading" className="text-sm font-bold uppercase tracking-[0.14em] text-black/55">Planned colors</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => <span key={color} className="rounded-full border border-black/15 bg-white px-4 py-2.5 text-base">{color}</span>)}
              </div>
            </section>
          ) : null}

          <div className="mt-9">
            <PurchaseAction productId={product.id} variantId={product.variants[0]?.id} available={product.available} href={product.externalLink} />
            {!product.externalLink ? <p className="mt-3 text-center text-sm leading-5 text-black/50">Purchasing is not enabled for this product.</p> : null}
          </div>
        </div>
      </div>

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
