import { prisma } from "@/lib/prisma";

export async function getBookings(status?: string) {
  const where = status ? { status: status as any } : {};
  return await prisma.booking.findMany({ 
    where, 
    include: { customer: true },
    orderBy: { eventDate: 'asc' },
    take: 10
  });
}

export async function createBooking(data: any) {
  return { status: "success", message: "Redirecting to /booking for full flow." };
}

export async function updateBooking(id: string, status: string) {
  const updated = await prisma.booking.update({
    where: { id },
    data: { status: status as any }
  });
  return updated;
}

export async function cancelBooking(id: string) {
  const cancelled = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" as any }
  });
  return cancelled;
}
