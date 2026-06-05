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

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        tasks: true,
      }
    });

    if (!inquiry) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch inquiry" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "bookings.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { status, priority, assignedToId, internalNote } = body;
    
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
    if (internalNote !== undefined) updateData.internalNote = internalNote;

    const updated = await prisma.inquiry.update({
      where: { id: params.id },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true } }
      }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "INQUIRY",
        entityId: updated.id,
        action: "INQUIRY_UPDATED",
        metadataJson: JSON.stringify(updateData)
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update inquiry", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}
