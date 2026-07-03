import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, returnTo }: { products: Product[]; returnTo: string }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} returnTo={returnTo} priority={index === 0} />
      ))}
    </div>
  );
}
