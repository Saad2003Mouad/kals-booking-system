export interface PricingParams {
  packagePrice: number;
  servings: number;
  extraPiecePrice: number;
  durationMins: number;
  packageDurationMins?: number; // fallback to 60 if not specified
  distanceMiles: number;
  guests: number;
  freeMiles?: number;
  ratePerMile?: number;
}

export function calculateQuote(params: PricingParams) {
  const { packagePrice, servings, extraPiecePrice, durationMins, packageDurationMins = 60, distanceMiles, guests, freeMiles = 10, ratePerMile = 2.25 } = params;

  let total = packagePrice;

  // Extra Servings Fee
  let extraPieceFee = 0;
  if (guests > servings) {
    extraPieceFee = (guests - servings) * extraPiecePrice;
    total += extraPieceFee;
  }

  // Travel Fee
  let travelFee = 0;
  if (distanceMiles > freeMiles) {
    travelFee = (distanceMiles - freeMiles) * ratePerMile;
    total += travelFee;
  }

  // Overtime Fee
  let overtimeFee = 0;
  const overtimeRatePerHour = 75.0; // configurable later
  if (durationMins > packageDurationMins) {
    const extraMins = durationMins - packageDurationMins;
    const blocksOf30 = Math.ceil(extraMins / 30);
    overtimeFee = blocksOf30 * (overtimeRatePerHour / 2);
    total += overtimeFee;
  }

  const extraServingsCount = guests > servings ? guests - servings : 0;

  return {
    basePrice: packagePrice,
    extraPieceFee,
    travelFee,
    overtimeFee,
    distanceMiles,
    totalAmount: total,
    requiresReview: distanceMiles > 30 && packagePrice < 500,
    includedServings: servings,
    guestCount: guests,
    extraServingsCount,
    extraPiecePrice
  };
}
