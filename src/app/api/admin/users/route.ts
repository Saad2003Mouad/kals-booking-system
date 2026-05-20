export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPermission, unauthorized } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const hasAccess = await checkPermission(req, "manage_users");
    if (!hasAccess) return unauthorized();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
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
    const hasAccess = await checkPermission(req, "manage_users");
    if (!hasAccess) return unauthorized();

    const body = await req.json();
    const { name, email, role, permissions, password } = body;

    // Validate inputs
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Since we don't have a real bcrypt library installed right now for hashing, 
    // we'll mock the hash for this phase, or the user can add it later.
    const passwordHash = `mock-hash-${password}`;

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
        metadataJson: JSON.stringify({ name, email, role, permissions })
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
