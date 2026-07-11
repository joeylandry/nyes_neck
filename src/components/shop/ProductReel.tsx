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
    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:-mx-6 md:gap-5 md:px-6 md:pb-3">
      {products.map((product, index) => (
        <div key={product.id} className="w-[41vw] min-w-[138px] max-w-[168px] shrink-0 snap-start md:w-[28vw] md:max-w-[185px] lg:w-[180px]">
          <ProductCard product={product} returnTo={returnTo} priority={prioritizeFirst && index === 0} compact />
        </div>
      ))}
    </div>
  );
}
