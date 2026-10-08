import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import NavManus from "./NavManus";

const date = new Date().toLocaleDateString("bn-BD", {
  dateStyle: "full",
});

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 shadow-sm">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-2xl font-bold">বাজার দর</h1>
              <div className="text-sm text-gray-700">{date}</div>
            </div>
          </Link>
          <div className="flex items-center justify-end gap-2">
            <button className="rounded px-5 py-2 font-semibold hover:bg-gray-300">
              সাইন ইন
            </button>

            <button className="rounded bg-green-700 px-5 py-2 font-semibold text-white hover:bg-green-800">
              সাইন আপ
            </button>
          </div>
        </div>
      </div>

      <NavManus />
    </header>
  );
};

export default Header;
