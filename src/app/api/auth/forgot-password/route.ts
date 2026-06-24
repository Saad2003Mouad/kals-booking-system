export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, OTP_TTL } from "@/lib/otp";
import { sendForgotPasswordEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

// POST /api/auth/forgot-password — send reset OTP
// POST /api/auth/forgot-password?action=verify — verify OTP code
// POST /api/auth/forgot-password?action=reset — set new password

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") ?? "send";

  if (action === "send") {
    return handleSend(req);
  } else if (action === "verify") {
    return handleVerify(req);
  } else if (action === "reset") {
    return handleReset(req);
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// ─── STEP 1: Send OTP ──────────────────────────────────────────
async function handleSend(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email?.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
    const user = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    // Always return success to prevent email enumeration
    if (!user) {
      console.log(`[ForgotPwd] Email not found: ${normalizedEmail} — returning success for security`);
      return NextResponse.json({ success: true });
    }

    // Rate limit: 60s cooldown per email
    const lastOtp = await prisma.otpCode.findFirst({
      where: { email: normalizedEmail, purpose: "PASSWORD_RESET", verified: false },
      orderBy: { createdAt: "desc" },
    });
    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 60000) {
      return NextResponse.json({ error: "Please wait 60 seconds before requesting again" }, { status: 429 });
    }

    // Invalidate old codes
    await prisma.otpCode.deleteMany({ where: { email: normalizedEmail, purpose: "PASSWORD_RESET", verified: false } });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL * 60 * 1000);
    await prisma.otpCode.create({ data: { email: normalizedEmail, code, expiresAt, verified: false, purpose: "PASSWORD_RESET" } });

    await sendForgotPasswordEmail(normalizedEmail, code, user.name.split(" ")[0]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ForgotPwd/send]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── STEP 2: Verify OTP ─────────────────────────────────────────
async function handleVerify(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    const normalizedEmail = email.trim().toLowerCase();
    const MAX_ATTEMPTS = 5;
    const LOCK_MINUTES = 15;

    const otpRecord = await prisma.otpCode.findFirst({
      where: { email: normalizedEmail, purpose: "PASSWORD_RESET", verified: false },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) return NextResponse.json({ error: "No active reset code. Please request a new one." }, { status: 400 });

    if (otpRecord.lockedUntil && otpRecord.lockedUntil > new Date()) {
      const mins = Math.ceil((otpRecord.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ error: `Too many attempts. Try again in ${mins} minutes.` }, { status: 429 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
    }

    if (otpRecord.code !== String(code).trim()) {
      const newAttempts = (otpRecord.attempts || 0) + 1;
      const updates: any = { attempts: newAttempts };
      let errorMsg = `Invalid code. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`;
      if (newAttempts >= MAX_ATTEMPTS) {
        updates.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
        errorMsg = `Too many failed attempts. Locked for ${LOCK_MINUTES} minutes.`;
      }
      await prisma.otpCode.update({ where: { id: otpRecord.id }, data: updates });
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Mark as verified — not deleted yet (still needed for reset step)
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { verified: true } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ForgotPwd/verify]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── STEP 3: Reset Password ─────────────────────────────────────
async function handleReset(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    const normalizedEmail = email.trim().toLowerCase();

    // Confirm the OTP was verified in the previous step
    const otpRecord = await prisma.otpCode.findFirst({
      where: { email: normalizedEmail, purpose: "PASSWORD_RESET", code: String(code).trim(), verified: true },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) return NextResponse.json({ error: "Invalid or expired reset session. Please start over." }, { status: 400 });
    if (otpRecord.expiresAt < new Date()) return NextResponse.json({ error: "Reset session expired. Please start over." }, { status: 400 });

    // Find and update user
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    const user = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    // Consume the OTP
    await prisma.otpCode.deleteMany({ where: { email: normalizedEmail, purpose: "PASSWORD_RESET" } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        entityType: "USER",
        entityId: user.id,
        action: "PASSWORD_RESET",
        metadataJson: JSON.stringify({ method: "OTP_EMAIL", at: new Date().toISOString() }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ForgotPwd/reset]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
