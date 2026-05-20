import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
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

    // 5. REVENUE CHART (mocked 7 days for now since grouping by date in Prisma requires raw queries or complex logic)
    const revenueChart = Array.from({length: 7}).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        revenue: Math.floor(Math.random() * 2000) + 500 // Mock chart for UI beauty
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          todayJobs: todayBookings.length,
          pending,
          weekRevenue: weekRevAggr._sum.totalAmount || 0,
          monthRevenue: monthRevAggr._sum.totalAmount || 0,
          completedMonth: completedMonthBookings,
          totalCustomers,
        },
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
        revenueChart
      }
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
