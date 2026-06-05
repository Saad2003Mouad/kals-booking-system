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

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        tasks: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Failed to fetch inquiries", error);
    return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
