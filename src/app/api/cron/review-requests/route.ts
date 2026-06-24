import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendGoogleReviewRequestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// This CRON job runs daily (or can be called manually).
// It finds bookings that completed 24 hours ago and sends a Google Review request.
// Configure in vercel.json: "crons": [{"path": "/api/cron/review-requests", "schedule": "0 10 * * *"}]
export async function GET(request: Request) {
  // Verify CRON secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    // 30-day lookback: catches any missed bookings during Vercel downtime.
    // AuditLog (action: "REVIEW_REQUEST_SENT") prevents double-sends.
    const windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Find all COMPLETED bookings whose eventDate is in the past 30 days
    // AND where we haven't sent a review request yet (no REVIEW_REQUEST_SENT audit log)
    const bookings = await prisma.booking.findMany({
      where: {
        status: "COMPLETED",
        eventDate: { gte: windowStart, lte: now },
        auditLogs: { none: { action: "REVIEW_REQUEST_SENT" } },
      },
      include: {
        customer: true,
        package: true,
        auditLogs: { where: { action: "REVIEW_REQUEST_SENT" } },
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    for (const booking of bookings) {
      try {
        // Calculate: eventEndTime + 24h
        const durationMs = (booking.durationMins || 60) * 60 * 1000;
        const eventEndTime = new Date(booking.eventDate.getTime() + durationMs);
        const targetTime = new Date(eventEndTime.getTime() + 24 * 60 * 60 * 1000);

        if (now < targetTime) {
          continue; // Not yet 24h since the event ended
        }

        // Double-check the customer has an email
        if (!booking.customer?.email) {
          console.warn(`[ReviewCron] Booking ${booking.bookingNumber} has no customer email — skipping.`);
          continue;
        }

        await sendGoogleReviewRequestEmail({
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          eventDate: booking.eventDate,
          eventType: booking.eventType,
          customer: {
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
          },
          package: booking.package ? { name: booking.package.name } : null,
        });

        // Log so we never send twice
        await prisma.auditLog.create({
          data: {
            entityType: "BOOKING",
            entityId: booking.id,
            action: "REVIEW_REQUEST_SENT",
            metadataJson: JSON.stringify({
              sentAt: new Date().toISOString(),
              customerEmail: booking.customer.email,
            }),
            bookingId: booking.id,
          },
        });

        sentCount++;
        console.log(`[ReviewCron] ✅ Sent review request for booking ${booking.bookingNumber} to ${booking.customer.email}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push(`Booking ${booking.bookingNumber}: ${errMsg}`);
        console.error(`[ReviewCron] ❌ Failed for booking ${booking.bookingNumber}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      bookingsChecked: bookings.length,
      reviewRequestsSent: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[ReviewCron] Fatal error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
