import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hasPermission, unauthenticated, unauthorized } from "@/lib/rbac";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// Cache the heavy DB aggregations globally (not per-user) for 30 seconds.
// This means 1000 concurrent users hit the cache, not the DB.
const getCachedDashboardData = unstable_cache(
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // All queries run in a single Promise.all — no N+1
    const [
      pendingReviews,
      cancellationRequests,
      newInquiries,
      totalCustomers,
      completedMonthBookings,
      weekRevAggr,
      monthRevAggr,
      previousWeekRevAggr,
      todayBookings,
      actionRequiredBookings,
      vehicles,
      sevenDaysBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.booking.count({ where: { status: "CANCELLATION_REQUESTED" } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.customer.count(),
      prisma.booking.count({
        where: { status: { in: ["COMPLETED", "CONFIRMED"] }, eventDate: { gte: thirtyDaysAgo } },
      }),
      prisma.booking.aggregate({
        where: { status: { in: ["COMPLETED", "CONFIRMED"] }, eventDate: { gte: sevenDaysAgo } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.aggregate({
        where: { status: { in: ["COMPLETED", "CONFIRMED"] }, eventDate: { gte: thirtyDaysAgo } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.aggregate({
        where: {
          status: { in: ["COMPLETED", "CONFIRMED"] },
          eventDate: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
        _sum: { totalAmount: true },
      }),
      prisma.booking.findMany({
        where: {
          eventDate: {
            gte: today,
            lt: new Date(today.getTime() + 86_400_000),
          },
        },
        select: {
          bookingNumber: true,
          startTime: true,
          eventType: true,
          city: true,
          status: true,
          customer: { select: { firstName: true, lastName: true } },
          vehicle: { select: { code: true } },
        },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.findMany({
        where: { status: { in: ["PENDING_REVIEW", "CANCELLATION_REQUESTED"] } },
        select: {
          id: true,
          bookingNumber: true,
          eventType: true,
          totalAmount: true,
          status: true,
          cancellationReason: true,
          customer: { select: { firstName: true, lastName: true } },
        },
        take: 15,
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      }),
      prisma.vehicle.findMany({
        select: { code: true, type: true, status: true },
        orderBy: { code: "asc" },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ["CONFIRMED", "COMPLETED"] },
          eventDate: { gte: sevenDaysAgo },
        },
        select: { eventDate: true, totalAmount: true },
      }),
    ]);

    // Build revenue chart
    const revenueChart = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayKey = d.toISOString().split("T")[0];
      const revenue = sevenDaysBookings
        .filter((b) => b.eventDate.toISOString().split("T")[0] === dayKey)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      return { day: dayLabel, revenue };
    });

    const currentWeekRev = weekRevAggr._sum.totalAmount || 0;
    const prevWeekRev = previousWeekRevAggr._sum.totalAmount || 0;
    let revTrend = 0;
    if (prevWeekRev > 0) {
      revTrend = ((currentWeekRev - prevWeekRev) / prevWeekRev) * 100;
    }

    return {
      rawStats: {
        pendingReviews,
        cancellationRequests,
        newInquiries,
        totalCustomers,
        completedMonthBookings,
        currentWeekRev,
        monthRevenue: monthRevAggr._sum.totalAmount || 0,
        revTrend,
        activeFleet: vehicles.filter((v) => v.status === "ON_JOB").length,
        totalFleet: vehicles.length,
      },
      todayBookings,
      actionRequiredBookings,
      vehicles,
      revenueChart,
    };
  },
  ["admin-dashboard-data"],
  { revalidate: 30 } // Cache for 30 seconds
);

export async function GET(req: Request) {
  // Rate limit: 60 requests per minute per IP
  const limited = checkRateLimit(req, { limit: 60, windowMs: 60_000, prefix: "dashboard" });
  if (limited) return limited;

  try {
    const user = await getSessionUser(req);
    if (!user) return unauthenticated();

    const canViewFull = hasPermission(user.role, "dashboard.view");
    const canViewLimited = hasPermission(user.role, "dashboard.view.limited");

    if (!canViewFull && !canViewLimited) {
      return unauthorized();
    }

    const cached = await getCachedDashboardData();
    const { rawStats, todayBookings, actionRequiredBookings, vehicles, revenueChart } = cached;

    const stats = {
      todayJobs: todayBookings.length,
      pending: rawStats.pendingReviews,
      cancellations: rawStats.cancellationRequests,
      newInquiries: rawStats.newInquiries,
      activeFleet: rawStats.activeFleet,
      totalFleet: rawStats.totalFleet,
      // Redact financial data for limited roles
      weekRevenue: canViewFull ? rawStats.currentWeekRev : 0,
      monthRevenue: canViewFull ? rawStats.monthRevenue : 0,
      revenueTrend: canViewFull ? rawStats.revTrend : 0,
      completedMonth: rawStats.completedMonthBookings,
      totalCustomers: rawStats.totalCustomers,
    };

    logger.info("Dashboard data served", { userId: user.id, role: user.role, cached: true });

    return NextResponse.json({
      success: true,
      data: {
        stats,
        todayBookings,
        actionRequiredBookings,
        vehicles,
        revenueChart: canViewFull ? revenueChart : [],
      },
    });
  } catch (error: any) {
    logger.error("Dashboard API Error", { error: error.message, stack: error.stack });
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
