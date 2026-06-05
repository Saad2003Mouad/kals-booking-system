import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// PATCH — update a ZIP code record
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requirePermission(req, "serviceAreas.update");
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const { city, county, isActive, notes } = body;

  try {
    const record = await prisma.serviceZipCode.update({
      where: { id: params.id },
      data: {
        ...(city !== undefined && { city: city.trim() }),
        ...(county !== undefined && { county: county?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Not found or failed to update" }, { status: 404 });
  }
}

// DELETE — delete a single ZIP code
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requirePermission(req, "serviceAreas.delete");
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await prisma.serviceZipCode.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
