import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/maps";

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") ?? "");
  if (isNaN(lat) || isNaN(lng)) return NextResponse.json(null);
  const result = await reverseGeocode(lat, lng);
  return NextResponse.json(result);
}
