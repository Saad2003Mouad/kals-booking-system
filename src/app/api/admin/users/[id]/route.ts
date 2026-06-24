export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requirePermission(req, "users.update");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const loggedInUser = auth.user!;

    // Fetch target user first to check if they are OWNER
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Double check: if target user is OWNER and logged in user is not OWNER, block
    if (targetUser.role === "OWNER" && loggedInUser.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Unauthorized: Only an OWNER can modify OWNER users." }, { status: 403 });
    }

    const body = await req.json();
    const { role, permissions, active } = body;

    // Double check: if attempting to change target user to OWNER or from OWNER and logged in user is not OWNER, block
    if ((role === "OWNER" || targetUser.role === "OWNER") && loggedInUser.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Unauthorized: Only an OWNER can change OWNER roles." }, { status: 403 });
    }

    const data: any = {};
    if (role !== undefined) data.role = role;
    if (permissions !== undefined) data.permissions = permissions;
    if (active !== undefined) data.active = active;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, permissions: true, active: true }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "USER",
        entityId: updatedUser.id,
        action: "USER_UPDATED",
        metadataJson: JSON.stringify({ updatedFields: Object.keys(data), role, permissions }),
        actorId: loggedInUser.id
      }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Failed to update user", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}
