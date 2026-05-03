import { NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/availability';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, startTime, durationMins, vehicleType } = body;

    if (!date || !startTime || !durationMins || !vehicleType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await checkAvailability(date, startTime, durationMins, vehicleType);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
