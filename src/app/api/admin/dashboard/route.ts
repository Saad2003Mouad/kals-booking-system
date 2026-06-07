import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hasPermission, unauthenticated, unauthorized } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    const canViewFull = hasPermission(user.role, "dashboard.view");
    const canViewLimited = hasPermission(user.role, "dashboard.view.limited");

    if (!canViewFull && !canViewLimited) {
      return unauthorized();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 1. STATS
    const [
      pending,
      totalCustomers,
      completedMonthBookings,
      weekRevAggr,
      monthRevAggr
    ] = await Promise.all([
      prisma.booking.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.customer.count(),
      prisma.booking.count({ where: { status: { in: ["COMPLETED", "CONFIRMED"] }, eventDate: { gte: thirtyDaysAgo } } }),
      prisma.booking.aggregate({ where: { status: { in: ["COMPLETED", "CONFIRMED"] }, eventDate: { gte: sevenDaysAgo } }, _sum: { totalAmount: true } }),
      prisma.booking.aggregate({ where: { status: { in: ["COMPLETED", "CONFIRMED"] }, eventDate: { gte: thirtyDaysAgo } }, _sum: { totalAmount: true } }),
    ]);

    // 2. TODAY BOOKINGS
    const todayBookings = await prisma.booking.findMany({
      where: { eventDate: { gte: today, lt: new Date(today.getTime() + 86400000) } },
      include: { customer: true, vehicle: true },
      orderBy: { startTime: "asc" }
    });

    // 3. PENDING BOOKINGS
    const pendingBookings = await prisma.booking.findMany({
      where: { status: "PENDING_REVIEW" },
      include: { customer: true },
      take: 10,
      orderBy: { createdAt: "desc" }
    });

    // 4. VEHICLES
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { code: "asc" }
    });

    // 5. REVENUE CHART — real 7-day data grouped by event date
    const sevenDaysBookings = await prisma.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        eventDate: { gte: sevenDaysAgo },
      },
      select: { eventDate: true, totalAmount: true },
    });

    const revenueChart = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayKey = d.toISOString().split("T")[0];
      const revenue = sevenDaysBookings
        .filter(b => b.eventDate.toISOString().split("T")[0] === dayKey)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      return { day: dayLabel, revenue };
    });

    // If limited view (e.g. SUPPORT role), redact revenue data
    const finalStats = {
      todayJobs: todayBookings.length,
      pending,
      weekRevenue: canViewFull ? (weekRevAggr._sum.totalAmount || 0) : 0,
      monthRevenue: canViewFull ? (monthRevAggr._sum.totalAmount || 0) : 0,
      completedMonth: completedMonthBookings,
      totalCustomers,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats: finalStats,
        todayBookings: todayBookings.map(b => ({
          bookingNumber: b.bookingNumber,
          startTime: b.startTime,
          customer: { firstName: b.customer.firstName, lastName: b.customer.lastName },
          eventType: b.eventType,
          city: b.city,
          vehicle: b.vehicle ? { code: b.vehicle.code } : null,
          status: b.status
        })),
        pendingBookings: pendingBookings.map(b => ({
          id: b.id,
          bookingNumber: b.bookingNumber,
          customer: { firstName: b.customer.firstName, lastName: b.customer.lastName },
          eventType: b.eventType,
          totalAmount: b.totalAmount
        })),
        vehicles: vehicles.map(v => ({ code: v.code, type: v.type, status: v.status })),
        revenueChart: canViewFull ? revenueChart : []
      }
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
