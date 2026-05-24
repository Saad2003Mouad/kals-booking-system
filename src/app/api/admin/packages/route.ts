import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const role = req.headers.get("x-mock-user-role") || "OWNER";
    if (!["OWNER", "ADMIN"].includes(role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const packages = await prisma.package.findMany({
      orderBy: { sortOrder: "asc" }
    });

    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    console.error("Fetch admin packages error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const role = req.headers.get("x-mock-user-role") || "OWNER";
    if (!["OWNER", "ADMIN"].includes(role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    
    // Auto increment sortOrder if not provided
    if (!data.sortOrder) {
      const maxSort = await prisma.package.aggregate({ _max: { sortOrder: true } });
      data.sortOrder = (maxSort._max.sortOrder || 0) + 1;
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const newPkg = await prisma.package.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || "",
        serviceType: data.serviceType || "AMERICANO_TRUCK",
        price: parseFloat(data.price || "0"),
        servings: parseInt(data.servings || "0"),
        extraPiecePrice: parseFloat(data.extraPiecePrice || "0"),
        features: JSON.stringify(data.features || []),
        imageUrl: data.image || "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67dc601bc29781a5af163351_image-01-products-boston-legend-ice-cream-truck.webp",
        isActive: data.isActive !== false,
        sortOrder: data.sortOrder
      }
    });

    return NextResponse.json({ success: true, data: newPkg });
  } catch (error: any) {
    console.error("Create package error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
