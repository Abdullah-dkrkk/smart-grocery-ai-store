export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="w-[280px] flex-shrink-0 snap-start">
      <div className="bg-card border rounded-lg overflow-hidden">
        <Skeleton className="aspect-[4/5] rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-16" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductSliderSkeleton() {
  return (
    <section>
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}

export function CategoryShowcaseSkeleton() {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg hidden sm:flex" />
      </div>
      <div className="flex gap-4 overflow-hidden py-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center p-6 rounded-xl border min-w-[160px] flex-1 min-h-[200px]">
            <Skeleton className="w-[68px] h-[68px] rounded-full mb-3" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-14 mt-2" />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </section>
  )
}

export function DailyBestSellsSkeleton() {
  return (
    <section>
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-56 mt-2" />
      </div>
      <div className="grid lg:grid-cols-4 gap-5">
        <Skeleton className="lg:col-span-1 h-[350px] rounded-xl" />
        <div className="lg:col-span-3 grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-xl overflow-hidden">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DealsOfDaySkeleton() {
  return (
    <section>
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-5 h-[560px] rounded-xl" />
        <div className="lg:col-span-7 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 bg-card border rounded-lg p-4">
              <Skeleton className="w-24 h-24 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-16" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialSkeleton() {
  return (
    <section>
      <div className="mb-6">
        <Skeleton className="h-8 w-56 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto mt-2" />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-xl p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
