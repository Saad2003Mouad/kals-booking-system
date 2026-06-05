import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "packages.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.serviceType !== undefined) updateData.serviceType = data.serviceType;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.servings !== undefined) updateData.servings = parseInt(data.servings);
    if (data.extraPiecePrice !== undefined) updateData.extraPiecePrice = parseFloat(data.extraPiecePrice);
    if (data.extraGuestPrice !== undefined) updateData.extraGuestPrice = parseFloat(data.extraGuestPrice);
    if (data.durationMins !== undefined) updateData.durationMins = parseInt(data.durationMins);
    if (data.features !== undefined) updateData.features = JSON.stringify(data.features);
    if (data.image !== undefined) updateData.imageUrl = data.image;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = parseInt(data.sortOrder);
    if (data.badge !== undefined) updateData.badge = data.badge;

    const updated = await prisma.package.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update package error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "packages.delete");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // Check if package is used in bookings
    const bookingsCount = await prisma.booking.count({ where: { packageId: params.id } });
    if (bookingsCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot delete package because it is attached to existing bookings. Please deactivate it instead." 
      }, { status: 400 });
    }

    await prisma.package.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete package error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
