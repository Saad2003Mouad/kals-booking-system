import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingNumber, email, otp } = body;

    if (!bookingNumber || !email || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Booking number, email, and verification code are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedBookingNumber = String(bookingNumber).trim().toUpperCase();
    const normalizedOtp = String(otp).trim();

    // 1. Validate the OTP from DB
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        code: normalizedOtp,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_CODE",
          message:
            "We couldn't verify this code. Please check the code and try again, or request a new one.",
        },
        { status: 400 }
      );
    }

    // 2. Verify the booking exists and matches bookingNumber + email
    const booking = await prisma.booking.findFirst({
      where: {
        bookingNumber: normalizedBookingNumber,
        customer: {
          email: {
            equals: normalizedEmail,
            mode: "insensitive",
          },
        },
      },
      select: { id: true },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_CODE",
          message:
            "We couldn't verify this code. Please check the code and try again, or request a new one.",
        },
        { status: 400 }
      );
    }

    // 3. Mark OTP as verified to prevent reuse
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // 4. Return customer portal URL (booking.id is the token)
    return NextResponse.json({
      success: true,
      customerPortalUrl: `/customer/booking/${booking.id}`,
    });
  } catch (err) {
    console.error("[Booking Verify] Internal error");
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
