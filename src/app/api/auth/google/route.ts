import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { getOAuth2Client } from "@/lib/google-calendar";

export async function GET(req: Request) {
  try {
    const auth = await requirePermission(req, "google.connect");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const client = getOAuth2Client(req.url);
    
    // Generate an OAuth URL
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
