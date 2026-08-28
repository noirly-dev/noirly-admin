import { NextRequest, NextResponse } from "next/server";
import { verifySession, getSessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("noirly_admin_session")?.value;
    const ok = token ? await verifySession(token) : false;

    if (!ok) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname === "/login") {
    const token = request.cookies.get("noirly_admin_session")?.value;
    const ok = token ? await verifySession(token) : false;
    if (ok) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
