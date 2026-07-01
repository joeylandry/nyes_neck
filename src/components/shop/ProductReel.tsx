import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductReel({ products }: { products: Product[] }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 md:-mx-6 md:gap-5 md:px-6">
      {products.map((product, index) => (
        <div key={product.id} className="w-[44vw] min-w-[148px] max-w-[185px] shrink-0 snap-start sm:w-[28vw] lg:w-[180px]">
          <ProductCard product={product} priority={index === 0} compact />
        </div>
      ))}
    </div>
  );
}
