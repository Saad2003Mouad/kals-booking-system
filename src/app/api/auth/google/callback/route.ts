import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOAuth2Client } from "@/lib/google-calendar";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/admin/settings?error=NoCode", req.url));
    }

    const client = getOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (tokens.refresh_token) {
      await prisma.setting.upsert({
        where: { key: "google_calendar_refresh_token" },
        update: { value: tokens.refresh_token },
        create: { key: "google_calendar_refresh_token", value: tokens.refresh_token }
      });
    }

    if (tokens.access_token) {
      await prisma.setting.upsert({
        where: { key: "google_calendar_access_token" },
        update: { value: tokens.access_token },
        create: { key: "google_calendar_access_token", value: tokens.access_token }
      });
    }

    // Redirect back to admin settings on success
    return NextResponse.redirect(new URL("/admin/settings?success=GoogleConnected", req.url));
  } catch (error: any) {
    console.error("Google Auth Callback error:", error);
    return NextResponse.redirect(new URL("/admin/settings?error=AuthFailed", req.url));
  }
}
