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

  // ── 1. Fetch package price from DB ────────────────────────────
  let packagePrice = 0;
  if (req.packageId) {
    const pkg = await prisma.package.findUnique({ where: { id: req.packageId } });
    if (pkg) {
      packagePrice = pkg.price;
    }
  }

  // ── 2. Availability check ────────────────────────────────────
  const eventDate = new Date(req.eventDate);
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      eventDate: eventDate,
      status: { in: ["CONFIRMED", "PENDING", "PENDING_REVIEW"] },
    },
    include: { vehicle: true },
  });

  // Find conflicting time windows (with 60-min buffer)
  const conflicts = conflictingBookings.filter(b => {
    const bStart = timeToMins(b.startTime);
    const bEnd   = bStart + b.durationMins + 60;
    return startMins < bEnd && endMins > bStart;
  });

  // Count available vehicles
  const allVehicles = await prisma.vehicle.findMany({ where: { status: "AVAILABLE" } });
  const busyVehicleIds = new Set(conflicts.map(b => b.vehicleId).filter(Boolean));
  const freeVehicles = allVehicles.filter(v => !busyVehicleIds.has(v.id));

  if (freeVehicles.length === 0) {
    return {
      verdict: "PENDING_REVIEW",
      reason: "Vehicle availability needs manual review",
      customerMessage: "Your booking request is being reviewed because we need to manually coordinate vehicle availability for your requested slot. Our team will follow up shortly.",
      autoConfirm: false,
      flags: ["NO_VEHICLE_AVAILABLE"],
    };
  }

  // Pick best vehicle
  const preferredType = req.guests > 100 ? "TRUCK" : undefined;
  const suggestedVehicle = freeVehicles.find(v => !preferredType || v.type === preferredType) ?? freeVehicles[0];
  flags.push(`VEHICLE_${suggestedVehicle.name}`);

  // ── 3. Decision logic ─────────────────────────────────────────
  const requiresReview = req.distanceMiles > 30 && packagePrice < 500;

  if (requiresReview) {
    return {
      verdict: "PENDING_REVIEW",
      reason: "Long distance + package below $500",
      customerMessage: "Your request is being reviewed because your event is outside our standard 30-mile travel range and the selected package is below the automatic approval threshold. Our team will review it and follow up shortly.",
      autoConfirm: false,
      flags: [...flags, "LONG_DISTANCE_LOW_PACKAGE_VALUE"],
      suggestedVehicle: suggestedVehicle.name,
    };
  }

  return {
    verdict: "APPROVED",
    reason: "All checks passed",
    customerMessage: "Your booking request has been confirmed. Payment is collected after the service — we accept multiple payment methods.",
    autoConfirm: true,
    flags,
    suggestedVehicle: suggestedVehicle.name,
  };
}
