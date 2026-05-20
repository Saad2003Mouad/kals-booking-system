import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, internalNote } = await req.json();

    const updateData: any = { status };
    if (internalNote !== undefined) {
      updateData.internalNote = internalNote;
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: `STATUS_CHANGED_TO_${status}`,
        metadataJson: JSON.stringify({ previousStatus: "UNKNOWN", newStatus: status, internalNote })
      }
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking status update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
