import { NextResponse } from 'next/server';
import { calculateQuote } from '@/lib/pricing';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { basePrice, durationMins, packageDurationMins, distanceMiles, guests } = body;

    if (!basePrice || !durationMins || !packageDurationMins) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const quote = calculateQuote({
      basePrice,
      durationMins,
      packageDurationMins,
      distanceMiles: distanceMiles || 0, // Mock: if distance not provided, default 0
      guests: guests || 0
    });

    return NextResponse.json({ quote });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
