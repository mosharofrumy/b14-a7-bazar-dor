
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/category";

interface CategoryNavLinkProps {
  category: Category;
}

export default function CategoryNavLink({
  category,
}: CategoryNavLinkProps) {
  const pathname = usePathname();
  const href = `/category/${category.slug}`;

  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex shrink-0 items-center gap-1 whitespace-nowrap
        rounded-lg px-3 py-2 text-sm font-semibold
        transition-colors duration-200
        ${
          isActive
            ? "bg-green-800 text-white shadow-sm hover:bg-green-700"
            : "text-gray-700 hover:bg-green-100 hover:text-green-700"
        }`}
    >
      <span>{category.icon}</span>
      <span>{category.nameBn}</span>
    </Link>
  );
}
