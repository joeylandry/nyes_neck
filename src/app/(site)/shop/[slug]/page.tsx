import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PurchaseAction } from "@/components/shop/PurchaseAction";
import { categoryLabels } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductBySlug, getProducts } from "@/lib/products";

type ProductPageProps = { params: Promise<{ slug: string }> };

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-9 md:px-6 md:py-14">
      <Link href="/shop" className="inline-flex min-h-11 items-center text-sm font-semibold text-black/60 hover:text-black">
        <span aria-hidden="true">←</span><span className="ml-2">Back to Shop</span>
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14 lg:gap-20">
        <div className="product-pattern relative aspect-[4/5] overflow-hidden rounded-[30px] border border-black/10 bg-[#e9e1d3] shadow-sm">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        <div className="md:pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#183247]">{categoryLabels[product.category]}</p>
          <h1 className="font-heading mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] md:text-6xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-black/65">{product.description}</p>
          <p className="mt-6 text-lg font-semibold">
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>

          {product.sizes.length ? (
            <section className="mt-8" aria-labelledby="size-heading">
              <h2 id="size-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Planned sizes</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => <span key={size} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/15 bg-white px-3 text-sm">{size}</span>)}
              </div>
            </section>
          ) : null}

          {product.colors.length ? (
            <section className="mt-7" aria-labelledby="color-heading">
              <h2 id="color-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Planned colors</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => <span key={color} className="rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm">{color}</span>)}
              </div>
            </section>
          ) : null}

          <div className="mt-9">
            <PurchaseAction productId={product.id} variantId={product.variants[0]?.id} available={product.available} />
            <p className="mt-3 text-center text-xs leading-5 text-black/50">Purchasing is not enabled in this preview.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
