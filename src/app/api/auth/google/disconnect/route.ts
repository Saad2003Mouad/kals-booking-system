import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const auth = await requirePermission(req, "settings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // Delete tokens from settings
    await prisma.setting.deleteMany({
      where: {
        key: {
          in: ["google_calendar_refresh_token", "google_calendar_access_token"]
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Google Auth Disconnect error:", error);
    return NextResponse.json({ error: "Failed to disconnect Google Account" }, { status: 500 });
  }
}
