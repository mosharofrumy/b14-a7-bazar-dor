import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import OAuthToastHandler from "@/components/OAuthToastHandler";
import "./globals.css";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
  display: "swap",
  variable: "--font-noto-serif-bengali",
});

export const metadata: Metadata = {
  title: {
    default: "আজকের বাজার-দর",
    template: "%s | আজকের বাজার-দর",
  },
  description:
    "বাংলাদেশের চাল, ডাল, তেল, সবজি, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর দেখুন এক জায়গায়।",
  applicationName: "আজকের বাজার-দর",
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="bn" 
    data-theme="light" 
    data-scroll-behavior="smooth"
    className={notoSerifBengali.className}>
      <body className="flex min-h-screen flex-col bg-green-50/50 antialiased">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />

        <OAuthToastHandler />

        <Suspense fallback={null}>
          <Header />
        </Suspense>

        <Suspense
          fallback={<div className="h-10 border-y border-gray-200 bg-white" />}
        >
          <Marquee />
        </Suspense>

        <main className="w-full flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
