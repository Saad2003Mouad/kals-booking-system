import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { email, code, purpose = "BOOKING" } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = String(code).trim();
    const validPurposes = ["BOOKING", "PORTAL", "PASSWORD_RESET", "EMAIL_CHANGE", "SETTINGS", "STAFF_INVITE", "GENERAL"];
    const safePurpose = validPurposes.includes(purpose) ? purpose : "GENERAL";

    // Find the latest unverified OTP record for this email + purpose
    const otpRecord = await prisma.otpCode.findFirst({
      where: { email: normalizedEmail, purpose: safePurpose, verified: false },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired code. Please request a new one." }, { status: 400 });
    }

    // Lockout check
    if (otpRecord.lockedUntil && otpRecord.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((otpRecord.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` }, { status: 429 });
    }

    // Expiry check
    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Verification code expired. Please request a new one." }, { status: 400 });
    }

    // Code validation
    if (otpRecord.code !== normalizedCode) {
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

    // Mark verified (not deleted — some flows need to reference it in the next step)
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { verified: true } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[OTP Verify]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
