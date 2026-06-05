import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { SERVICE_AREAS } from "@/lib/serviceAreas";

export const dynamic = "force-dynamic";

// POST — seed ZIP codes from static list (upsert, idempotent)
export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "serviceAreas.create");
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let created = 0;
  let skipped = 0;

  for (const area of SERVICE_AREAS) {
    try {
      await prisma.serviceZipCode.upsert({
        where: { zip: area.zip },
        create: { zip: area.zip, city: area.city, isActive: true },
        update: {},
      });
      created++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({
    message: `Seed complete. ${created} ZIP codes upserted, ${skipped} errors.`,
    total: SERVICE_AREAS.length,
  });
}
