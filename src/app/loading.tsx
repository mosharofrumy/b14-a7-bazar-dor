
import { ShoppingBasket } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-green-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
            <ShoppingBasket
              size={46}
              strokeWidth={1.6}
              className="text-green-700"
            />
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          তথ্য আনা হচ্ছে...
        </h1>

        <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-gray-500 sm:text-base">
          আপনার জন্য বাজারের সর্বশেষ দামগুলো নিয়ে আসছি।
          অনুগ্রহ করে একটু অপেক্ষা করুন।
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-green-700 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-green-600 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-green-400" />
        </div>
      </div>
    </main>
  );
}