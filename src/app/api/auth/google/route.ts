import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { requirePermission } from "@/lib/rbac";
import { getOAuth2Client } from "@/lib/google-calendar";

export async function GET(req: Request) {
  try {
    const auth = await requirePermission(req, "google.connect");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // Guard: ensure all required credentials are present
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
      console.error("[Google OAuth] Missing required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI");
      return NextResponse.redirect(new URL("/admin/settings?error=MissingGoogleConfig", req.url));
    }

    const client = getOAuth2Client();

    // Generate an OAuth URL — redirect_uri comes from GOOGLE_REDIRECT_URI env var
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ],
      prompt: "consent", // Force consent screen to always get a refresh token
    });

    // Redirect user to Google OAuth flow
    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error("Google Auth error:", error);
    return NextResponse.json({ error: "Failed to initialize Google Auth" }, { status: 500 });
  }
}
