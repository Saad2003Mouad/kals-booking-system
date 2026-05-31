import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateBooking } from "@/lib/aiEngine";
import { sendBookingPendingEmail, sendBookingApprovedEmail, sendBookingPendingReviewEmail } from "@/lib/email";
import { calculateQuote } from "@/lib/pricing";
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
  additionalGuests: z.coerce.number().default(0),
  extraServiceMins: z.coerce.number().default(0),
  extraServiceFee: z.coerce.number().default(0),
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

import { verifyAndCalculateRoute } from "@/lib/locationVerification";

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

    // ── 0.5. Verify locations & calculate accurate distance ──
    const locationMode = json.locationMode || "SINGLE_LOCATION";
    let primaryLocation = json.primaryLocation;
    if (!primaryLocation) {
      primaryLocation = {
        street: address,
        city: city,
        state: json.state || "MA",
        zipCode: zip,
        latitude: latitude || null,
        longitude: longitude || null,
        formattedAddress: address,
        placeId: "",
        locationVerificationMethod: latitude ? "MAP_SELECTED" : "",
        locationVerifiedAt: latitude ? new Date().toISOString() : null
      };
    }

    const routeResult = await verifyAndCalculateRoute(locationMode, primaryLocation, bookingStops || []);
    if ("error" in routeResult) {
      return NextResponse.json({
        success: false,
        error: routeResult.error,
        message: routeResult.message
      }, { status: 400 });
    }

    const resolvedDistance = routeResult.distanceMiles;
    const resolvedPrimaryLocation = routeResult.primaryLoc;
    const resolvedStops = routeResult.verifiedStops;

    // ── 1. Run AI Engine ──────────────────────────────────────
    const aiDecision = await evaluateBooking({
      eventDate, startTime,
      durationMins,
      zip: resolvedPrimaryLocation.zipCode,
      city: resolvedPrimaryLocation.city,
      totalAmount,
      distanceMiles: resolvedDistance,
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
        data: { firstName, lastName, email, phone, address: resolvedPrimaryLocation.street, city: resolvedPrimaryLocation.city, zip: resolvedPrimaryLocation.zipCode },
      }));
    }

    // ── 3.5. Server-side quote recalculation ──────────────────
    let dbPackageName = "Custom Package";
    let finalTotal = totalAmount;
    let finalTravel = travelFee;
    let finalOvertime = overtimeFee;
    let finalExtraGuest = extraPieceFee;
    let finalExtraService = result.data.extraServiceFee || 0;
    let finalStopsFee = additionalStopsFee;
    let quoteBreakdownStr = "{}";

    if (packageId) {
      const dbPkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (dbPkg) {
        dbPackageName = dbPkg.name;
        
        const settings = await prisma.setting.findMany({
          where: { key: { in: ['FREE_MILES', 'RATE_PER_MILE'] } }
        });
        const freeMiles = parseFloat(settings.find(s => s.key === 'FREE_MILES')?.value || "10");
        const ratePerMile = parseFloat(settings.find(s => s.key === 'RATE_PER_MILE')?.value || "2.25");
        
        const packageDurationMins = (dbPkg as any).durationMins ?? (dbPkg as any).includedMinutes ?? 60;
        const extraGuestPrice = (dbPkg as any).extraGuestPrice ?? (dbPkg as any).extraPiecePrice ?? 5;
        
        const q = calculateQuote({
          packagePrice: dbPkg.price || 250,
          servings: dbPkg.servings,
          extraGuestPrice,
          durationMins: packageDurationMins,
          packageDurationMins,
          distanceMiles: resolvedDistance,
          guests: dbPkg.servings + (result.data.additionalGuests || 0),
          additionalStops: resolvedStops ? resolvedStops.length : (additionalStops || 0),
          extraServiceMins: result.data.extraServiceMins || 0,
          freeMiles,
          ratePerMile
        });
        
        finalTotal = q.totalAmount;
        finalTravel = q.travelFee;
        finalOvertime = q.overtimeFee;
        finalExtraGuest = q.extraPieceFee;
        finalExtraService = q.additionalServiceFee || 0;
        finalStopsFee = q.additionalStopsFee;
        
        const fullQuotePayload = {
          packageName: dbPackageName,
          packagePrice: q.basePrice,
          includedGuests: dbPkg.servings,
          includedServiceMins: packageDurationMins,
          additionalGuests: result.data.additionalGuests || 0,
          extraGuestPrice,
          additionalGuestsFee: q.extraPieceFee,
          distanceMiles: q.distanceMiles,
          freeMiles,
          billableMiles: Math.max(0, q.distanceMiles - freeMiles),
          ratePerMile,
          travelFee: q.travelFee,
          additionalServiceMins: q.extraServiceMins || 0,
          additionalServiceFee: q.additionalServiceFee || 0,
          additionalStopsCount: q.additionalStops,
          additionalStopsFee: q.additionalStopsFee,
          estimatedTotal: q.totalAmount,
          paymentPolicy: "Payment is collected after the service. We accept multiple payment methods.",
          locationMode,
          primaryLocation: resolvedPrimaryLocation,
          bookingStops: resolvedStops,
        };
        quoteBreakdownStr = JSON.stringify(fullQuotePayload);
      }
    }

    // ── 4. Determine booking status ───────────────────────────
    let status = "CONFIRMED";
    const parsedPkgPrice = JSON.parse(quoteBreakdownStr).packagePrice || 0;
    if (resolvedDistance > 30 && parsedPkgPrice < 500) {
      status = "PENDING_REVIEW";
    }

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
        address: resolvedPrimaryLocation.street,
        city: resolvedPrimaryLocation.city,
        zip: resolvedPrimaryLocation.zipCode,
        guests: guests,
        eventType,
        additionalStops: resolvedStops.length,
        additionalStopsFee: finalStopsFee,
        totalAmount: finalTotal,
        notes: notes || null,
        items: {
          create: [
            { lineType: "PACKAGE", description: "Package base price", quantity: 1, unitPrice: finalTotal - finalTravel - finalOvertime - finalExtraGuest - finalExtraService - finalStopsFee, totalPrice: finalTotal - finalTravel - finalOvertime - finalExtraGuest - finalExtraService - finalStopsFee },
            ...(finalTravel > 0 ? [{ lineType: "TRAVEL", description: "Travel fee",     quantity: 1, unitPrice: finalTravel,   totalPrice: finalTravel }]   : []),
            ...(finalOvertime > 0 ? [{ lineType: "OVERTIME", description: "Overtime fee",   quantity: 1, unitPrice: finalOvertime, totalPrice: finalOvertime }] : []),
            ...(finalExtraGuest > 0 ? [{ lineType: "EXTRA_GUESTS", description: "Extra guests fee",   quantity: 1, unitPrice: finalExtraGuest, totalPrice: finalExtraGuest }] : []),
            ...(finalExtraService > 0 ? [{ lineType: "EXTRA_SERVICE", description: `Additional service (${result.data.extraServiceMins} min)`, quantity: 1, unitPrice: finalExtraService, totalPrice: finalExtraService }] : []),
            ...(finalStopsFee > 0 ? [{ lineType: "MULTI_STOP", description: `Additional stops (${resolvedStops.length})`, quantity: resolvedStops.length, unitPrice: 50, totalPrice: finalStopsFee }] : []),
          ],
        },
        quote: {
          create: {
            basePrice:     finalTotal - finalTravel - finalOvertime - finalExtraService - finalStopsFee - finalExtraGuest,
            distanceMiles: resolvedDistance,
            travelFee:     finalTravel,
            overtimeFee:   finalOvertime,
            totalAmount:   finalTotal,
            snapshotJson:  quoteBreakdownStr,
          },
        },
        ...(resolvedStops && resolvedStops.length > 0 ? {
          stops: {
            create: resolvedStops.map((stop: any, idx: number) => ({
              stopOrder: idx + 1,
              street: stop.street,
              city: stop.city,
              state: stop.state || "MA",
              zipCode: stop.zipCode,
              latitude: stop.latitude,
              longitude: stop.longitude,
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
    dbPackageName = "Custom Package";
    if (packageId) {
      const dbPkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (dbPkg) {
        dbPackageName = dbPkg.name;
      }
    }

    // ── 7. Send Emails ────────────────────────────────────────
    try {
      if (status === "CONFIRMED") {
        await sendBookingApprovedEmail(
          email, firstName, booking.bookingNumber,
          `/customer/booking/${booking.id}`, totalAmount.toFixed(2), booking.id
        );
        console.log(`[Email] Confirmed email sent to ${email}`);
      } else {
        await sendBookingPendingReviewEmail(
          email, firstName, booking.bookingNumber,
          aiDecision.reason || "Your booking requires a manual review by our team.",
          booking.id
        );
        console.log(`[Email] Pending review email sent to ${email}`);
      }
    } catch (emailErr) {
      console.error("[Email Send Error]", emailErr);
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
