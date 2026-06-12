import { NextResponse } from "next/server";
import { googleCalendarService } from "@/lib/google-calendar";

export async function POST() {
  try {
    const result = await googleCalendarService.initialSync();
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Sync API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
