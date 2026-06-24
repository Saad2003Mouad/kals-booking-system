export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "users.view");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "users.create");
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const loggedInUser = auth.user!;

    const body = await req.json();
    const { name, email, role, permissions, password } = body;

    // Validate inputs
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Double check that only OWNER can create an OWNER or ADMIN user
    if ((role === "OWNER" || role === "ADMIN") && loggedInUser.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Only an OWNER can create OWNER or ADMIN accounts." }, { status: 403 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        permissions: permissions || [],
      },
      select: { id: true, name: true, email: true, role: true, permissions: true }
    });

    await prisma.auditLog.create({
      data: {
        entityType: "USER",
        entityId: user.id,
        action: "USER_CREATED",
        metadataJson: JSON.stringify({ name, email, role, permissions }),
        actorId: loggedInUser.id
      }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Failed to create user", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
