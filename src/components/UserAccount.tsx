"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const UserAccount = () => {
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200"></div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-end gap-2">
        <Link
          href="/signin"
          className="rounded px-5 py-2 font-semibold hover:bg-gray-100 transition"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="rounded bg-green-700 px-5 py-2 font-semibold text-white hover:bg-green-800 transition"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleSignOut = async () => {
    const loadingToast = toast.loading("সাইন আউট হচ্ছে...");

    try {
      await authClient.signOut();

      toast.dismiss(loadingToast);
      toast.success("সফলভাবে সাইন আউট হয়েছেন!");

      setIsOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে!");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-2 pr-3.5 shadow-sm hover:bg-gray-50 transition focus:outline-none"
      >
        
        {user.image && user.image.trim() !== "" ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover border border-gray-300"
            unoptimized
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
            {userInitial}
          </div>
        )}
        <span className="text-sm font-semibold text-gray-800 max-w-30 truncate">
          {user.name}
        </span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500">স্বাগতম,</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user.name}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            আমার প্রোফাইল
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleSignOut();
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-100"
          >
            সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
