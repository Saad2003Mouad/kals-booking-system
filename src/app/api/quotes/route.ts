import { NextResponse } from 'next/server';
import { calculateQuote } from '@/lib/pricing';
import { prisma } from "@/lib/prisma";

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
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Quotes API body:", body);
    const { packageId, durationMins, distanceMiles, guests } = body;

    const missingFields = [];
    if (!packageId) missingFields.push("packageId");
    if (!durationMins) missingFields.push("durationMins");
    if (!guests) missingFields.push("guests");

    if (missingFields.length > 0) {
      return NextResponse.json({ success: false, error: 'Missing required parameters', missingFields }, { status: 400 });
    }

    const [pkg, settings] = await withRetry(() => Promise.all([
      prisma.package.findUnique({ where: { id: packageId } }),
      prisma.setting.findMany({ where: { key: { in: ['FREE_MILES', 'RATE_PER_MILE'] } } })
    ]));
    
    if (!pkg) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    const freeMilesSetting = settings.find(s => s.key === 'FREE_MILES')?.value;
    const ratePerMileSetting = settings.find(s => s.key === 'RATE_PER_MILE')?.value;
    const freeMiles = freeMilesSetting ? parseFloat(freeMilesSetting) : 10;
    const ratePerMile = ratePerMileSetting ? parseFloat(ratePerMileSetting) : 2.25;

    const q = calculateQuote({
      packagePrice: pkg.price,
      servings: pkg.servings,
      extraPiecePrice: pkg.extraPiecePrice,
      durationMins: parseInt(durationMins as string) || 60,
      packageDurationMins: 60, // default
      distanceMiles: parseFloat(distanceMiles as string) || 0,
      guests: parseInt(guests as string) || 0,
      freeMiles,
      ratePerMile
    });

    const breakdown = [
      { label: "Base Package", amount: q.basePrice },
      { label: q.extraServingsCount > 0 ? `Extra Servings (${q.extraServingsCount} × $${q.extraPiecePrice})` : "Extra Servings", amount: q.extraPieceFee },
      { label: "Travel Fee", amount: q.travelFee },
      { label: "Overtime Fee", amount: q.overtimeFee },
    ];

    // Return the flat quote object + breakdown to match frontend expectations
    return NextResponse.json({ ...q, breakdown });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
