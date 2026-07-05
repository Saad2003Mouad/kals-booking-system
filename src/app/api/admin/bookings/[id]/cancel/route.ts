import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthenticated, unauthorized } from "@/lib/rbac";
import { createAuditLog } from "@/lib/audit";
import { sendCancellationApprovedEmail, sendCancellationRejectedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/bookings/[id]/cancel
 * Body: { action: "APPROVE" | "REJECT", adminNote?: string }
 *
 * APPROVE → sets booking.status = "CANCELLED", stores cancelledAt/cancelledBy/adminNote
 * REJECT  → reverts booking.status to previous (CONFIRMED/PENDING), stores adminNote
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      return unauthorized();
    }

    const body = await req.json().catch(() => ({}));
    const action: "APPROVE" | "REJECT" = body.action;
    const adminNote: string = body.adminNote || "";

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json({ success: false, error: "action must be APPROVE or REJECT" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { customer: true },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.deletedAt) {
      return NextResponse.json({ success: false, error: "Booking is archived" }, { status: 400 });
    }

    if (booking.status !== "CANCELLATION_REQUESTED") {
      return NextResponse.json(
        { success: false, error: `Booking is not in CANCELLATION_REQUESTED status (current: ${booking.status})` },
        { status: 400 }
      );
    }

    const previousStatus = booking.status;

    if (action === "APPROVE") {
      await prisma.booking.update({
        where: { id: params.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelledBy: user.id,
          adminNote,
        },
      });

      await createAuditLog({
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: "CANCELLATION_APPROVED",
        metadata: { adminNote },
        previousValues: { status: previousStatus },
        newValues: { status: "CANCELLED" },
        actorId: user.id,
        actorRole: user.role,
      });

      // Notify customer
      try {
        await sendCancellationApprovedEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          adminNote,
          booking.id
        );
      } catch (emailErr) {
        console.error("[Cancel] Email failed:", emailErr);
      }

      return NextResponse.json({ success: true, action: "APPROVED" });
    } else {
      // REJECT — revert to CONFIRMED if it was ever confirmed, else PENDING
      const revertStatus = "CONFIRMED";

      await prisma.booking.update({
        where: { id: params.id },
        data: {
          status: revertStatus,
          adminNote,
        },
      });

      await createAuditLog({
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: "CANCELLATION_REJECTED",
        metadata: { adminNote },
        previousValues: { status: previousStatus },
        newValues: { status: revertStatus },
        actorId: user.id,
        actorRole: user.role,
      });

      // Notify customer
      try {
        await sendCancellationRejectedEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          adminNote,
          booking.id
        );
      } catch (emailErr) {
        console.error("[Cancel] Email failed:", emailErr);
      }

      return NextResponse.json({ success: true, action: "REJECTED" });
    }
  } catch (error: any) {
    console.error("Cancellation workflow error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
