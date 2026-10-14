
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  
      <div className="mb-4 h-4 w-56 max-w-full animate-pulse rounded bg-gray-200" />

    
      <div className="border-b border-green-100 pb-5">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

        <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-gray-200" />
      </div>

   
      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

        <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <ProductSkeleton count={6} />
    </main>
  );
}
