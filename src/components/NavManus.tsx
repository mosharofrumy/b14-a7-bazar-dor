
// import type { Category } from "@/types/category";
// import CategoryNavLink from "@/components/CategoryNavLink";

// const NavManus = async () => {
//   const res = await fetch(
//     "https://api.abcz.workers.dev/api/bazardor/categories",
//     {
//       next: {
//         revalidate: 86400,
//       },
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch categories");
//   }

//   const navs: Category[] = await res.json();

//   return (
//     <nav
//       aria-label="পণ্যের ক্যাটাগরি"
//       className="w-full border-t border-gray-100"
//     >
//       <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-6">
//         <div className="flex items-center justify-start gap-2 overflow-x-auto py-2 md:gap-3">
//           {navs.map((category) => (
//             <CategoryNavLink
//               key={category.id || category.slug}
//               category={category}
//             />
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavManus;


import type { Category } from "@/types/category";
import CategoryNavLink from "@/components/CategoryNavLink";
import { fetchFromAPI } from "@/lib/api";

const NavManus = async () => {
  const data = await fetchFromAPI<
    Category[] | { data: Category[] }
  >("/categories", 86400);

  const navs: Category[] = Array.isArray(data)
    ? data
    : data.data;

  if (!Array.isArray(navs)) {
    throw new Error("API থেকে সঠিক ক্যাটাগরির তথ্য পাওয়া যায়নি।");
  }

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="w-full border-t border-gray-100"
    >
      <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-start gap-2 overflow-x-auto py-2 md:gap-3">
          {navs.map((category) => (
            <CategoryNavLink
              key={category.id || category.slug}
              category={category}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavManus;

