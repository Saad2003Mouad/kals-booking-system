export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { sendStaffInviteEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// POST /api/admin/staff-invite — create invitation (OWNER/ADMIN only)
// GET  /api/admin/staff-invite?token=xxx — verify invite token  
// POST /api/admin/staff-invite?action=accept — accept invite + set password

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  try {
    const invite = await prisma.staffInvite.findUnique({ where: { token } });
    if (!invite) return NextResponse.json({ error: "Invalid invitation link" }, { status: 404 });
    if (invite.accepted) return NextResponse.json({ error: "This invitation has already been used" }, { status: 400 });
    if (invite.expiresAt < new Date()) return NextResponse.json({ error: "This invitation has expired. Please ask your admin to send a new one." }, { status: 400 });

    return NextResponse.json({ success: true, data: { email: invite.email, role: invite.role } });
  } catch (err) {
    console.error("[StaffInvite/GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") ?? "create";

  if (action === "create") return handleCreate(req);
  if (action === "accept") return handleAccept(req);
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// ─── CREATE INVITE (Owner/Admin only) ───────────────────────────
async function handleCreate(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "users.create");
    if (!auth.success) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

    const { email, role = "SUPPORT" } = await req.json();
    if (!email?.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

    // Check if user already exists
    const allUsers = await prisma.user.findMany({ select: { email: true } });
    const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });

    // Revoke old invites for this email
    await prisma.staffInvite.deleteMany({ where: { email: email.toLowerCase() } });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    await prisma.staffInvite.create({
      data: {
        email: email.toLowerCase(),
        role,
        token,
        invitedById: auth.user?.id,
        expiresAt,
      },
    });

    const inviterName = auth.user?.role === "OWNER" ? "the Boston Legend Owner" : (auth.user as any)?.name || "Admin";
    await sendStaffInviteEmail(email.toLowerCase(), inviterName, token, role);

    await prisma.auditLog.create({
      data: {
        entityType: "USER",
        entityId: token,
        action: "STAFF_INVITE_SENT",
        metadataJson: JSON.stringify({ email, role, invitedById: auth.user?.id }),
        actorId: auth.user?.id,
      },
    });

    return NextResponse.json({ success: true, message: "Invitation sent" });
  } catch (err) {
    console.error("[StaffInvite/create]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── ACCEPT INVITE ───────────────────────────────────────────────
async function handleAccept(req: NextRequest) {
  try {
    const { token, name, password } = await req.json();
    if (!token || !name || !password) return NextResponse.json({ error: "Token, name, and password required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    if (name.trim().length < 2) return NextResponse.json({ error: "Please provide your full name" }, { status: 400 });

    const invite = await prisma.staffInvite.findUnique({ where: { token } });
    if (!invite) return NextResponse.json({ error: "Invalid invitation" }, { status: 404 });
    if (invite.accepted) return NextResponse.json({ error: "This invitation has already been used" }, { status: 400 });
    if (invite.expiresAt < new Date()) return NextResponse.json({ error: "Invitation expired. Please request a new one." }, { status: 400 });

    // Check email not already taken
    const allUsers = await prisma.user.findMany({ select: { email: true } });
    if (allUsers.some(u => u.email.toLowerCase() === invite.email)) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: { email: invite.email, name: name.trim(), passwordHash, role: invite.role, permissions: [], active: true },
      select: { id: true, email: true, name: true, role: true },
    });

    // Mark invite as accepted
    await prisma.staffInvite.update({ where: { token }, data: { accepted: true } });

    await prisma.auditLog.create({
      data: {
        entityType: "USER",
        entityId: newUser.id,
        action: "STAFF_INVITE_ACCEPTED",
        metadataJson: JSON.stringify({ email: invite.email, role: invite.role, invitedById: invite.invitedById }),
      },
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (err: any) {
    console.error("[StaffInvite/accept]", err);
    if (err.code === "P2002") return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
