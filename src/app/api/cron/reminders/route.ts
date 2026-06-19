import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOwnerEventReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify Vercel Cron Secret (if configured)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const twentyFiveHours = 25 * 60 * 60 * 1000;

    // Fetch bookings that are confirmed or pending
    // We only want upcoming events that haven't been canceled/rejected.
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "PENDING", "PENDING_REVIEW", "PENDING_PAYMENT", "ASSIGNED"] },
      },
      include: {
        customer: true,
        package: true,
        auditLogs: {
          where: { action: "OWNER_REMINDER_SENT_24H" }
        }
      }
    });

    let sentCount = 0;

    for (const booking of bookings) {
      // Skip if already sent
      if (booking.auditLogs && booking.auditLogs.length > 0) continue;

      try {
        const eventDateObj = new Date(booking.eventDate);
        const startMatch = booking.startTime?.match(/(\d+):(\d+)\s*(AM|PM)/i);
        
        if (startMatch) {
          let hours = parseInt(startMatch[1]);
          const mins = parseInt(startMatch[2]);
          const ampm = startMatch[3].toUpperCase();
          if (ampm === "PM" && hours < 12) hours += 12;
          if (ampm === "AM" && hours === 12) hours = 0;
          
          eventDateObj.setHours(hours, mins, 0, 0);
          const timeUntilEvent = eventDateObj.getTime() - now;

          // If event is exactly between 24 and 25 hours away
          if (timeUntilEvent >= twentyFourHours && timeUntilEvent <= twentyFiveHours) {
            await sendOwnerEventReminderEmail(booking);

            // Record the audit log so we don't send again
            await prisma.auditLog.create({
              data: {
                entityType: "BOOKING",
                entityId: booking.id,
                action: "OWNER_REMINDER_SENT_24H",
                metadataJson: JSON.stringify({ sentAt: new Date().toISOString() }),
                bookingId: booking.id
              }
            });

            sentCount++;
          }
        }
      } catch (dateErr) {
        console.error(`[Cron] Error parsing dates for booking ${booking.id}:`, dateErr);
      }
    }

    return NextResponse.json({ success: true, emailsSent: sentCount });
  } catch (err) {
    console.error("[Cron Reminders Error]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
