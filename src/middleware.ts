import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Admin routes — require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login?from=admin", req.url));
    if ((token as any).role !== "ADMIN") return NextResponse.redirect(new URL("/driver", req.url));
  }

  // Driver routes — require DRIVER role
  if (pathname.startsWith("/driver")) {
    if (!token) return NextResponse.redirect(new URL("/login?from=driver", req.url));
    if ((token as any).role !== "DRIVER") return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Login page — redirect if already logged in
  if (pathname === "/login" && token) {
    const dest = (token as any).role === "ADMIN" ? "/admin" : "/driver";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*", "/login"],
};
