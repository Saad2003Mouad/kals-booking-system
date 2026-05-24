import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobStatus, driverNote } = await req.json();
  const allowed = ["PENDING", "ON_THE_WAY", "ARRIVED", "COMPLETED"];
  if (!allowed.includes(jobStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const driver = await prisma.driver.findFirst({ where: { userId: (token as any).id as string } });
  if (!driver) {
    return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
  }

  const check = await prisma.vehicleAssignment.findFirst({
    where: { id: params.id, driverId: driver.id }
  });
  if (!check) {
    return NextResponse.json({ error: "Assignment not found or unauthorized" }, { status: 404 });
  }

  const assignment = await prisma.vehicleAssignment.update({
    where: { id: params.id },
    data: {
      jobStatus,
      driverNote: driverNote !== undefined ? driverNote : undefined,
    },
    include: {
      booking: true
    }
  });

  // Sync associated booking status
  let bookingStatus = "CONFIRMED";
  if (jobStatus === "COMPLETED") {
    bookingStatus = "COMPLETED";
  } else if (jobStatus === "ON_THE_WAY" || jobStatus === "ARRIVED") {
    bookingStatus = "IN_PROGRESS";
  }

  await prisma.booking.update({
    where: { id: assignment.bookingId },
    data: { status: bookingStatus as any }
  });

  return NextResponse.json(assignment);
}
