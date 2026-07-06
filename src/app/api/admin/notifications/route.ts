import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthenticated } from "@/lib/rbac";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Cache notification data for 20 seconds.
// This prevents DB hammering when all admin sessions poll simultaneously.
const getCachedNotifications = unstable_cache(
  async () => {
    const [pendingBookings, cancellationRequests, newInquiries] = await Promise.all([
      prisma.booking.findMany({
        where: { status: "PENDING_REVIEW" },
        select: {
          id: true,
          bookingNumber: true,
          eventType: true,
          createdAt: true,
          customer: { select: { firstName: true, lastName: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.findMany({
        where: { status: "CANCELLATION_REQUESTED" },
        select: {
          id: true,
          bookingNumber: true,
          updatedAt: true,
          customer: { select: { firstName: true, lastName: true } },
        },
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.inquiry.findMany({
        where: { status: "NEW" },
        select: { id: true, name: true, notes: true, createdAt: true },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const notifications: Array<{
      id: string;
      title: string;
      body: string;
      type: "info" | "warning" | "error" | "success";
      time: string;
      read: boolean;
      link: string;
    }> = [];

    // Cancellations first (highest priority)
    cancellationRequests.forEach((b) => {
      notifications.push({
        id: `cancel-${b.id}`,
        title: "Cancellation Requested",
        body: `${b.customer?.firstName} ${b.customer?.lastName} — #${b.bookingNumber}`,
        type: "error",
        time: new Date(b.updatedAt).toLocaleDateString("en-US"),
        read: false,
        link: `/admin/bookings/${b.id}`,
      });
    });

    pendingBookings.forEach((b) => {
      notifications.push({
        id: `pending-${b.id}`,
        title: "New Booking Pending Review",
        body: `${b.customer?.firstName} ${b.customer?.lastName} — ${b.eventType}`,
        type: "warning",
        time: new Date(b.createdAt).toLocaleDateString("en-US"),
        read: false,
        link: `/admin/bookings/${b.id}`,
      });
    });

    newInquiries.forEach((i) => {
      notifications.push({
        id: `inq-${i.id}`,
        title: "New Inquiry",
        body: `${i.name}: ${(i.notes || "").substring(0, 60)}${(i.notes || "").length > 60 ? "…" : ""}`,
        type: "info",
        time: new Date(i.createdAt).toLocaleDateString("en-US"),
        read: false,
        link: `/admin/inquiries`,
      });
    });

    return notifications;
  },
  ["admin-notifications"],
  { revalidate: 20 } // Cache for 20 seconds
);

export async function GET(req: Request) {
  // Rate limit: 30 requests per minute per IP
  const limited = checkRateLimit(req, { limit: 30, windowMs: 60_000, prefix: "notifications" });
  if (limited) return limited;

  try {
    const user = await getSessionUser(req);
    if (!user || user.role === "DRIVER") return unauthenticated();

    const notifications = await getCachedNotifications();

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: { count: notifications.length },
    });
  } catch (error: any) {
    console.error("Notifications API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
