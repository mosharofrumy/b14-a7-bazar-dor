
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

const Banner = async () => {
  await connection();

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
    <section className="w-full bg-green-50 py-2 sm:py-3">
      <div className="mx-auto max-w-6xl overflow-hidden border-y border-green-100 bg-white shadow-sm sm:rounded-2xl sm:border">
        <div className="grid grid-cols-1 items-center gap-4 px-2 py-2 sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
          {/* Banner Content */}
          <div className="order-1 min-w-0">
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 sm:text-sm">
              {date}
            </span>

            <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="mt-4">
              <Link
                href="#products"
                className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
              >
                সব পণ্য দেখুন
              </Link>
            </div>
          </div>

          {/* Banner Image */}
          <div className="order-2 flex min-w-0 items-center justify-center sm:justify-end">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের পণ্য"
              width={400}
              height={300}
              priority
              className="h-auto w-full max-w-60 object-contain sm:max-w-70 md:max-w-[320px]"
              sizes="(max-width: 639px) 240px, (max-width: 767px) 280px, 320px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
