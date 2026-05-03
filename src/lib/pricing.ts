export interface PricingParams {
  basePrice: number;
  durationMins: number;
  packageDurationMins: number;
  distanceMiles: number;
  guests: number;
}

export function calculateQuote(params: PricingParams) {
  const { basePrice, durationMins, packageDurationMins, distanceMiles, guests } = params;

  let total = basePrice;

  let guestFee = 0;
  if (guests > 50) {
    guestFee = (guests - 50) * 2;
    total += guestFee;
  }

  const freeMiles = 10;
  const ratePerMile = 2.25;
  let travelFee = 0;
  if (distanceMiles > freeMiles) {
    travelFee = (distanceMiles - freeMiles) * ratePerMile;
    total += travelFee;
  }

  let overtimeFee = 0;
  const overtimeRatePerHour = 75.0;
  if (durationMins > packageDurationMins) {
    const extraMins = durationMins - packageDurationMins;
    const blocksOf30 = Math.ceil(extraMins / 30);
    overtimeFee = blocksOf30 * (overtimeRatePerHour / 2);
    total += overtimeFee;
  }

  return {
    basePrice,
    guestFee,
    travelFee,
    overtimeFee,
    distanceMiles,
    totalAmount: total,
    requiresReview: distanceMiles > 30 || total < 500 
  };
}
