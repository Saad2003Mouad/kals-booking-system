import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingApprovedEmail, sendBookingRejectedEmail, sendBookingPendingReviewEmail } from "@/lib/email";
import { getSessionUser, hasPermission, unauthenticated, unauthorized } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    const { status, internalNote } = await req.json();

    // Enforce permission matrix for status change actions
    if (status === "CONFIRMED" || status === "PENDING_PAYMENT") {
      if (!hasPermission(user.role, "bookings.approve")) {
        return unauthorized();
      }
    } else if (status === "REJECTED") {
      if (!hasPermission(user.role, "bookings.reject")) {
        return unauthorized();
      }
    } else {
      if (!hasPermission(user.role, "bookings.update")) {
        return unauthorized();
      }
    }

    let targetStatus = status;
    if (status === "PENDING_PAYMENT") {
      targetStatus = "CONFIRMED";
    }

    const updateData: any = { status: targetStatus };
    if (internalNote !== undefined) {
      updateData.internalNote = internalNote;
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true
      }
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: `STATUS_CHANGED_TO_${targetStatus}`,
        metadataJson: JSON.stringify({ previousStatus: "UNKNOWN", newStatus: targetStatus, internalNote }),
        actorId: user.id
      }
    });

    // Send emails on status change
    try {
      if (status === "CONFIRMED" || status === "PENDING_PAYMENT") {
        const portalUrl = `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${booking.id}`;
        await sendBookingApprovedEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          portalUrl,
          booking.totalAmount.toFixed(2),
          booking.id
        );
      } else if (status === "REJECTED") {
        await sendBookingRejectedEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          internalNote || "Unfortunately, we’re unable to approve this request as submitted.",
          booking.id
        );
      } else if (status === "PENDING_REVIEW" || status === "PENDING") {
        await sendBookingPendingReviewEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          internalNote || "Thank you for choosing Boston Legend. We reviewed your request and it needs a quick adjustment before we can confirm it.",
          booking.id
        );
      }
    } catch (emailErr) {
      console.error("[Email Dispatch Error inside Status Update]", emailErr);
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking status update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
