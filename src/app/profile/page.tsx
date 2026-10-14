
"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [session, isPending, router]);

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না!");
      return;
    }

    if (name.trim() === session?.user?.name) {
      toast.error("কোনো পরিবর্তন করা হয়নি!");
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading("নাম আপডেট হচ্ছে...");

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "নাম পরিবর্তন করতে সমস্যা হয়েছে!");
        return;
      }

      toast.success("নাম সফলভাবে পরিবর্তন হয়েছে!");
      router.refresh();
    } catch {
      toast.error("একটি সমস্যা হয়েছে, আবার চেষ্টা করুন!");
    } finally {
      toast.dismiss(loadingToast);
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    const loadingToast = toast.loading("সাইন আউট হচ্ছে...");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("সাইন আউট করতে সমস্যা হয়েছে!");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছেন!", {
        duration: 2500,
      });

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে!");
    } finally {
      toast.dismiss(loadingToast);
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="font-medium text-gray-500">
          প্রোফাইল লোড হচ্ছে...
        </div>
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;

  const userInitial = user.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  const hasValidImage =
    !!user.image && user.image.trim() !== "" && !imageError;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          আমার প্রোফাইল
        </h1>

        <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6">
          {hasValidImage ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200">
              <Image
                src={user.image!}
                alt={user.name || "User Avatar"}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-800 bg-emerald-700 text-2xl font-bold text-white shadow-inner">
              {userInitial}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="mb-6">
          <label
            htmlFor="userName"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            নাম (পরিবর্তনযোগ্য)
          </label>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row">
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={isUpdating}
              className="whitespace-nowrap rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "নাম পরিবর্তন করুন"}
            </button>
          </div>
        </form>

        <div className="space-y-4 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between border-b border-gray-100 py-2">
            <span className="font-medium text-gray-600">
              ইমেইল ভেরিফাইড:
            </span>
            <span className="text-gray-900">
              {user.emailVerified ? "হ্যাঁ" : "না"}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-600">
              অ্যাকাউন্ট তৈরি করা হয়েছে:
            </span>
            <span className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString("bn-BD")}
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4">
          <Link
            href="/"
            className="inline-block rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট করুন"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
