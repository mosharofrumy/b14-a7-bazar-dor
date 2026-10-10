"use client";

import Link from 'next/link';
import { authClient } from "@/lib/auth-client";
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const SignUpPage = () => {
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast.error("পাসওয়ার্ড দুটি মিলছে না!");
            return;
        }

        const loadingToast = toast.loading("অ্যাকাউন্ট তৈরি হচ্ছে...");

        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/", 
        });
     
        toast.dismiss(loadingToast);

        if (data) {
            toast.success("সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!");
        }
        
        if (error) {
            toast.error(error.message || "সাইন আপ করতে সমস্যা হয়েছে!");
        }
    };

    const handleGoogleSignUp = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    const handleGithubSignUp = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
        });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 px-4 py-5">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        অ্যাকাউন্ট তৈরি করুন
                    </h1>
                    <p className="text-sm text-gray-600">
                        বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-left">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                নাম
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="যেমন: রহিম উদ্দিন / Rahim Uddin"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                ইমেইল
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                পাসওয়ার্ড
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="কমপক্ষে ৮ অক্ষর"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                পাসওয়ার্ড নিশ্চিত করুন
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                placeholder="পাসওয়ার্ড টি আবার লিখুন"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 mt-2"
                        >
                            অ্যাকাউন্ট তৈরি করুন
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-500 font-medium">অথবা</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-200"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            Google দিয়ে চালিয়ে যান
                        </button>

                        <button
                            type="button"
                            onClick={handleGithubSignUp}
                            className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-200"
                        >
                            <svg className="h-4 w-4 fill-current text-gray-900" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub দিয়ে চালিয়ে যান
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        অ্যাকাউন্ট আছে?{" "}
                        <Link
                            href="/signin"
                            className="font-semibold text-green-700 hover:underline"
                        >
                            সাইন ইন করুন
                        </Link>
                    </div>
                </div>

                <div>
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;