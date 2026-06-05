import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hasPermission, unauthenticated, unauthorized } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    const canViewAll = hasPermission(user.role, "bookings.view");
    const canViewAssigned = hasPermission(user.role, "bookings.view.assignedOnly");

    if (!canViewAll && !canViewAssigned) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status) where.status = status;
    
    // Enforce DRIVER role assigned-only filtering
    if (user.role === "DRIVER" || (!canViewAll && canViewAssigned)) {
      where.assignment = {
        driver: {
          userId: user.id
        }
      };
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: "insensitive" } },
        { customer: { firstName: { contains: search, mode: "insensitive" } } },
        { customer: { lastName: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: true,
        vehicle: true,
        package: true,
        assignment: {
          include: {
            driver: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error("Failed to fetch bookings", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}
