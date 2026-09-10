import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductReel({
  products,
  returnTo = "shop",
  prioritizeFirst = true,
}: {
  products: Product[];
  returnTo?: string;
  prioritizeFirst?: boolean;
}) {
  return (
    <div className="-mr-3 flex snap-x snap-mandatory scroll-pl-0 gap-3 overflow-x-auto pr-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mr-6 md:gap-5 md:pr-6 md:pb-3">
      {products.map((product, index) => (
        <div key={product.id} className="w-[72vw] min-w-[250px] max-w-[350px] shrink-0 snap-start md:w-[28vw] md:max-w-[260px] lg:w-[240px]">
          <ProductCard product={product} returnTo={returnTo} priority={prioritizeFirst && index === 0} compact />
        </div>
      ))}
    </div>
  );
}
