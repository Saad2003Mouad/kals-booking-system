import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requirePermission(req, "drivers.assign");
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { name, email, password, phone, active } = await req.json();

  const userUpdate: Record<string, unknown> = {};
  if (email) userUpdate.email = email;
  if (name) userUpdate.name = name;
  if (password) userUpdate.passwordHash = await bcrypt.hash(password, 12);
  if (Object.keys(userUpdate).length > 0) {
    await prisma.user.update({ where: { id: params.id }, data: userUpdate });
  }

  const driverUpdate: Record<string, unknown> = {};
  if (active !== undefined) driverUpdate.active = active;
  if (phone !== undefined) driverUpdate.phone = phone;
  if (name) driverUpdate.displayName = name;
  if (Object.keys(driverUpdate).length > 0) {
    await prisma.driver.updateMany({
      where: { userId: params.id },
      data: driverUpdate,
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requirePermission(req, "drivers.assign");
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  await prisma.driver.deleteMany({ where: { userId: params.id } });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
