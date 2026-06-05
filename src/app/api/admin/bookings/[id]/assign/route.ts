import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, unauthenticated, unauthorized } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.assign");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const user = auth.user!;

    const { vehicleId, driverId } = await req.json();

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle is required." }, { status: 400 });
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });

    // Check if driver exists (if provided) and resolve User.id to Driver.id
    let actualDriverId: string | null = null;
    if (driverId) {
      let driver = await prisma.driver.findUnique({ where: { id: driverId } });
      if (!driver) {
        driver = await prisma.driver.findUnique({ where: { userId: driverId } });
      }
      if (!driver) {
        return NextResponse.json({ error: "Driver not found." }, { status: 404 });
      }
      actualDriverId = driver.id;
    }

    // Upsert VehicleAssignment for this booking
    const assignment = await prisma.vehicleAssignment.upsert({
      where: { bookingId: params.id },
      update: {
        vehicleId,
        driverId: actualDriverId,
        jobStatus: "PENDING"
      },
      create: {
        bookingId: params.id,
        vehicleId,
        driverId: actualDriverId,
        jobStatus: "PENDING"
      }
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: params.id,
        bookingId: params.id,
        action: "VEHICLE_ASSIGNED",
        metadataJson: JSON.stringify({ vehicleId, driverId, assignmentId: assignment.id }),
        actorId: user.id
      }
    });

    // Sync vehicleId on Booking table
    await prisma.booking.update({
      where: { id: params.id },
      data: { vehicleId }
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: any) {
    console.error("Booking assign error:", error);
    return NextResponse.json({ error: "Failed to save assignment" }, { status: 500 });
  }
}
