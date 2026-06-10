import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as ics from "ics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.token,
      },
      include: {
        package: true,
        customer: true,
      }
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.status !== "CONFIRMED" && booking.status !== "PENDING_PAYMENT") {
      return new NextResponse("Booking not confirmed yet", { status: 400 });
    }

    const eventDate = new Date(booking.eventDate);
    const [hours, minutes] = (booking.startTime || "12:00").split(":");
    
    // ics package expects [year, month, date, hours, minutes]
    // Month is 1-indexed in ics (1-12)
    const startArr: ics.DateArray = [
      eventDate.getFullYear(),
      eventDate.getMonth() + 1,
      eventDate.getDate(),
      parseInt(hours, 10),
      parseInt(minutes, 10)
    ];

    const event: ics.EventAttributes = {
      title: `Boston Legend - ${booking.package?.name || "Ice Cream Event"}`,
      description: `Your ice cream event is booked!
      
Booking ID: ${booking.bookingNumber}
Package: ${booking.package?.name || "Custom"}
Phone: 617-999-3803
Email: support@bostonlegend.com

We look forward to serving you!`,
      location: `${booking.address}, ${booking.city}, MA ${booking.zip}`,
      start: startArr,
      duration: { minutes: booking.durationMins || 60 },
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Boston Legend Ice Cream', email: 'support@bostonlegend.com' },
    };

    return new Promise<NextResponse>((resolve) => {
      ics.createEvent(event, (error, value) => {
        if (error) {
          console.error("ICS generation error:", error);
          resolve(new NextResponse("Failed to generate calendar file", { status: 500 }));
          return;
        }

        const headers = new Headers();
        headers.set("Content-Type", "text/calendar; charset=utf-8");
        headers.set("Content-Disposition", `attachment; filename="boston-legend-event-${booking.bookingNumber}.ics"`);

        resolve(new NextResponse(value, { headers, status: 200 }));
      });
    });

  } catch (error) {
    console.error("Calendar Generation API Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
