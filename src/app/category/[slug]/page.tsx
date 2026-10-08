
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import CategorySorting from "@/components/categorySorting";
import ProductCard from "@/components/ProductCard";
import { fetchFromAPI } from "@/lib/api";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

type SortOption = "default" | "asc" | "desc";

function getArrayFromResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const response = payload as Record<string, unknown>;

  if (Array.isArray(response.data)) {
    return response.data as T[];
  }

  if (Array.isArray(response.products)) {
    return response.products as T[];
  }

  if (response.data && typeof response.data === "object") {
    return getArrayFromResponse<T>(response.data);
  }

  return [];
}

async function getCategories(): Promise<Category[]> {
  const payload = await fetchFromAPI<unknown>(
    "/categories",
    3600,
  );

  const categories = getArrayFromResponse<Category>(payload);

  if (categories.length === 0) {
    throw new Error("ক্যাটাগরির তথ্য পাওয়া যায়নি।");
  }

  return categories;
}

async function getProducts(): Promise<Product[]> {
  const payload = await fetchFromAPI<unknown>(
    "/products",
    3600,
  );

  const products = getArrayFromResponse<Product>(payload);

  if (products.length === 0) {
    throw new Error("পণ্যের তথ্য পাওয়া যায়নি।");
  }

  return products;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category
      ? `${category.nameBn} এর বাজারদর | আজকের বাজার-দর`
      : "ক্যাটাগরির বাজারদর | আজকের বাজার-দর",
    description: category
      ? `${category.nameBn} এর আজকের বাজারদর দেখুন।`
      : "আজকের বাজারদর দেখুন।",
  };
}

function CategoryPageLoading() {
  return (
    <main className="mx-auto min-h-64 max-w-7xl px-4 py-10">
      <p className="text-center text-gray-500">
        পণ্যের তথ্য লোড হচ্ছে...
      </p>
    </main>
  );
}

export default function CategoryProductsPage({
  params,
  searchParams,
}: PageProps) {
  return (
    <Suspense fallback={<CategoryPageLoading />}>
      <CategoryProductsContent
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
}

async function CategoryProductsContent({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const category = categories.find(
    (item) => item.slug === slug,
  );

  if (!category) {
    return (
      <main className="mx-auto min-h-64 max-w-7xl px-4 py-10">
        <h1 className="text-center text-xl font-bold text-gray-800">
          ক্যাটাগরি পাওয়া যায়নি
        </h1>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const categoryProducts = products.filter(
    (product) => product.category === category.slug,
  );

  const sort: SortOption =
    query.sort === "asc" || query.sort === "desc"
      ? query.sort
      : "default";

  const sortedProducts = [...categoryProducts];

  if (sort === "asc") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "desc") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="border-b border-green-100 pb-5">
        <p className="mb-2 text-sm text-green-700">
          <Link href="/" className="transition hover:underline">
            হোম
          </Link>
          {" / "}
          <span>ক্যাটাগরি</span>
          {" / "}
          <span>{category.nameBn}</span>
        </p>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {category.icon} {category.nameBn}
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-bold">
            {categoryProducts.length.toLocaleString("bn-BD")}
          </span>{" "}
          পণ্যের আজকের দাম ও পরিবর্তন।
        </p>
      </div>

      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-600 sm:text-base">
          মোট{" "}
          <span className="font-bold">
            {categoryProducts.length.toLocaleString("bn-BD")}
          </span>{" "}
          টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm font-medium text-gray-600">
            সাজান:
          </span>

          <CategorySorting selectedSort={sort} />
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-green-200 bg-white px-5 py-12 text-center">
          <div className="mb-3 text-4xl">
            {category.icon}
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            পরে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white transition hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </main>
  );
}
