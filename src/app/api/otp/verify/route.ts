import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code)
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = String(code).trim();

    // Validate OTP against DB
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        code: normalizedCode,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired code. Please try again." },
        { status: 400 }
      );
    }

    // Mark OTP as verified to prevent reuse
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[OTP Verify]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
