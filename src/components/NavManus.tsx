import Link from "next/link";
import React from "react";

interface Navs {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavManus = async () => {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories",
    {
      next: {
        revalidate: 86400,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const navs: Navs[] = await res.json();

  return (
    <nav className="w-full border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start gap-2 overflow-x-auto py-2 md:gap-4">
          {navs.map((n) => (
            <Link
              key={n.id || n.slug}
              href={`/category/${n.slug}`}
              className="flex shrink-0 items-center font-semibold gap-1 whitespace-nowrap rounded px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-300 hover:border-gray-200"
            >
              <span>{n.icon}</span>
              <span>{n.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavManus;
