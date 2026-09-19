import { ProductCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-7 md:px-6 md:py-14">
      <span className="sr-only" role="status">Loading this product</span>
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid items-start gap-8 md:mt-8 md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-16">
        <div>
          <Skeleton className="aspect-[4/5] w-full rounded-[20px] md:rounded-[30px]" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="aspect-square w-20 rounded-xl md:w-24" />)}
          </div>
        </div>
        <div className="md:py-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-10 w-4/5 md:h-14" />
          <Skeleton className="mt-5 h-7 w-28" />
          <div className="mt-7 space-y-6 border-y border-black/10 py-7">
            <div>
              <Skeleton className="h-4 w-24" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-12 w-28 rounded-full" />)}
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-16" />
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="size-12 rounded-xl" />)}
              </div>
            </div>
          </div>
          <Skeleton className="mt-7 h-14 w-full rounded-full" />
        </div>
      </div>
      <div className="mt-12 border-t border-black/10 pt-9 md:mt-24 md:pt-16">
        <Skeleton className="h-9 w-64 md:h-12" />
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      </div>
    </div>
  );
}
