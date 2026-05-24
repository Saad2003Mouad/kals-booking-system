import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingApprovedEmail, sendBookingRejectedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, internalNote } = await req.json();

    const paymentEnabledSetting = await prisma.setting.findUnique({ where: { key: "PAYMENT_ENABLED" } });
    const paymentEnabled = paymentEnabledSetting?.value === "true" || process.env.PAYMENT_ENABLED === "true";

    let targetStatus = status;
    if (!paymentEnabled && status === "PENDING_PAYMENT") {
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
        metadataJson: JSON.stringify({ previousStatus: "UNKNOWN", newStatus: targetStatus, internalNote })
      }
    });

    // Send emails on status change
    try {
      if (status === "CONFIRMED" || status === "PENDING_PAYMENT") {
        const paymentUrl = paymentEnabled
          ? `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/checkout/${booking.id}`
          : `${process.env.NEXTAUTH_URL || 'https://bostonlegendwebflowio.vercel.app'}/customer/booking/${booking.id}`;
        await sendBookingApprovedEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          paymentUrl,
          booking.totalAmount.toFixed(2),
          booking.id
        );
      } else if (status === "REJECTED") {
        await sendBookingRejectedEmail(
          booking.customer.email,
          booking.customer.firstName,
          booking.bookingNumber,
          internalNote || "We are fully booked or outside our service window.",
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
