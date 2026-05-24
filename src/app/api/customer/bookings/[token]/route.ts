import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.token },
      include: {
        customer: true,
        package: true,
        quote: true,
      }
    });

    const paymentEnabledSetting = await prisma.setting.findUnique({ where: { key: "PAYMENT_ENABLED" } });
    const paymentEnabled = paymentEnabledSetting?.value === "true" || process.env.PAYMENT_ENABLED === "true";

    return NextResponse.json({ success: true, data: booking, paymentEnabled });
  } catch (error: any) {
    console.error("Customer booking fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.token },
      include: { customer: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { email, phone, notes } = await req.json();

    // 1. Update customer profile details if modified
    const customerUpdate: any = {};
    if (email !== undefined) customerUpdate.email = email;
    if (phone !== undefined) customerUpdate.phone = phone;

    if (Object.keys(customerUpdate).length > 0) {
      await prisma.customer.update({
        where: { id: booking.customerId },
        data: customerUpdate
      });
    }

    // 2. Update booking notes if modified
    if (notes !== undefined) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { notes }
      });
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: "CUSTOMER_SELF_SERVICE_UPDATE",
        metadataJson: JSON.stringify({ email, phone, notes })
      }
    });

    const updatedBooking = await prisma.booking.findUnique({
      where: { id: params.token },
      include: { customer: true, package: true, quote: true }
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error: any) {
    console.error("Customer booking update error:", error);
    return NextResponse.json({ error: "Failed to update booking details" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.token },
      include: { customer: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { requestType, reason } = await req.json();

    if (!requestType || !["CHANGE", "CANCEL"].includes(requestType)) {
      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    const title = requestType === "CANCEL"
      ? `Booking Cancellation Requested: #${booking.bookingNumber}`
      : `Booking Change Requested: #${booking.bookingNumber}`;

    const description = `Request from customer ${booking.customer.firstName} ${booking.customer.lastName} (${booking.customer.phone}).\nReason/Details:\n${reason || "No details provided."}`;

    // Create a Task for the operations team
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: "HIGH",
        status: "TODO",
        bookingId: booking.id,
        customerId: booking.customerId
      }
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        bookingId: booking.id,
        action: `CUSTOMER_${requestType}_REQUESTED`,
        metadataJson: JSON.stringify({ reason, taskId: task.id })
      }
    });

    return NextResponse.json({ success: true, message: "Request submitted successfully" });
  } catch (error: any) {
    console.error("Customer request submission error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
