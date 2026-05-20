import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    // MOCKED OTP VALIDATION
    // return NextResponse.json({ error: "Invalid or expired code. Please try again." }, { status: 400 });
    
    // Accept all codes for now since schema has no otpCode

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[OTP Verify]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
