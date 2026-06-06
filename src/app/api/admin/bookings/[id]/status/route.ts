import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingApprovedEmail, sendBookingRejectedEmail, sendBookingPendingReviewEmail } from "@/lib/email";
import { getSessionUser, hasPermission, unauthenticated, unauthorized } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    const { status, internalNote, customPrice, customerNotes } = await req.json();

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
    if (customPrice !== undefined && (status === "CONFIRMED" || status === "PENDING_PAYMENT")) {
      updateData.totalAmount = parseFloat(customPrice);
    }
    if (customerNotes !== undefined) {
      updateData.notes = customerNotes;
    }

    // If customPrice is provided, update associated BookingItems and Quote
    if (customPrice !== undefined && (status === "CONFIRMED" || status === "PENDING_PAYMENT")) {
      const priceNum = parseFloat(customPrice);
      
      // Update BookingItem of lineType "PACKAGE"
      await prisma.bookingItem.updateMany({
        where: {
          bookingId: params.id,
          lineType: "PACKAGE"
        },
        data: {
          unitPrice: priceNum,
          totalPrice: priceNum
        }
      });

      // Fetch existing quote to update its snapshotJson
      const existingQuote = await prisma.quote.findUnique({
        where: { bookingId: params.id }
      });
      if (existingQuote) {
        let snap: any = {};
        try {
          snap = JSON.parse(existingQuote.snapshotJson);
        } catch (e) {}
        snap.packagePrice = priceNum;
        snap.estimatedTotal = priceNum;
        
        await prisma.quote.update({
          where: { bookingId: params.id },
          data: {
            basePrice: priceNum,
            totalAmount: priceNum,
            snapshotJson: JSON.stringify(snap)
          }
        });
      }
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
