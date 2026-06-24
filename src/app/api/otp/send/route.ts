import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, OTP_TTL } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, purpose = "BOOKING" } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const validPurposes = ["BOOKING", "PORTAL", "PASSWORD_RESET", "EMAIL_CHANGE", "SETTINGS", "STAFF_INVITE", "GENERAL"];
    const safePurpose = validPurposes.includes(purpose) ? purpose : "GENERAL";

    // DB-backed Cooldown (60s)
    const lastOtp = await prisma.otpCode.findFirst({
      where: { email, purpose: safePurpose },
      orderBy: { createdAt: "desc" }
    });

    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 60000) {
      return NextResponse.json({ error: "Please wait 60s before resending" }, { status: 429 });
    }

    // Invalidate previous unused codes for this email+purpose
    await prisma.otpCode.deleteMany({ where: { email, purpose: safePurpose, verified: false } });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL * 60 * 1000);

    // Save to DB
    await prisma.otpCode.create({
      data: { email, code, expiresAt, verified: false, purpose: safePurpose }
    });

    // Send OTP email
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    if (smtpConfigured) {
      const sent = await sendOtpEmail(email, code, firstName, safePurpose as any);
      if (!sent) return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
      return NextResponse.json({ success: true, devCode: null });
    } else {
      // Dev mode: return code directly
      console.log(`[DEV OTP] ${email} → ${code} (purpose: ${safePurpose})`);
      return NextResponse.json({ success: true, devCode: code, devNote: "SMTP not configured — code shown for development only" });
    }
  } catch (err) {
    console.error("[OTP Send]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
