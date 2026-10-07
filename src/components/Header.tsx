import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="p-2 border-b-gray-400">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* লুসিড আইকন লোগো, টেক্সট ও ডায়নামিক ডেট */}
        <Link href="/" className="flex items-center gap-3 justify-center"> 
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold">বাজার দর</h1>
            <div className="text-sm text-gray-700">{date}</div>
          </div>
        </Link>

        {/*সাইন ইন ও সাইন আপ বাটন */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <button className="btn font-semibold  rounded hover:bg-gray-300 px-5 py-2">
            সাইন ইন
          </button>
          <button className="btn font-semibold rounded bg-green-700 text-white hover:bg-green-800 px-5 py-2">
            সাইন আপ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
