export interface PricingParams {
  packagePrice: number;
  servings: number;
  extraGuestPrice: number;   // per-extra-guest fee from the package
  extraPiecePrice?: number;  // legacy alias, ignored if extraGuestPrice is set
  durationMins: number;
  packageDurationMins?: number; // the package's included minutes (from pkg.durationMins)
  distanceMiles: number;
  guests: number;
  additionalStops?: number;  // number of additional locations (0 = single stop)
  extraServiceMins?: number; // additional service time requested by customer (multiples of 30)
  freeMiles?: number;
  ratePerMile?: number;
  locationMode?: string;
  eventDate?: string | Date;
  vehiclesRequired?: number;
}

const ADDITIONAL_STOP_FEE = 50;          // $50 per extra location
const EXTRA_SERVICE_RATE_PER_30 = 35;   // $35 per additional 30-minute block

export function isWeekend(dateInput: string | Date | undefined): boolean {
  if (!dateInput) return false;
  try {
    const date = typeof dateInput === 'string'
      ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T12:00:00`)
      : new Date(dateInput);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  } catch {
    return false;
  }
}

export function calculateQuote(params: PricingParams) {
  const {
    packagePrice,
    servings,
    extraGuestPrice,
    durationMins,
    packageDurationMins = 60,
    distanceMiles,
    guests,
    additionalStops = 0,
    extraServiceMins = 0,
    freeMiles = 10,
    ratePerMile = 2.25,
    locationMode = "SINGLE_LOCATION",
    eventDate,
    vehiclesRequired,
  } = params;

  let total = packagePrice;

  // Extra Guests Fee
  let extraPieceFee = 0;
  const extraGuestsCount = guests > servings ? guests - servings : 0;
  if (extraGuestsCount > 0) {
    extraPieceFee = extraGuestsCount * extraGuestPrice;
    total += extraPieceFee;
  }

  // Travel Fee
  let travelFee = 0;
  if (distanceMiles > freeMiles) {
    travelFee = (distanceMiles - freeMiles) * ratePerMile;
    total += travelFee;
  }

  // Overtime Fee — legacy (from package duration being exceeded). 
  // Now we use extraServiceMins instead, so this should be 0 in normal flow.
  let overtimeFee = 0;
  if (durationMins > packageDurationMins) {
    const extraMins = durationMins - packageDurationMins;
    const blocksOf30 = Math.ceil(extraMins / 30);
    overtimeFee = blocksOf30 * EXTRA_SERVICE_RATE_PER_30;
    total += overtimeFee;
  }

  // Additional Service Time Fee ($35 per 30-min block)
  let additionalServiceFee = 0;
  if (extraServiceMins > 0) {
    const blocksOf30 = Math.ceil(extraServiceMins / 30);
    additionalServiceFee = blocksOf30 * EXTRA_SERVICE_RATE_PER_30;
    total += additionalServiceFee;
  }

  // Multi-Stop Fee / Additional Location Service Fee
  const stopsCount = Math.max(0, additionalStops);
  const additionalLocationServiceFee = locationMode !== "SINGLE_LOCATION"
    ? stopsCount * ADDITIONAL_STOP_FEE
    : 0;
  total += additionalLocationServiceFee;

  // Vehicles Required
  let resolvedVehicles = vehiclesRequired ?? 1;
  if (vehiclesRequired === undefined && locationMode === "SIMULTANEOUS_MULTI_VEHICLE") {
    resolvedVehicles = stopsCount + 1;
  } else if (locationMode !== "SIMULTANEOUS_MULTI_VEHICLE") {
    resolvedVehicles = 1;
  }

  // Additional Vehicle Setup Fee
  const additionalVehicleSetupFee = locationMode === "SIMULTANEOUS_MULTI_VEHICLE"
    ? Math.max(0, resolvedVehicles - 1) * 200
    : 0;
  total += additionalVehicleSetupFee;

  // Weekend Event Fee
  const weekendFee = isWeekend(eventDate) ? 25 : 0;
  total += weekendFee;

  return {
    basePrice: packagePrice,
    extraPieceFee,
    extraGuestPrice,
    travelFee,
    overtimeFee,
    additionalServiceFee,
    extraServiceMins,
    additionalStopsFee: additionalLocationServiceFee, // for compatibility
    additionalLocationServiceFee,
    additionalVehicleSetupFee,
    weekendFee,
    additionalStops: stopsCount,
    locationsCount: stopsCount + 1,
    vehiclesRequired: resolvedVehicles,
    distanceMiles,
    totalAmount: total,
    requiresReview: distanceMiles > 30 && packagePrice < 500,
    includedServings: servings,
    guestCount: guests,
    extraServingsCount: extraGuestsCount,
    extraPiecePrice: extraGuestPrice, // backwards-compat alias
  };
}

