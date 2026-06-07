import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check packages.update permission
    let auth = await requirePermission(req, "packages.update");
    if (!auth.success) {
      // If that fails, check packages.create permission
      auth = await requirePermission(req, "packages.create");
      if (!auth.success) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 });
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // Clean name and set filename path
    const ext = file.name.split(".").pop() || "jpg";
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const filename = `packages/${Date.now()}-${cleanName}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url
    });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
