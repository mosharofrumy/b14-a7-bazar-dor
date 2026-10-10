import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import NavManus from "./NavManus";
import UserAccount from "./UserAccount";

const Header = async () => {
  await connection();

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 shadow-sm">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-2xl font-bold">বাজার দর</h1>
              <div className="text-sm text-gray-700">{date}</div>
            </div>
          </Link>
          <UserAccount />
        </div>
      </div>
      <NavManus />
    </header>
  );
};

export default Header;
