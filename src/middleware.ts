import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";

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

  // Customer Portal — protect via custom JWT cookie
  if (pathname.startsWith("/customer/booking")) {
    const customerToken = req.cookies.get("bl_customer_session")?.value;
    if (!customerToken) {
      return NextResponse.redirect(new URL("/manage-booking", req.url));
    }
    
    try {
      const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only");
      const { payload } = await jwtVerify(customerToken, secretKey);
      
      // We can also extract the booking ID from the URL to ensure it matches the JWT
      // URL format: /customer/booking/[token]
      const pathSegments = pathname.split("/");
      const urlBookingId = pathSegments[pathSegments.length - 1]; // This works if it's the last segment
      
      // Let the page load if the JWT is valid. The API route will double check the exact booking ID match.
      if (!payload.bookingId) {
        throw new Error("Invalid JWT payload");
      }
    } catch (e) {
      // Token is invalid or expired
      const res = NextResponse.redirect(new URL("/manage-booking?error=expired", req.url));
      res.cookies.delete("bl_customer_session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*", "/login", "/customer/booking/:path*"],
};
