
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

type SortOption = "default" | "asc" | "desc";

interface CategorySortDropdownProps {
  selectedSort: SortOption;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
];

export default function CategorySorting({
  selectedSort,
}: CategorySortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentSort, setCurrentSort] =
    useState<SortOption>(selectedSort);

  useEffect(() => {
    setCurrentSort(selectedSort);
  }, [selectedSort]);

  // বাইরে ক্লিক করলে অথবা Escape চাপলে ড্রপডাউন বন্ধ হবে
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSortChange(value: SortOption) {
    setCurrentSort(value);
    setIsOpen(false);

    const params = new URLSearchParams();
    if (value !== "default") {
      params.set("sort", value);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${pathname}?${queryString}`
      : pathname;

    router.push(url, { scroll: false });
  }

  const selectedOption =
    SORT_OPTIONS.find((option) => option.value === currentSort) ??
    SORT_OPTIONS[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex min-w-52 items-center justify-between gap-3 rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:border-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
      >
        <span>{selectedOption.label}</span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-500 transition-transform duration-200 ${
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
          {SORT_OPTIONS.map((option) => {
            const isSelected = currentSort === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSortChange(option.value)}
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
  );
}
