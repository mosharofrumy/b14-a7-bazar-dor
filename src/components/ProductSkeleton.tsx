interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
  return (
    <div
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      aria-busy="true"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-green-100 bg-white p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-green-100" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
              </div>
            </div>

            <div className="h-6 w-16 shrink-0 rounded-full bg-gray-200" />
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="h-3 w-16 rounded bg-gray-200" />

              <div className="mt-2 h-6 w-28 max-w-full rounded bg-gray-200" />
            </div>

            <div className="h-3 w-24 max-w-2/5 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
