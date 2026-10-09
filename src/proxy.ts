
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // ব্যবহারকারী সাইন ইন না করলে
  if (!session?.user) {
    const signInUrl = new URL("/signin", request.url);

    // ব্যবহারকারী যে পেজটি খুলতে চেয়েছিল
    const callbackURL =
      request.nextUrl.pathname + request.nextUrl.search;

    signInUrl.searchParams.set("callbackURL", callbackURL);

    return NextResponse.redirect(signInUrl);
  }

  // সাইন ইন করা থাকলে অনুরোধ চালিয়ে যাবে
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*"],
};
