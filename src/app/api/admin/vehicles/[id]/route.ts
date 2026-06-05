import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "settings.update");
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { code, name, type, status } = await req.json();

    const updateData: any = {};
    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: updateData
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "VEHICLE",
        entityId: vehicle.id,
        action: "VEHICLE_UPDATED",
        metadataJson: JSON.stringify(updateData)
      }
    });

    return NextResponse.json(vehicle);
  } catch (error: any) {
    console.error("Vehicle PATCH error:", error);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "settings.update");
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Check if the vehicle is attached to bookings
    const bookingsCount = await prisma.booking.count({ where: { vehicleId: params.id } });
    const assignmentsCount = await prisma.vehicleAssignment.count({ where: { vehicleId: params.id } });
    
    if (bookingsCount > 0 || assignmentsCount > 0) {
      return NextResponse.json({
        error: "Cannot delete vehicle because it has historical assignments. Please set status to 'MAINTENANCE' or 'OFFLINE' instead."
      }, { status: 400 });
    }

    await prisma.vehicle.delete({
      where: { id: params.id }
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "VEHICLE",
        entityId: params.id,
        action: "VEHICLE_DELETED",
        metadataJson: JSON.stringify({ id: params.id })
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Vehicle DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
