
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { Product } from "@/types/product";
import { fetchFromAPI } from "@/lib/api";

const REVALIDATE_TIME = 3600;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);

const formatUnit = (unit: string) =>
  (
    ({
      kg: "কেজি",
      litre: "লিটার",
      dozen: "ডজন",
      piece: "পিস",
    }) as Record<string, string>
  )[unit.toLowerCase()] ?? unit;

function getArrayFromResponse(data: unknown): Product[] {
  if (Array.isArray(data)) {
    return data as Product[];
  }

  if (typeof data !== "object" || data === null) {
    throw new Error("API থেকে সঠিক পণ্যের তথ্য পাওয়া যায়নি।");
  }

  if ("data" in data && Array.isArray(data.data)) {
    return data.data as Product[];
  }

  if ("products" in data && Array.isArray(data.products)) {
    return data.products as Product[];
  }

  throw new Error("API থেকে সঠিক পণ্যের তথ্য পাওয়া যায়নি।");
}

async function getProduct(slug: string): Promise<Product | null> {
  const data = await fetchFromAPI<unknown>(
    "/products",
    REVALIDATE_TIME,
  );

  const products = getArrayFromResponse(data);

  return (
    products.find((product) => product.slug === slug) ?? null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "পণ্য পাওয়া যায়নি | আজকের বাজার-দর",
      description: "পণ্যের তথ্য পাওয়া যায়নি।",
    };
  }

  return {
    title: `${product.nameBn} এর আজকের দাম | আজকের বাজার-দর`,
    description: `${product.nameBn} এর আজকের দাম ও বাজারভিত্তিক মূল্য দেখুন।`,
  };
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const markets = product.markets ?? [];

  const prices = markets.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const lowest = prices.length
    ? Math.min(...prices)
    : product.today;

  const highest = prices.length
    ? Math.max(...prices)
    : product.today;

  const average = markets.length
    ? markets.reduce(
        (sum, market) => sum + (market.min + market.max) / 2,
        0,
      ) / markets.length
    : product.today;

  const difference = Math.abs(
    product.today - product.yesterday,
  );

  const changeDirection = product.change?.dir ?? "same";
  const changePercent = Math.abs(product.change?.pct ?? 0);

  const isUp = changeDirection === "up";
  const isDown = changeDirection === "down";

  const cards = [
    {
      label: "সর্বনিম্ন দাম",
      value: lowest,
      color: "text-emerald-600",
    },
    {
      label: "সর্বাধিক দাম",
      value: highest,
      color: "text-red-500",
    },
    {
      label: "গড় দাম",
      value: average,
      color: "text-green-700",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap gap-2 text-sm text-gray-500"
      >
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>

        <span>/</span>

        <Link
          href={`/category/${product.category}`}
          className="hover:text-green-700"
        >
          {product.categoryNameBn}
        </Link>

        <span>/</span>

        <span className="font-semibold text-gray-900">
          {product.nameBn}
        </span>
      </nav>

      {/* Product Summary */}
      <section className="grid gap-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-4xl">
            {product.image || "🛒"}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              প্রতি {formatUnit(product.unit)} ·{" "}
              {product.categoryNameBn}
            </p>

            <p className="mt-3 text-sm text-gray-600">
              গতকালের তুলনায় দাম{" "}
              <span
                className={`font-bold ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-emerald-600"
                      : "text-gray-500"
                }`}
              >
                {isUp
                  ? "বেড়েছে"
                  : isDown
                    ? "কমেছে"
                    : "একই আছে"}
              </span>

              {difference > 0 &&
                ` · ${formatNumber(difference)} টাকা`}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-center md:min-w-48">
          <p className="text-sm text-gray-500">আজকের দাম</p>

          <p className="my-2 text-3xl font-black text-gray-900">
            {formatNumber(product.today)}
          </p>

          <p className="text-xs text-gray-500">
            টাকা / {formatUnit(product.unit)}
          </p>

          {/* Price Change Badge */}
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
              isUp
                ? "bg-red-100 text-red-700"
                : isDown
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
            {formatPercent(changePercent)}%
          </span>
        </div>
      </section>

      {/* Price Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {card.label}
              </p>

              <p className={`mt-2 text-2xl font-black ${card.color}`}>
                {formatNumber(card.value)}{" "}
                <span className="text-sm">টাকা</span>
              </p>

              <p className="mt-2 text-xs text-gray-400">
                প্রতি {formatUnit(product.unit)} হিসাবে
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Market Prices */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-155 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                {[
                  "বাজার",
                  "বিভাগ",
                  "সর্বনিম্ন",
                  "সর্বাধিক",
                  "গড়",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {markets.map((market, index) => (
                <tr
                  key={`${market.market}-${market.division}-${index}`}
                  className="hover:bg-green-50/50"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    {market.market}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {market.division}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {formatNumber(market.min)} টাকা
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {formatNumber(market.max)} টাকা
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-bold">
                    {formatNumber(
                      (market.min + market.max) / 2,
                    )}{" "}
                    টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {markets.length === 0 && (
            <p className="p-8 text-center text-sm text-gray-500">
              বাজারের তথ্য পাওয়া যায়নি।
            </p>
          )}
        </div>

        {/* Back to Category */}
        <Link
          href={`/category/${product.category}`}
          className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-all hover:border-green-600 hover:bg-green-600 hover:text-white"
        >
          <span>{product.categoryIcon}</span>
          <span>
            {product.categoryNameBn} ক্যাটাগরিতে ফিরে যান
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="min-h-screen bg-gray-300 py-6 sm:py-8">
      <Suspense
        fallback={
          <p className="py-12 text-center text-gray-500">
            লোড হচ্ছে...
          </p>
        }
      >
        <ProductContent params={params} />
      </Suspense>
    </main>
  );
}
