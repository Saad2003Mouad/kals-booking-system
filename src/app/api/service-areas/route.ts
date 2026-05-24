import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SERVICE_AREAS } from "@/lib/serviceAreas";

export const dynamic = "force-dynamic";

/**
 * Public endpoint — returns active service area ZIP codes for the booking form.
 * Falls back to static list if DB is empty.
 */
export async function GET(req: NextRequest) {
  try {
    const zips = await prisma.serviceZipCode.findMany({
      where: { isActive: true },
      select: { zip: true, city: true },
      orderBy: [{ city: "asc" }, { zip: "asc" }],
    });

    // Fallback: if DB is empty, return static list
    const data = zips.length > 0 ? zips : SERVICE_AREAS.map(a => ({ zip: a.zip, city: a.city }));

    return NextResponse.json({ data, total: data.length, source: zips.length > 0 ? "db" : "static" });
  } catch {
    // If DB query fails entirely, return static list
    return NextResponse.json({
      data: SERVICE_AREAS.map(a => ({ zip: a.zip, city: a.city })),
      total: SERVICE_AREAS.length,
      source: "static"
    });
  }
}
