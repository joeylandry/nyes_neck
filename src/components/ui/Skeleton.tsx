export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-black/[0.07] ${className}`} />;
}

export function ProductCardSkeleton({ aspectClass = "aspect-[4/5]" }: { aspectClass?: string }) {
  return (
    <div>
      <Skeleton className={`w-full rounded-[20px] md:rounded-[30px] ${aspectClass}`} />
      <Skeleton className="mt-4 h-3 w-20" />
      <Skeleton className="mt-2.5 h-4 w-3/4" />
      <Skeleton className="mt-2.5 h-4 w-16" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}
