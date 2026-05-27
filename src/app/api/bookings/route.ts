import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateBooking } from "@/lib/aiEngine";
import { sendBookingPendingEmail, sendBookingApprovedEmail } from "@/lib/email";
import { z } from "zod";

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw lastError;
}

const BookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").transform(v => v.replace(/[^\d+\-\s()]/g,"")),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().length(5, "ZIP code must be 5 digits"),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  durationMins: z.coerce.number().min(30),
  guests: z.coerce.number().min(1),
  eventType: z.string().min(1, "Event type is required"),
  packageId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  totalAmount: z.coerce.number().min(1),
  travelFee: z.coerce.number().default(0),
  overtimeFee: z.coerce.number().default(0),
  extraPieceFee: z.coerce.number().default(0),
  distanceMiles: z.coerce.number().default(0),
  additionalStops: z.coerce.number().default(0),
  additionalStopsFee: z.coerce.number().default(0),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  bookingStops: z.array(z.any()).optional(),
});

function genBookingNumber() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  return `BL-${date}-${Math.floor(1000+Math.random()*9000)}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page   = parseInt(searchParams.get("page") ?? "1");
  const limit  = 20;
  const where: any = status ? { status } : {};

  const [bookings, total] = await withRetry(() => Promise.all([
    prisma.booking.findMany({
      where,
      include: { customer: true, vehicle: true },
      orderBy: { createdAt: "desc" },
      skip: (page-1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]));

  return NextResponse.json({ bookings, total, page, pages: Math.ceil(total/limit) });
}

  export async function POST(req: NextRequest) {
    try {
      const json = await req.json();
      console.log("Booking API body:", json);
      const result = BookingSchema.safeParse(json);
  
      if (!result.success) {
        return NextResponse.json({ 
          error: "Validation failed", 
          missingFields: Object.keys(result.error.flatten().fieldErrors),
          details: result.error.flatten().fieldErrors 
        }, { status: 400 });
      }

    const {
      firstName, lastName, email, phone,
      address, city, zip,
      eventDate, startTime, durationMins,
      guests, eventType, packageId, notes,
      totalAmount, travelFee, overtimeFee, extraPieceFee, distanceMiles,
      additionalStops, additionalStopsFee, bookingStops,
      latitude, longitude
    } = result.data;

    // ── 1. Run AI Engine ──────────────────────────────────────
    const aiDecision = await evaluateBooking({
      eventDate, startTime,
      durationMins,
      zip, city,
      totalAmount,
      distanceMiles,
      packageId: packageId || undefined, 
      guests,
      eventType,
    });

    // ── 2. If hard rejected, return immediately (no booking created) ──
    if (aiDecision.verdict === "REJECTED") {
      return NextResponse.json({
        rejected: true,
        decision: aiDecision,
      }, { status: 200 });
    }

    // ── 3. Upsert customer ────────────────────────────────────
    let customer = await withRetry(() => prisma.customer.findFirst({ where: { phone } }));
    if (!customer) {
      customer = await withRetry(() => prisma.customer.create({
        data: { firstName, lastName, email, phone, address, city, zip },
      }));
    }

    // ── 4. Determine booking status ───────────────────────────
    // APPROVED → CONFIRMED (ready for payment)
    // PENDING_REVIEW → PENDING_REVIEW (admin must approve/reject)
    const status = aiDecision.autoConfirm ? "CONFIRMED" : "PENDING_REVIEW";

    // ── 5. Create booking ─────────────────────────────────────
    const booking = await withRetry(() => prisma.booking.create({
      data: {
        bookingNumber: genBookingNumber(),
        customerId: customer.id,
        packageId: packageId as string,
        status: status as any,
        eventDate: new Date(eventDate),
        startTime,
        durationMins: durationMins,
        address, city, zip,
        guests: guests,
        eventType,
        additionalStops: additionalStops ?? 0,
        additionalStopsFee: additionalStopsFee ?? 0,
        totalAmount,
        notes: notes || null,
        items: {
          create: [
            { lineType: "PACKAGE", description: "Package base price", quantity: 1, unitPrice: totalAmount - travelFee - overtimeFee - extraPieceFee - (additionalStopsFee ?? 0), totalPrice: totalAmount - travelFee - overtimeFee - extraPieceFee - (additionalStopsFee ?? 0) },
            ...(travelFee > 0 ? [{ lineType: "TRAVEL", description: "Travel fee",     quantity: 1, unitPrice: travelFee,   totalPrice: travelFee }]   : []),
            ...(overtimeFee > 0 ? [{ lineType: "OVERTIME", description: "Overtime fee",   quantity: 1, unitPrice: overtimeFee, totalPrice: overtimeFee }] : []),
            ...(extraPieceFee > 0 ? [{ lineType: "EXTRA_GUESTS", description: "Extra guests fee",   quantity: 1, unitPrice: extraPieceFee, totalPrice: extraPieceFee }] : []),
            ...((additionalStopsFee ?? 0) > 0 ? [{ lineType: "MULTI_STOP", description: `Additional stops (${additionalStops})`, quantity: additionalStops ?? 1, unitPrice: 50, totalPrice: additionalStopsFee ?? 0 }] : []),
          ],
        },
        quote: {
          create: {
            basePrice:     totalAmount - travelFee - overtimeFee,
            distanceMiles: distanceMiles,
            travelFee:     travelFee,
            overtimeFee:   overtimeFee,
            totalAmount:   totalAmount,
            snapshotJson:  JSON.stringify({ packageId, guests, durationMins, zip, city, additionalStops, aiFlags: aiDecision.flags }),
          },
        },
        ...(bookingStops && bookingStops.length > 0 ? {
          stops: {
            create: bookingStops.map((stop: any, idx: number) => ({
              stopOrder: idx + 1,
              street: stop.street,
              city: stop.city,
              state: stop.state || "MA",
              zipCode: stop.zipCode,
              notes: stop.notes || null,
            }))
          }
        } : {})
      },
      include: { customer: true, stops: true },
    }));

    // ── 6. Audit log ──────────────────────────────────────────
    await withRetry(() => prisma.auditLog.create({
      data: {
        entityType: "BOOKING",
        entityId: booking.id,
        action: `AI_${aiDecision.verdict}`,
        metadataJson: JSON.stringify({ flags: aiDecision.flags, reason: aiDecision.reason }),
      },
    }));

    // Fetch readable package name
    let dbPackageName = "Custom Package";
    if (packageId) {
      const dbPkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (dbPkg) {
        dbPackageName = dbPkg.name;
      }
    }

    // ── 7. Send Emails ────────────────────────────────────────
    if (aiDecision.autoConfirm) {
      // Block response for emails so they finish on serverless environments like Vercel
      await sendBookingApprovedEmail(email, firstName, booking.bookingNumber, `/customer/booking/${booking.id}`, totalAmount.toFixed(2), booking.id);
    } else {
      await sendBookingPendingEmail(email, firstName, booking.bookingNumber, {
        eventDate,
        startTime,
        durationMins,
        guests,
        eventType,
        address,
        city,
        zip,
        packageName: dbPackageName,
        basePrice: totalAmount - travelFee - overtimeFee - extraPieceFee,
        extraServingsFee: extraPieceFee,
        travelFee,
        overtimeFee,
        totalAmount,
        distanceMiles: distanceMiles
      }, booking.id);
    }

    return NextResponse.json({
      booking,
      decision: aiDecision,
      paymentUrl: null,
      paymentEnabled: false,
      status,
      customerPortalUrl: `/customer/booking/${booking.id}`
    }, { status: 201 });

  } catch (err) {
    console.error("[Booking API Error]", err);
    return NextResponse.json({ error: "Booking creation failed. Please try again." }, { status: 500 });
  }
}
