import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-green-50/50">
      <div className="mx-auto max-w-6xl px-2 py-2">
        <div className="mb-6 h-40 animate-pulse rounded-2xl bg-green-100 sm:h-52" />

        <section className="py-7 sm:py-9">
          <div className="mb-5">
            <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <ProductSkeleton count={6} />
        </section>

        <section className="py-7 sm:py-9">
          <div className="mb-5">
            <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <ProductSkeleton count={6} />
        </section>

        <section className="py-7 sm:py-9">
          <div className="mb-5 h-7 w-40 animate-pulse rounded bg-gray-200" />

          <ProductSkeleton count={12} />
        </section>
      </div>
    </main>
  );
}
