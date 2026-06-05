import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "drivers.view");
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const users = await prisma.user.findMany({
    where: { role: "DRIVER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      driver: {
        select: { id: true, active: true, phone: true, displayName: true }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users.map(u => ({
    id: u.id,
    name: u.driver?.displayName || u.name || "Driver",
    email: u.email,
    phone: u.driver?.phone || "",
    active: u.driver?.active ?? true,
    createdAt: u.createdAt,
  })));
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "drivers.assign");
  if (!auth.success) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const { name, email, password, phone, active } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, name, passwordHash: hash, role: "DRIVER" },
  });
  const driver = await prisma.driver.create({
    data: { userId: user.id, displayName: name, phone: phone ?? null, active: active ?? true },
  });

  return NextResponse.json(
    { id: user.id, name, email: user.email, phone: driver.phone || "", active: driver.active },
    { status: 201 }
  );
}
