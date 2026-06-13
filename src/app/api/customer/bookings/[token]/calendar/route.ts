import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as ics from "ics";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.token },
      include: { customer: true, package: true }
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    if (booking.status !== "CONFIRMED") {
      return new NextResponse("Booking is not confirmed yet", { status: 403 });
    }

    const eventDate = new Date(booking.eventDate);
    const [hours, minutes] = (booking.startTime || "12:00").split(":");

    const start: [number, number, number, number, number] = [
      eventDate.getFullYear(),
      eventDate.getMonth() + 1,
      eventDate.getDate(),
      parseInt(hours, 10),
      parseInt(minutes, 10)
    ];

    const description = `Customer: ${booking.customer.firstName} ${booking.customer.lastName}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nPackage: ${booking.package?.name || "Custom"}\nNotes: ${booking.notes || "None"}\n\nThank you for choosing Boston Legend Ice Cream Truck!`;

    const event: ics.EventAttributes = {
      start,
      duration: { hours: Math.floor(booking.durationMins / 60), minutes: booking.durationMins % 60 },
      title: `Boston Legend Ice Cream Truck Event - ${booking.customer.firstName}`,
      description,
      location: `${booking.address}, ${booking.city}, MA ${booking.zip}`,
      url: `https://bostonlegendicecreamtruck.com/customer/booking/${booking.id}`,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Boston Legend', email: 'info@bostonlegendicecreamtruck.com' }
    };

    const { error, value } = ics.createEvent(event);

    if (error || !value) {
      console.error("ICS Generation Error:", error);
      return new NextResponse("Failed to generate calendar file", { status: 500 });
    }

    return new NextResponse(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="boston-legend-event-${booking.bookingNumber}.ics"`
      }
    });
  } catch (error: any) {
    console.error("ICS generation route error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
