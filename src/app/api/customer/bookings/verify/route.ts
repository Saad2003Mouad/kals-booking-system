import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

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

    // 1. Get the latest active OTP for this email
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        verified: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "INVALID_CODE", message: "No active verification code found or code expired." },
        { status: 400 }
      );
    }

    // 2. Check if account is locked
    if (otpRecord.lockedUntil && otpRecord.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((otpRecord.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { success: false, error: "RATE_LIMIT", message: `Too many failed attempts. Try again in ${minutesLeft} minutes.` },
        { status: 429 }
      );
    }

    // 3. Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "EXPIRED_CODE", message: "Verification code expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 4. Validate Code
    if (otpRecord.code !== normalizedOtp) {
      const newAttempts = (otpRecord.attempts || 0) + 1;
      const updates: any = { attempts: newAttempts };
      
      let message = "Invalid verification code.";
      if (newAttempts >= MAX_ATTEMPTS) {
        updates.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
        message = `Too many failed attempts. Locked for ${LOCK_MINUTES} minutes.`;
      } else {
        message = `Invalid verification code. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`;
      }

      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: updates,
      });

      return NextResponse.json(
        { success: false, error: "INVALID_CODE", message },
        { status: 400 }
      );
    }

    // 5. Verify the booking exists and matches bookingNumber + email
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
      select: { id: true, customerId: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "INVALID_CODE", message: "We couldn't verify this code for the provided booking." },
        { status: 400 }
      );
    }

    // 6. Mark OTP as verified
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // 7. Generate JWT Cookie
    const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only");
    const jwt = await new SignJWT({
      bookingId: booking.id,
      customerId: booking.customerId,
      role: "CUSTOMER"
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({
      success: true,
      customerPortalUrl: `/customer/booking/${booking.id}`,
    });

    // Set HttpOnly cookie
    response.cookies.set("bl_customer_session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;

  } catch (err) {
    console.error("[Booking Verify] Internal error", err);
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
