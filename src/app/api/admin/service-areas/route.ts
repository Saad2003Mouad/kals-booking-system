import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET — list all service ZIP codes
export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "serviceAreas.view");
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const zips = await prisma.serviceZipCode.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ city: "asc" }, { zip: "asc" }],
  });

  return NextResponse.json({ data: zips, total: zips.length });
}

// POST — add a new ZIP code
export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "serviceAreas.create");
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const { zip, city, county, isActive, notes } = body;

  if (!zip || !city) {
    return NextResponse.json({ error: "zip and city are required" }, { status: 400 });
  }

  if (!/^\d{5}$/.test(zip.trim())) {
    return NextResponse.json({ error: "ZIP must be exactly 5 digits" }, { status: 400 });
  }

  try {
    const record = await prisma.serviceZipCode.create({
      data: {
        zip: zip.trim(),
        city: city.trim(),
        county: county?.trim() || null,
        isActive: isActive !== false,
        notes: notes?.trim() || null,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: `ZIP code ${zip} already exists` }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create ZIP code" }, { status: 500 });
  }
}

// DELETE — bulk delete by IDs
export async function DELETE(req: NextRequest) {
  const auth = await requirePermission(req, "serviceAreas.delete");
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  const { count } = await prisma.serviceZipCode.deleteMany({
    where: { id: { in: ids } },
  });

  return NextResponse.json({ deleted: count });
}
