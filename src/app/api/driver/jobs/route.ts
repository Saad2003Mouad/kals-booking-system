import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const driver = await prisma.driver.findFirst({ where: { userId: (token as any).id as string } });
  if (!driver) return NextResponse.json([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today);
  future.setDate(future.getDate() + 30);

  const assignments = await prisma.vehicleAssignment.findMany({
    where: {
      driverId: driver.id,
      booking: {
        eventDate: { gte: today, lte: future },
      },
    },
    include: {
      booking: {
        include: {
          customer: true,
          vehicle: true,
          package: true,
        }
      }
    },
    orderBy: { assignedAt: "asc" },
  });

  return NextResponse.json(assignments);
}
