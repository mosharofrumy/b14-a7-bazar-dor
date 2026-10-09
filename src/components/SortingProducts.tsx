"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, ChevronDown, Check } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface SortableProductSectionProps {
  products: Product[];
}

const SortingProducts = ({
  products,
}: SortableProductSectionProps) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { label: "ডিফল্ট", value: "default" },
    { label: "দাম কম থেকে বেশি", value: "asc" },
    { label: "দাম বেশি থেকে কম", value: "desc" },
  ];

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortOrder === "asc") {
      return result.sort((a, b) => a.today - b.today);
    }

    if (sortOrder === "desc") {
      return result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortOrder]);

  const selectedOption = sortOptions.find(
    (option) => option.value === sortOrder,
  );

  return (
    <section className="py-7 sm:py-9">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
            <span className="text-green-700">
              <ShoppingCart size={24} />
            </span>
            সব পণ্য
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            মোট{" "}
            {new Intl.NumberFormat("bn-BD").format(products.length)}
            টি পণ্যের বাজারদর
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <span className="shrink-0 text-sm font-medium text-gray-700">
            সাজান
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className="flex min-w-48 items-center justify-between gap-3 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <span>{selectedOption?.label}</span>

              <ChevronDown
                size={16}
                className={`shrink-0 text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div
                role="listbox"
                aria-label="পণ্য সাজানোর পদ্ধতি"
                className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg"
              >
                {sortOptions.map((option) => {
                  const isSelected = sortOrder === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortOrder(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-green-50 font-semibold text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{option.label}</span>

                      {isSelected && (
                        <Check
                          size={17}
                          strokeWidth={2.5}
                          className="shrink-0 text-green-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-green-200 bg-white p-8 text-center text-gray-500">
          এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </div>
      )}
    </section>
  );
};

export default SortingProducts;
