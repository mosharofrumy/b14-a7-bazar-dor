
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    const signInUrl = new URL("/signin", request.url);

    const callbackURL =
      request.nextUrl.pathname + request.nextUrl.search;

    signInUrl.searchParams.set("callbackURL", callbackURL);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*"],
};
