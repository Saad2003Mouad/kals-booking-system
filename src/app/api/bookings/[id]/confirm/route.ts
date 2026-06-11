/**
 * POST /api/bookings/[id]/confirm
 * Called after successful payment (Stripe webhook or simulated payment).
 * Transitions:  PENDING_PAYMENT → CONFIRMED
 *               CONFIRMED → no-op (idempotent)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingApprovedEmail } from "@/lib/email";
import { googleCalendarService } from "@/lib/google-calendar";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { customer: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Idempotent — already confirmed
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({ success: true, booking, alreadyConfirmed: true });
    }

    // Only valid transition: PENDING_PAYMENT → CONFIRMED
    if (booking.status !== "PENDING_PAYMENT") {
      return NextResponse.json({
        error: `Cannot confirm booking in status '${booking.status}'. Expected PENDING_PAYMENT.`
      }, { status: 409 });
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: "CONFIRMED" },
      include: { customer: true, package: true }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: "PAYMENT_CONFIRMED",
        metadataJson: JSON.stringify({ simulated: true }),
      },
    });

    // Send confirmation email
    const paymentUrl = `/checkout/${booking.id}`;
    await sendBookingApprovedEmail(
      booking.customer.email,
      booking.customer.firstName,
      booking.bookingNumber,
      paymentUrl,
      booking.totalAmount.toFixed(2),
      booking.id
    );

    // Sync to Google Calendar
    try {
      await googleCalendarService.createBookingEvent(updated);
    } catch (gcalErr) {
      console.error("[Google Calendar Sync Error]", gcalErr);
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("[Booking Confirm Error]", err);
    return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 });
  }
}
