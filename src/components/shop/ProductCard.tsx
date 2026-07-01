import Image from "next/image";
import Link from "next/link";
import { categoryLabels } from "@/data/products";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types/product";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article id={product.category} className="scroll-mt-28">
      <Link href={`/shop/${product.slug}`} className="group block rounded-[30px] focus-visible:rounded-[30px]">
        <div className="product-pattern relative aspect-[4/5] overflow-hidden rounded-[30px] border border-black/10 bg-[#e9e1d3] shadow-[0_12px_35px_rgba(22,22,22,0.05)]">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
          />
          {!product.available ? (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] backdrop-blur">
              Coming soon
            </span>
          ) : null}
        </div>
        <div className="px-1 pb-2 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">{categoryLabels[product.category]}</p>
          <h2 className="font-heading mt-2 text-lg font-semibold leading-tight tracking-[-0.025em]">{product.name}</h2>
          <p className="mt-2 text-sm text-black/55">
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
