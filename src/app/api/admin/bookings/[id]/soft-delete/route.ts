import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthenticated, unauthorized } from "@/lib/rbac";
import { createAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    // Only OWNER or ADMIN can soft-delete
    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      return unauthorized();
    }

    const body = await req.json().catch(() => ({}));
    const reason: string = body.reason || "No reason provided";

    const existing = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (existing.deletedAt) {
      return NextResponse.json({ success: false, error: "Booking is already archived" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        deletedBy: user.id,
        deletedReason: reason,
        status: "ARCHIVED",
      },
    });

    await createAuditLog({
      entityType: "BOOKING",
      entityId: booking.id,
      bookingId: booking.id,
      action: "SOFT_DELETED",
      metadata: { deletedReason: reason },
      previousValues: { status: existing.status, deletedAt: null },
      newValues: { status: "ARCHIVED", deletedAt: booking.deletedAt?.toISOString() },
      actorId: user.id,
      actorRole: user.role,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Soft delete booking error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
