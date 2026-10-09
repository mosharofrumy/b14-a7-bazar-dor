"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // সেশন লোড হলে ইনপুট বক্সে ইউজারের বর্তমান নাম সেট করা
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // যদি ইউজার লগইন না থাকে তবে সাইন-ইন পেজে রিডাইরেক্ট করা
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  // নাম আপডেট করার হ্যান্ডলার
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না!");
      return;
    }

    if (name === session?.user?.name) {
      toast.error("কোনো পরিবর্তন করা হয়নি!");
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading("নাম আপডেট হচ্ছে...");

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      toast.dismiss(loadingToast);

      if (error) {
        toast.error(error.message || "নাম পরিবর্তন করতে সমস্যা হয়েছে!");
      } else {
        toast.success("নাম সফলভাবে পরিবর্তন হয়েছে!");
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("একটি সমস্যা হয়েছে, আবার চেষ্টা করুন!");
    } finally {
      setIsUpdating(false);
    }
  };

  // সাইন আউট হ্যান্ডলার
  const handleSignOut = async () => {
    const loadingToast = toast.loading("সাইন আউট হচ্ছে...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success("সফলভাবে সাইন আউট হয়েছেন!");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("সাইন আউট করতে সমস্যা হয়েছে!");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-gray-500 font-medium">প্রোফাইল লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;
  const userInitial = user.name ? user.name.trim().charAt(0).toUpperCase() : "U";
  const hasValidImage = user.image && user.image.trim() !== "" && !imageError;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* টোস্ট নোটিফিকেশন */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          আমার প্রোফাইল
        </h1>

        {/* ইউজার কার্ড (ছবি, নাম ও ইমেইল) */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white shadow-inner border border-emerald-800">
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

        {/* এডিটেবল নেম ফিল্ড ও আপডেট বাটন */}
        <form onSubmit={handleUpdateName} className="mb-6">
          <label
            htmlFor="userName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            নাম (পরিবর্তনযোগ্য)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
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
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-50 whitespace-nowrap"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "নাম পরিবর্তন করুন"}
            </button>
          </div>
        </form>

        {/* অন্যান্য তথ্য */}
        <div className="space-y-4 text-sm pt-4 border-t border-gray-100">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="font-medium text-gray-600">ইমেইল ভেরিফাইড:</span>
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

        {/* নিচের নেভিগেশন ও লগআউট বাটন */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="inline-block rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <button
            onClick={handleSignOut}
            className="rounded-lg bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition border border-red-200"
          >
            সাইন আউট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;