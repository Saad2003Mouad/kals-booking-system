export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "bookings.view");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        inquiry: { select: { id: true, name: true } },
        booking: { select: { id: true, bookingNumber: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "bookings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { title, description, priority, dueDate, assignedToId, inquiryId, bookingId, customerId } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        status: "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId,
        inquiryId,
        bookingId,
        customerId,
      }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "TASK",
        entityId: task.id,
        action: "TASK_CREATED",
        metadataJson: JSON.stringify({ title, assignedToId })
      }
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("Failed to create task", error);
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}
