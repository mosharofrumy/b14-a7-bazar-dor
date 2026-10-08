"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const  OAuthToastHandler = () =>{
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    const toastType = sessionStorage.getItem("oauth-toast");

    if (toastType !== "signin") return;

    sessionStorage.removeItem("oauth-toast");

    if (session?.user) {
      toast.success("সফলভাবে সাইন ইন করেছেন!");
    } else {
      toast.error("সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
    }
  }, [session, isPending]);

  return null;
}
export default OAuthToastHandler;