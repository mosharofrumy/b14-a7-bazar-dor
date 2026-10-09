// import { Suspense } from "react";
// import Link from "next/link";
// import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

// import Banner from "@/components/Banner";
// import ProductCard from "@/components/ProductCard";
// import type { Product } from "@/types/product";
// import SortingProducts from "@/components/SortingProducts";

// const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

// async function getProducts(): Promise<Product[]> {
//   const res = await fetch(API_URL, {
//     next: { revalidate: 3600 },
//   });

//   if (!res.ok) {
//     throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
//   }

//   const data = await res.json();

//   const products = Array.isArray(data) ? data : data.data;

//   if (!Array.isArray(products)) {
//     throw new Error("API থেকে সঠিক পণ্যের তথ্য পাওয়া যায়নি।");
//   }

//   return products;
// }

// interface ProductSectionProps {
//   title: string;
//   products: Product[];
//   icon: React.ReactNode;
//   description: string;
//   viewAll?: boolean;
// }

// function ProductSection({
//   title,
//   products,
//   icon,
//   description,
//   viewAll = false,
// }: ProductSectionProps) {
//   return (
//     <section className="py-7 sm:py-9">
//       <div className="mb-5 flex items-center justify-between gap-3">
//         <div>
//           <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
//             <span className="text-green-700">{icon}</span>
//             {title}
//           </h2>
//           <p className="mt-1 text-sm text-gray-500">{description}</p>
//         </div>

//         {viewAll && (
//           <Link
//             href="/products"
//             className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900"
//           >
//             সব দেখুন <ArrowRight size={16} />
//           </Link>
//         )}
//       </div>

//       {products.length > 0 ? (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <div className="rounded-xl border border-dashed border-green-200 bg-white p-8 text-center text-gray-500">
//           এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
//         </div>
//       )}
//     </section>
//   );
// }

// export default async function Home() {
//   const products = await getProducts();

//   const increasedProducts = products
//     .filter((product) => product.change.dir === "up")
//     .sort((a, b) => b.change.pct - a.change.pct)
//     .slice(0, 6);

//   const decreasedProducts = products
//     .filter((product) => product.change.dir === "down")
//     .sort((a, b) => a.change.pct - b.change.pct)
//     .slice(0, 6);

//   return (
//     <main className="min-h-screen bg-green-50/50">
      

//       <Suspense
//         fallback={<div className="h-20 border-b border-green-100 bg-white" />}
//       >
//         <Banner />
//       </Suspense>

//       <div className="mx-auto max-w-6xl px-2 py-2 ">
//         <ProductSection
//           title="আজ দাম বেড়েছে"
//           products={increasedProducts}
//           icon={<TrendingUp size={24} />}
//           description="যেসব পণ্যের দাম গতকালের তুলনায় বেড়েছে"
//         />

//         <ProductSection
//           title="আজ দাম কমেছে"
//           products={decreasedProducts}
//           icon={<TrendingDown size={24} />}
//           description="যেসব পণ্যের দাম গতকালের তুলনায় কমেছে"
//         />

//         <div id="products" className="scroll-mt-24">
//           <SortingProducts products={products} />
//         </div>
//       </div>
//     </main>
//   );
// }


import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import SortingProducts from "@/components/SortingProducts";

import type { Product } from "@/types/product";
import { fetchFromAPI } from "@/lib/api";

async function getProducts(): Promise<Product[]> {
  const data = await fetchFromAPI<
    Product[] | { data: Product[] }
  >("/products", 3600);

  const products = Array.isArray(data) ? data : data.data;

  if (!Array.isArray(products)) {
    throw new Error("API থেকে সঠিক পণ্যের তথ্য পাওয়া যায়নি।");
  }

  return products;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  icon: React.ReactNode;
  description: string;
  viewAll?: boolean;
}

function ProductSection({
  title,
  products,
  icon,
  description,
  viewAll = false,
}: ProductSectionProps) {
  return (
    <section className="py-7 sm:py-9">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
            <span className="text-green-700">{icon}</span>
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>

        {viewAll && (
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900"
          >
            সব দেখুন <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
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
}

export default async function Home() {
  const products = await getProducts();

  const increasedProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const decreasedProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-green-50/50">
      <Suspense
        fallback={
          <div className="h-20 border-b border-green-100 bg-white" />
        }
      >
        <Banner />
      </Suspense>

      <div className="mx-auto max-w-6xl px-2 py-2">
        <ProductSection
          title="আজ দাম বেড়েছে"
          products={increasedProducts}
          icon={<TrendingUp size={24} />}
          description="যেসব পণ্যের দাম গতকালের তুলনায় বেড়েছে"
        />

        <ProductSection
          title="আজ দাম কমেছে"
          products={decreasedProducts}
          icon={<TrendingDown size={24} />}
          description="যেসব পণ্যের দাম গতকালের তুলনায় কমেছে"
        />

        <div id="products" className="scroll-mt-24">
          <SortingProducts products={products} />
        </div>
      </div>
    </main>
  );
}
