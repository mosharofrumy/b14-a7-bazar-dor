
import Link from "next/link";
import type { Product } from "@/types/product";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD").format(price);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);

const ProductCard = ({ product }: ProductCardProps) => {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  const percent = isFlat
    ? 0
    : Math.abs(product.change.pct);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block min-w-0 rounded-2xl border border-green-100 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-md sm:p-5"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
            {product.image || product.categoryIcon}
          </div>

          <h3 className="min-w-0 wrp-break-word font-semibold text-gray-900 transition-colors group-hover:text-green-700">
            {product.nameBn}
          </h3>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? (
            <ArrowUpRight size={14} />
          ) : isDown ? (
            <ArrowDownRight size={14} />
          ) : (
            <span aria-hidden="true">—</span>
          )}

          {formatPercent(percent)}%
        </span>
      </div>

      <div className="mt-4 flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-1 text-lg font-bold text-green-800 sm:text-xl">
            ৳{formatPrice(product.today)}
            <span className="ml-1 text-xs font-normal text-gray-500">
              /{" "}
              {product.unit === "kg"
                ? "প্রতি কেজি"
                : product.unit === "litre"
                  ? "প্রতি লিটার"
                  : product.unit === "dozen"
                    ? "প্রতি ডজন"
                    : product.unit === "piece"
                      ? "প্রতি পিস"
                      : product.unit}
            </span>
          </p>
        </div>

        <span className="shrink-0 text-right text-xs text-gray-400">
          গতকাল ৳{formatPrice(product.yesterday)}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
