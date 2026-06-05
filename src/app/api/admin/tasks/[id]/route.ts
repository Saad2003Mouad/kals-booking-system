export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.view");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        inquiry: true,
        booking: true,
        customer: true,
      }
    });

    if (!task) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { title, description, priority, status, dueDate, assignedToId } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;

    const updated = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true } }
      }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "TASK",
        entityId: updated.id,
        action: "TASK_UPDATED",
        metadataJson: JSON.stringify(updateData)
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update task", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    await prisma.task.delete({
      where: { id: params.id }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "TASK",
        entityId: params.id,
        action: "TASK_DELETED",
        metadataJson: JSON.stringify({})
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
