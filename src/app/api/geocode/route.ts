import { NextRequest, NextResponse } from "next/server";
import { searchAddresses } from "@/lib/maps";
import { isServiceableZip } from "@/lib/serviceAreas";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 3) return NextResponse.json([]);

  const results = await searchAddresses(q);

  // Filter to MA only and mark serviceability
  const filtered = results
    .filter(r => r.lat && r.lng)
    .map(r => ({
      ...r,
      inServiceArea: r.zip ? isServiceableZip(r.zip) : true, // assume yes if no ZIP found
      label: r.label.split(", United States")[0], // trim country
    }))
    .slice(0, 5);

  return NextResponse.json(filtered);
}
