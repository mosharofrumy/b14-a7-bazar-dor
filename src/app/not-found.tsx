
import Link from "next/link";
import { House, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-green-50 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-green-100 bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        {/* 404 Illustration */}
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-green-50 sm:h-44 sm:w-44">
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-green-200" />

          <SearchX
            size={76}
            strokeWidth={1.4}
            className="text-green-700 sm:h-20 sm:w-20"
          />

          <span className="absolute -right-2 top-3 rounded-xl bg-green-700 px-3 py-1.5 text-lg font-bold text-white shadow-sm">
            404
          </span>
        </div>

        {/* Error Message */}
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
          Page Not Found
        </p>

        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          দুঃখিত! পৃষ্ঠা খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে,
          অথবা ঠিকানাটি ভুল হতে পারে। চলুন, আবার বাজার-দরের
          হোমপেজ থেকে শুরু করি।
        </p>

        {/* Back Home Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <House size={19} />
            হোমে ফিরে যান
          </Link>
        </div>

      </div>
    </main>
  );
}
