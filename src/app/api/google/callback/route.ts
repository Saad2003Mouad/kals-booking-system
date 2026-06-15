import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { getOAuth2Client } from "@/lib/google-calendar";

/**
 * Google OAuth Callback
 * This route is registered in Google Cloud Console as:
 *   https://www.bostonlegendicecreamtruck.com/api/google/callback
 *
 * GOOGLE_REDIRECT_URI must equal this URL exactly.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    // User denied consent
    if (error) {
      console.error("[Google OAuth Callback] Error from Google:", error);
      return NextResponse.redirect(new URL("/admin/settings?error=GoogleDenied", req.url));
    }

    if (!code) {
      console.error("[Google OAuth Callback] No authorization code received");
      return NextResponse.redirect(new URL("/admin/settings?error=NoCode", req.url));
    }

    const client = getOAuth2Client();
    const { tokens } = await client.getToken(code);

    console.log("[Google OAuth Callback] Tokens received:", {
      has_access_token: !!tokens.access_token,
      has_refresh_token: !!tokens.refresh_token,
      expires_at: tokens.expiry_date,
    });

    if (tokens.refresh_token) {
      await prisma.setting.upsert({
        where: { key: "google_calendar_refresh_token" },
        update: { value: tokens.refresh_token },
        create: { key: "google_calendar_refresh_token", value: tokens.refresh_token },
      });
    }

    if (tokens.access_token) {
      await prisma.setting.upsert({
        where: { key: "google_calendar_access_token" },
        update: { value: tokens.access_token },
        create: { key: "google_calendar_access_token", value: tokens.access_token },
      });
    }

    // Redirect back to admin settings showing success
    return NextResponse.redirect(new URL("/admin/settings?success=GoogleConnected", req.url));
  } catch (error: any) {
    console.error("[Google OAuth Callback] Token exchange error:", error?.message || error);
    return NextResponse.redirect(new URL("/admin/settings?error=AuthFailed", req.url));
  }
}
