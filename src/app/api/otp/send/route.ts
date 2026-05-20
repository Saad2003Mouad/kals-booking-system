import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, sendOtpEmail, OTP_TTL } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // DB-backed Cooldown (60s)
    const lastOtp = await prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" }
    });

    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 60000) {
      return NextResponse.json({ error: "Please wait 60s before resending" }, { status: 429 });
    }
    
    // Invalidate previous unused codes for this email
    await prisma.otpCode.deleteMany({ where: { email } });
    
    const code      = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL * 60 * 1000);

    // Save to DB
    await prisma.otpCode.create({
      data: { email, code, expiresAt, verified: false }
    });

    // If SMTP not configured → dev mode: return code in response
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    if (smtpConfigured) {
      const sent = await sendOtpEmail(email, code, firstName);
      if (!sent) return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
      return NextResponse.json({ success: true, devCode: null });
    } else {
      // Dev mode: return code directly (remove in production)
      console.log(`[DEV OTP] ${email} → ${code}`);
      return NextResponse.json({ success: true, devCode: code, devNote: "SMTP not configured — code shown for development only" });
    }
  } catch (err) {
    console.error("[OTP Send]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
