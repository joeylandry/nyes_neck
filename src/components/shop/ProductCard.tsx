import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}) {
  const mainImage = product.images.find((image) => image.role === "main") ?? product.images[0];
  const hoverImage = product.images.find((image) => image.role === "hover");

  return (
    <article>
      <Link
        href={`/shop/${product.slug}`}
        className={`group block ${compact ? "rounded-[20px] focus-visible:rounded-[20px]" : "rounded-[30px] focus-visible:rounded-[30px]"}`}
      >
        <div className={`product-pattern relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#e9e1d3] ${compact ? "rounded-[20px] shadow-[0_8px_24px_rgba(22,22,22,0.05)]" : "rounded-[30px] shadow-[0_12px_35px_rgba(22,22,22,0.05)]"}`}>
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            priority={priority}
            sizes={compact ? "(max-width: 640px) 44vw, 185px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className={`object-cover transition duration-500 motion-reduce:transform-none ${hoverImage ? "group-hover:opacity-0" : "group-hover:scale-[1.025]"}`}
          />
          {hoverImage ? (
            <Image
              src={hoverImage.src}
              alt={hoverImage.alt}
              fill
              sizes={compact ? "(max-width: 640px) 44vw, 185px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              className="object-cover opacity-0 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-100 motion-reduce:transform-none"
            />
          ) : null}
          {!product.available ? (
            <span className={`absolute rounded-full bg-white/90 font-bold uppercase tracking-[0.12em] backdrop-blur ${compact ? "left-3 top-3 px-2.5 py-1 text-[0.82rem]" : "left-4 top-4 px-3 py-1.5 text-[0.95rem]"}`}>
              Coming soon
            </span>
          ) : null}
        </div>
        <div className={`px-1 pb-2 ${compact ? "pt-3" : "pt-5"}`}>
          <p className={`font-bold uppercase tracking-[0.14em] text-black/50 ${compact ? "text-xs" : "text-sm"}`}>{product.categoryLabel}</p>
          <h2 className={`font-heading font-semibold leading-tight tracking-[-0.025em] ${compact ? "mt-1.5 text-base sm:text-lg" : "mt-2 text-xl"}`}>{product.name}</h2>
          <p className={`text-black/55 ${compact ? "mt-1.5 text-sm" : "mt-2 text-base"}`}>
            {product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
