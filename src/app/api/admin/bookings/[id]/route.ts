import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hasPermission, unauthenticated, unauthorized } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    const canViewAll = hasPermission(user.role, "bookings.view");
    const canViewAssigned = hasPermission(user.role, "bookings.view.assignedOnly");

    if (!canViewAll && !canViewAssigned) {
      return unauthorized();
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        package: true,
        vehicle: true,
        quote: true,
        stops: { orderBy: { stopOrder: 'asc' } },
        assignment: { include: { vehicle: true, driver: { include: { user: true } } } }
      }
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    // If driver, check that they are actually assigned to this booking
    if (user.role === "DRIVER" || (!canViewAll && canViewAssigned)) {
      const isAssigned = booking.assignment?.driver?.userId === user.id;
      if (!isAssigned) {
        return unauthorized();
      }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch booking" }, { status: 500 });
  }
}
