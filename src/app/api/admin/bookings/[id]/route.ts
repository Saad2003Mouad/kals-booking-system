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

    if (booking.deletedAt) {
      if (user.role !== "ADMIN" && user.role !== "OWNER") {
        return unauthorized();
      }
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    if (!hasPermission(user.role, "bookings.update")) {
      return unauthorized();
    }

    const body = await req.json();
    const {
      notes,
      internalNote,
      eventDate,
      startTime,
      durationMins,
      guests,
      address,
      city,
      zip,
      totalAmount,
      eventType,
    } = body;

    const updateData: any = {};
    if (notes !== undefined)       updateData.notes        = notes;
    if (internalNote !== undefined) updateData.internalNote = internalNote;
    if (eventDate !== undefined)   updateData.eventDate    = new Date(eventDate);
    if (startTime !== undefined)   updateData.startTime    = startTime;
    if (durationMins !== undefined) updateData.durationMins = Number(durationMins);
    if (guests !== undefined)      updateData.guests       = Number(guests);
    if (address !== undefined)     updateData.address      = address;
    if (city !== undefined)        updateData.city         = city;
    if (zip !== undefined)         updateData.zip          = zip;
    if (totalAmount !== undefined) updateData.totalAmount  = parseFloat(totalAmount);
    if (eventType !== undefined)   updateData.eventType    = eventType;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true,
        package: true,
        vehicle: true,
        quote: true,
        stops: { orderBy: { stopOrder: "asc" } },
        assignment: { include: { vehicle: true, driver: { include: { user: true } } } },
      },
    });

    // Update quote total if totalAmount changed
    if (totalAmount !== undefined) {
      const existingQuote = await prisma.quote.findUnique({ where: { bookingId: params.id } });
      if (existingQuote) {
        await prisma.quote.update({
          where: { bookingId: params.id },
          data: { totalAmount: parseFloat(totalAmount) },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId:   params.id,
        action:     "BOOKING_EDITED",
        userId:     user.id,
        metadataJson: JSON.stringify({ updatedFields: Object.keys(updateData), by: user.email }),
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}
