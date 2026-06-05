import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "notifications.view");
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const pendingBookings = await prisma.booking.count({ where: { status: "PENDING" } });
  const pendingTasks = 0;
  const recentAudit = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
  });

  const notifications = [
    ...recentAudit
      .filter(a => a.action.startsWith("AI_") || a.action === "CONFIRMED" || a.action === "CANCELLED")
      .map((a: any) => ({
        id: a.id,
        type: a.action.includes("APPROVED") ? "success"
            : a.action.includes("REJECTED") ? "error"
            : "info",
        title: a.action.includes("APPROVED") ? "Booking Auto-Approved"
             : a.action.includes("REJECTED") ? "Booking Rejected"
             : a.action.includes("PENDING") ? "Booking Needs Review"
             : "Booking Updated",
        message: a.details ?? "",
        time: a.createdAt,
        read: false,
      })),
    ...(pendingBookings > 0 ? [{
      id: "pending-alert",
      type: "warning" as const,
      title: `${pendingBookings} Booking${pendingBookings > 1 ? "s" : ""} Awaiting Approval`,
      message: "Review and approve or reject pending booking requests",
      time: new Date(),
      read: false,
    }] : []),
    ...(pendingTasks > 0 ? [{
      id: "tasks-alert",
      type: "info" as const,
      title: `${pendingTasks} Pending Task${pendingTasks > 1 ? "s" : ""}`,
      message: "You have tasks that need attention",
      time: new Date(),
      read: false,
    }] : []),
  ];

  return NextResponse.json({
    notifications: notifications.slice(0, 10),
    unreadCount: notifications.filter(n => !n.read).length,
  });
}
