import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-10 md:px-6 md:py-16">
      <span className="sr-only" role="status">Loading the shop</span>
      <Skeleton className="h-12 w-[min(22rem,80%)] md:h-20" />
      <Skeleton className="mt-7 h-12 w-64 rounded-full" />
      <div className="mt-8 md:mt-10">
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
