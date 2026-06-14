import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthenticated, unauthorized, hasPermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    // Check permissions if applicable
    if (!hasPermission(user.role, "bookings.view")) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");

    const whereClause: any = {
      status: { in: ["CONFIRMED", "PENDING_PAYMENT", "PENDING", "PENDING_REVIEW"] }
    };

    if (startStr && endStr) {
      const startDate = new Date(startStr);
      startDate.setDate(startDate.getDate() - 1);
      
      const endDate = new Date(endStr);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.eventDate = {
        gte: startDate,
        lte: endDate
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        customer: true,
        package: true,
      },
    });

    const events = bookings.map((b) => {
      const eventDate = new Date(b.eventDate);
      const [hours, minutes] = (b.startTime || "12:00").split(":");
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + (b.durationMins || 60));

      let color = "#3B82F6"; // default blue
      if (b.status === "CONFIRMED") color = "#10B981"; // emerald
      else if (b.status === "PENDING" || b.status === "PENDING_REVIEW") color = "#F59E0B"; // amber
      else if (b.status === "PENDING_PAYMENT") color = "#6366F1"; // indigo

      return {
        id: b.id,
        title: `${b.package?.name || "Booking"} - ${b.customer.firstName} ${b.customer.lastName}`,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          bookingNumber: b.bookingNumber,
          status: b.status,
          customerName: `${b.customer.firstName} ${b.customer.lastName}`,
          phone: b.customer.phone,
          email: b.customer.email,
          address: `${b.address}, ${b.city}, MA ${b.zip}`,
          packageName: b.package?.name || "Custom",
        }
      };
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Calendar API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load calendar events" }, { status: 500 });
  }
}
