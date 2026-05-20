import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobStatus, driverNote } = await req.json();
  const allowed = ["PENDING", "ON_THE_WAY", "ARRIVED", "COMPLETED"];
  if (!allowed.includes(jobStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const assignment = await prisma.booking.update({
    where: { id: params.id },
    data: { status: jobStatus === "COMPLETED" ? "COMPLETED" : "CONFIRMED" },
  });

  // Status is now updated directly on booking

  return NextResponse.json(assignment);
}
