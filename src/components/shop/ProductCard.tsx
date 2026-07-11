import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  returnTo,
  priority = false,
  compact = false,
}: {
  product: Product;
  returnTo: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const mainImage = product.images.find((image) => image.role === "main") ?? product.images[0];

  if (!mainImage) return null;

  return (
    <article>
      <Link
        href={{ pathname: `/shop/${product.slug}`, query: { from: returnTo } }}
        className={`group block ${compact ? "rounded-[16px] focus-visible:rounded-[16px] md:rounded-[20px] md:focus-visible:rounded-[20px]" : "rounded-[20px] focus-visible:rounded-[20px] md:rounded-[30px] md:focus-visible:rounded-[30px]"}`}
      >
        <div className={`product-pattern relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#e9e1d3] ${compact ? "rounded-[16px] shadow-[0_8px_24px_rgba(22,22,22,0.05)] md:rounded-[20px]" : "rounded-[20px] shadow-[0_12px_35px_rgba(22,22,22,0.05)] md:rounded-[30px]"}`}>
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            priority={priority}
            sizes={compact ? "(max-width: 640px) 44vw, 185px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
          />
          {!product.available ? (
            <span className={`absolute rounded-full bg-white/90 font-bold uppercase tracking-[0.12em] backdrop-blur ${compact ? "left-3 top-3 px-2.5 py-1 text-[0.82rem]" : "left-4 top-4 px-3 py-1.5 text-[0.95rem]"}`}>
              Coming soon
            </span>
          ) : null}
        </div>
        <div className={`px-0.5 pb-2 md:px-1 ${compact ? "pt-2.5 md:pt-3" : "pt-3.5 md:pt-5"}`}>
          {product.collectionLabel ? (
            <p className={`font-bold uppercase tracking-[0.13em] text-black/45 ${compact ? "mb-1 text-[0.68rem] md:text-xs" : "mb-1.5 text-xs md:text-[0.8rem]"}`}>
              {product.collectionLabel}
            </p>
          ) : null}
          <h2 className={`font-heading font-semibold leading-tight tracking-[-0.025em] ${compact ? "text-[0.95rem] md:text-lg" : "text-lg md:text-xl"}`}>{product.name}</h2>
          <p className={`text-black/55 ${compact ? "mt-1.5 text-sm" : "mt-2 text-base"}`}>
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
