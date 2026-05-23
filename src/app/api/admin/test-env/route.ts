import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    aiProvider: process.env.AI_PROVIDER || "not set",
    nodeEnv: process.env.NODE_ENV,
  });
}
