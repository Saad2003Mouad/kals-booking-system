/**
 * POST /api/bookings/[id]/review
 * Admin approve or reject a PENDING_REVIEW booking.
 *
 * Body: { action: "APPROVE" | "REJECT", reason?: string, travelFeeOverride?: number }
 *
 * APPROVE → status=CONFIRMED, sends approval email with payment link
 * REJECT  → status=REJECTED,  sends rejection email with reason
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingApprovedEmail } from "@/lib/email";
import { z } from "zod";

const ReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().optional(),
  travelFeeOverride: z.coerce.number().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { action, reason, travelFeeOverride } = parsed.data;

    // Fetch booking with customer
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { customer: true, quote: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "PENDING_REVIEW") {
      return NextResponse.json(
        { error: `Booking is not in PENDING_REVIEW state (current: ${booking.status})` },
        { status: 409 }
      );
    }

    const paymentEnabledSetting = await prisma.setting.findUnique({ where: { key: "PAYMENT_ENABLED" } });
    const paymentEnabled = paymentEnabledSetting?.value === "true" || process.env.PAYMENT_ENABLED === "true";

    if (action === "APPROVE") {
      // Optionally update travel fee
      const updateData: any = {
        status: paymentEnabled ? "PENDING_PAYMENT" : "CONFIRMED",
        internalNote: reason || null,
      };

      // Update booking
      const updated = await prisma.booking.update({
        where: { id: params.id },
        data: updateData,
      });

      // Update quote travel fee if admin overrides it
      if (travelFeeOverride !== undefined && booking.quote) {
        const newTotal =
          (booking.quote.totalAmount - booking.quote.travelFee) +
          travelFeeOverride;
        await prisma.quote.update({
          where: { bookingId: booking.id },
          data: {
            travelFee: travelFeeOverride,
            totalAmount: newTotal,
          },
        });
      }

      // Audit log
      await prisma.auditLog.create({
        data: {
          entityType: "BOOKING",
          entityId: booking.id,
          bookingId: booking.id,
          action: "ADMIN_APPROVED",
          metadataJson: JSON.stringify({
            reason,
            travelFeeOverride,
            previousStatus: "PENDING_REVIEW",
          }),
        },
      });

      // Payment URL or Portal URL
      const paymentUrl = paymentEnabled
        ? `/checkout/${booking.id}`
        : `/customer/booking/${booking.id}`;

      // Send approval email (blocking)
      await sendBookingApprovedEmail(
        booking.customer.email,
        booking.customer.firstName,
        booking.bookingNumber,
        paymentUrl,
        booking.totalAmount.toFixed(2),
        booking.id
      );

      return NextResponse.json({
        success: true,
        action: "APPROVED",
        newStatus: paymentEnabled ? "PENDING_PAYMENT" : "CONFIRMED",
        booking: updated,
        paymentUrl,
        message: paymentEnabled
          ? "Booking approved. Customer notified with payment link. Status will become CONFIRMED after payment."
          : "Booking approved. Customer notified of cash terms. Status is CONFIRMED.",
      });
    }

    // REJECT
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        internalNote: reason || "Rejected by admin",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: "ADMIN_REJECTED",
        metadataJson: JSON.stringify({
          reason,
          previousStatus: "PENDING_REVIEW",
        }),
      },
    });

    // Send rejection email (blocking)
    const { sendBookingRejectedEmail } = await import("@/lib/email");
    await sendBookingRejectedEmail(
      booking.customer.email,
      booking.customer.firstName,
      booking.bookingNumber,
      reason || "Your request did not meet our availability criteria.",
      booking.id
    );

    return NextResponse.json({
      success: true,
      action: "REJECTED",
      booking: updated,
    });
  } catch (err) {
    console.error("[Booking Review Error]", err);
    return NextResponse.json(
      { error: "Review action failed" },
      { status: 500 }
    );
  }
}
