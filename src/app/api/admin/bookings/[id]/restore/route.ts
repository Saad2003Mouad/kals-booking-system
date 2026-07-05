import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthenticated, unauthorized } from "@/lib/rbac";
import { createAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/bookings/[id]/restore
 * Restores a soft-deleted booking. Restricted to OWNER and ADMIN.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      return unauthorized();
    }

    const existing = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (!existing.deletedAt) {
      return NextResponse.json({ success: false, error: "Booking is not archived" }, { status: 400 });
    }

    const previousStatus = existing.status;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        deletedAt: null,
        deletedBy: null,
        deletedReason: null,
        status: "PENDING",
      },
    });

    await createAuditLog({
      entityType: "BOOKING",
      entityId: booking.id,
      bookingId: booking.id,
      action: "RESTORED",
      metadata: { previousStatus },
      previousValues: { status: previousStatus, deletedAt: existing.deletedAt?.toISOString() },
      newValues: { status: "PENDING", deletedAt: null },
      actorId: user.id,
      actorRole: user.role,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Restore booking error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
