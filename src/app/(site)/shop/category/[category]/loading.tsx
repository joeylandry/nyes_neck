import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-8 md:px-6 md:py-14">
      <span className="sr-only" role="status">Loading this collection</span>
      <div className="mb-7 border-b border-black/15 pb-5 md:mb-10 md:pb-7">
        <Skeleton className="h-3 w-28" />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <Skeleton className="h-10 w-[min(20rem,70%)] md:h-16" />
          <Skeleton className="h-11 w-28 rounded-full" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <Skeleton className="h-11 w-36 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
