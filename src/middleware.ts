import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Admin routes — require login for any role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?from=admin", req.url));
    }
  }

  // Driver routes — redirect to login if not authenticated, or to /admin if logged in
  if (pathname.startsWith("/driver")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?from=driver", req.url));
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Login page — redirect to /admin if already logged in
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*", "/login"],
};
