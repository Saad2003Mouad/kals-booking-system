import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "drivers.view");
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const vehicles = await prisma.vehicle.findMany({
      orderBy: { code: "asc" },
      include: {
        assignments: {
          where: {
            jobStatus: { in: ["PENDING", "ON_THE_WAY", "ARRIVED"] }
          },
          include: {
            driver: true,
            booking: true
          },
          take: 1
        }
      }
    });

    const mapped = vehicles.map(v => {
      const active = v.assignments[0];
      return {
        id: v.id,
        code: v.code,
        name: v.name,
        type: v.type,
        status: v.status,
        driver: active?.driver?.displayName || null,
        location: active?.booking?.city || (v.status === "MAINTENANCE" ? "Garage" : "Boston Metro")
      };
    });

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Vehicles API GET error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "settings.update");
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { code, name, type, status } = await req.json();
    if (!code || !name || !type) {
      return NextResponse.json({ error: "Code, name, and type are required." }, { status: 400 });
    }

    const exists = await prisma.vehicle.findUnique({ where: { code } });
    if (exists) {
      return NextResponse.json({ error: "A vehicle with this code already exists." }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: { code, name, type, status: status || "AVAILABLE" }
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "VEHICLE",
        entityId: vehicle.id,
        action: "VEHICLE_CREATED",
        metadataJson: JSON.stringify({ code, name, type, status })
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error("Vehicles API POST error:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
