/**
 * AI Booking Decision Engine
 * Evaluates every booking request and returns APPROVED / REJECTED / PENDING_REVIEW
 * with full reasoning, alternative suggestions, and next steps.
 */

import { prisma } from "./prisma";

export type AIDecision = {
  verdict: "APPROVED" | "REJECTED" | "PENDING_REVIEW";
  reason: string;
  customerMessage: string;
  alternativeTimes?: string[];
  suggestedVehicle?: string;
  autoConfirm: boolean;
  flags: string[];
};

interface BookingRequest {
  eventDate: string;       // ISO date string
  startTime: string;       // "HH:MM"
  durationMins: number;
  zip: string;
  city: string;
  totalAmount: number;
  distanceMiles: number;
  packageId?: string;
  guests: number;
  eventType: string;
}

// Supported service area ZIP prefixes
const SERVICE_ZIP_PREFIXES = ["021", "024", "017", "019", "018", "020"];

function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minsToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${min.toString().padStart(2, "0")} ${ampm}`;
}

export async function evaluateBooking(req: BookingRequest): Promise<AIDecision> {
  const flags: string[] = [];
  const startMins = timeToMins(req.startTime);
  const endMins   = startMins + req.durationMins;

  // ── 1. Service area check ────────────────────────────────────
  const zipPrefix = req.zip.slice(0, 3);
  if (!SERVICE_ZIP_PREFIXES.includes(zipPrefix)) {
    return {
      verdict: "REJECTED",
      reason: "Location outside service area",
      customerMessage: `We're sorry — we don't currently serve the ${req.city} area (ZIP ${req.zip}). We serve Greater Boston and surrounding communities. Please check our service area map for covered cities.`,
      autoConfirm: false,
      flags: ["OUT_OF_AREA"],
    };
  }

  // ── 2. Fetch settings ─────────────────────────────────────────
  const settings = await prisma.setting.findMany();
  const getSettingStr = (k: string, fb: string) => settings.find(s => s.key === k)?.value ?? fb;
  const getSetting = (k: string, fb: number) => parseFloat(getSettingStr(k, String(fb)));
  const autoConfirmThreshold       = getSetting("AUTO_CONFIRM_THRESHOLD", 500);
  const distanceReviewThreshold    = getSetting("DISTANCE_REVIEW_THRESHOLD_MILES", 30);
  const freeMiles                  = getSetting("FREE_MILES", 10);
  // MAX_DISTANCE_MILES is a soft informational flag only — never causes REJECTED
  const maxDistanceSoft            = getSetting("MAX_DISTANCE_MILES", 45);

  const eventDate = new Date(req.eventDate);
  const eventDateStr = eventDate.toISOString().split("T")[0];
  const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;

  // Business hours stored as integer hours in DB (e.g. "8" = 8:00, "22" = 22:00)
  const bStartHour = getSetting(isWeekend ? "BUSINESS_START_WEEKEND" : "BUSINESS_START_WEEKDAY", isWeekend ? 9  : 8);
  const bEndHour   = getSetting(isWeekend ? "BUSINESS_END_WEEKEND"   : "BUSINESS_END_WEEKDAY",   22);
  const BUSINESS_START = bStartHour * 60;   // convert hour → minutes
  const BUSINESS_END   = bEndHour   * 60;

  // ── 3. Business hours check ───────────────────────────────────
  // Outside hours → PENDING_REVIEW, not auto-rejected.
  // Admin can approve off-hours events with custom arrangements.
  if (startMins < BUSINESS_START || endMins > BUSINESS_END) {
    flags.push("OUTSIDE_HOURS");
  }

  // ── 4. Distance check ─────────────────────────────────────────
  // Per requirements: distance > threshold → PENDING_REVIEW only (never REJECTED)
  if (req.distanceMiles > distanceReviewThreshold) {
    flags.push("LONG_DISTANCE");
    flags.push("REQUIRES_DISTANCE_REVIEW");
  }
  // Soft informational flag — does NOT cause rejection
  if (req.distanceMiles > maxDistanceSoft) {
    flags.push("EXCEEDS_TYPICAL_RANGE");
  }

  // ── 5. Availability check ────────────────────────────────────

  const conflictingBookings = await prisma.booking.findMany({
    where: {
      eventDate: eventDate,
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: { vehicle: true },
  });

  // Find conflicting time windows
  const conflicts = conflictingBookings.filter(b => {
    const bStart = timeToMins(b.startTime);
    const bEnd   = bStart + b.durationMins + 60; // 60-min buffer
    return startMins < bEnd && endMins > bStart;
  });

  // Count available vehicles (7 total)
  const allVehicles = await prisma.vehicle.findMany({ where: { status: "AVAILABLE" } });
  const busyVehicleIds = new Set(conflicts.map(b => b.vehicleId).filter(Boolean));
  const freeVehicles = allVehicles.filter(v => !busyVehicleIds.has(v.id));

  if (freeVehicles.length === 0) {
    // Suggest alternative times
    const alternatives = findAlternativeTimes(conflictingBookings, req.durationMins, eventDateStr, BUSINESS_START, BUSINESS_END);
    return {
      verdict: "REJECTED",
      reason: "No vehicles available at requested time",
      customerMessage: `We're sorry — all of our vehicles are booked for ${minsToTime(startMins)} on ${eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}. Here are some available time slots on the same day that might work for you:`,
      alternativeTimes: alternatives,
      autoConfirm: false,
      flags: ["NO_AVAILABILITY"],
    };
  }

  // Pick best vehicle
  const preferredType = req.guests > 100 ? "TRUCK" : undefined;
  const suggestedVehicle = freeVehicles.find(v => !preferredType || v.type === preferredType) ?? freeVehicles[0];
  flags.push(`VEHICLE_${suggestedVehicle.name}`);

  // ── 6. Pricing validation ─────────────────────────────────────
  if (req.totalAmount < 150) {
    return {
      verdict: "REJECTED",
      reason: "Booking value below minimum",
      customerMessage: `The minimum booking value is $150. Based on your selections, the estimated total is $${req.totalAmount.toFixed(2)}. Please select a larger package or extended duration to meet the minimum.`,
      autoConfirm: false,
      flags: [...flags, "BELOW_MINIMUM"],
    };
  }

  // ── 7. Auto-confirm logic ─────────────────────────────────────
  // autoConfirm only if amount >= threshold AND distance is within review threshold AND within business hours
  const isLongDistance = req.distanceMiles > distanceReviewThreshold;
  const isOutsideHours = flags.includes("OUTSIDE_HOURS");
  
  const autoConfirm = req.totalAmount >= autoConfirmThreshold && !isLongDistance && !isOutsideHours;

  if (!autoConfirm) {
    if (req.totalAmount < autoConfirmThreshold) flags.push(`BELOW_THRESHOLD_$${autoConfirmThreshold}`);
    if (isLongDistance && !flags.includes("REQUIRES_DISTANCE_REVIEW")) flags.push("REQUIRES_DISTANCE_REVIEW");
  }

  const verdict = autoConfirm ? "APPROVED" : "PENDING_REVIEW";

  let customerMessage: string;
  if (autoConfirm) {
    customerMessage = `Great news! Your booking for ${req.eventType} on ${eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} has been confirmed. ${suggestedVehicle.name} will be assigned to your event. Please complete your payment to secure your booking.`;
  } else if (isOutsideHours) {
    customerMessage = `Your requested time is outside our standard business hours. We've sent your request to our team for review, and we'll contact you shortly with availability options.`;
  } else if (isLongDistance) {
    customerMessage = `Your event appears to be outside our standard service area (${req.distanceMiles.toFixed(1)} miles from our Revere, MA base). We've sent your request to our team for review, and we'll contact you shortly with availability and travel options.`;
  } else {
    customerMessage = `Thank you for your request! Your booking for ${req.eventType} on ${eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} is under review by our team. We'll contact you within 2–4 hours to confirm.`;
  }

  return {
    verdict,
    reason: autoConfirm ? "All checks passed" : isOutsideHours ? "Outside business hours requires manual review" : isLongDistance ? "Distance requires manual review" : "Manual review required",
    customerMessage,
    suggestedVehicle: suggestedVehicle.name,
    autoConfirm,
    flags,
  };
}

function findAlternativeTimes(
  busyBookings: { startTime: string; durationMins: number }[],
  requestedDuration: number,
  _dateStr: string,
  businessStart: number,
  businessEnd: number
): string[] {
  const occupied = busyBookings.map(b => ({
    start: timeToMins(b.startTime) - 30,
    end: timeToMins(b.startTime) + b.durationMins + 90,
  }));

  const slots: string[] = [];
  for (let t = businessStart; t <= businessEnd - requestedDuration; t += 60) {
    const slotEnd = t + requestedDuration + 60;
    const conflict = occupied.some(o => t < o.end && slotEnd > o.start);
    if (!conflict) {
      slots.push(minsToTime(t));
      if (slots.length >= 3) break;
    }
  }
  return slots;
}
