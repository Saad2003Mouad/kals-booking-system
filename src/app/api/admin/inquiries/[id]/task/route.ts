export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { title, description, assignedToId, priority, dueDate } = await req.json();

    const inquiry = await prisma.inquiry.findUnique({ where: { id: params.id } });
    if (!inquiry) return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        priority: priority || "MEDIUM",
        status: "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        inquiryId: inquiry.id,
      }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "TASK",
        entityId: task.id,
        action: "TASK_CREATED_FROM_INQUIRY",
        metadataJson: JSON.stringify({ inquiryId: inquiry.id, title, assignedToId })
      }
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("Create task from inquiry error:", error);
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}
