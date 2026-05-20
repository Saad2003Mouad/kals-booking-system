export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPermission, unauthorized } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hasAccess = await checkPermission(req, "manage_users");
    if (!hasAccess) return unauthorized();

    const body = await req.json();
    const { role, permissions } = body;

    const data: any = {};
    if (role !== undefined) data.role = role;
    if (permissions !== undefined) data.permissions = permissions;

    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, permissions: true }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "USER",
        entityId: user.id,
        action: "USER_UPDATED",
        metadataJson: JSON.stringify({ updatedFields: Object.keys(data), role, permissions })
      }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Failed to update user", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}
