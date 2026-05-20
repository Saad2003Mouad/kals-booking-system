import { prisma } from "@/lib/prisma";

export async function getPackages() {
  return await prisma.package.findMany({ where: { isActive: true } });
}

export async function estimatePrice(guests: number, packageId: string) {
  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) throw new Error("Package not found");

  let price = pkg.price;
  // very simplified pricing logic for tool
  if (guests > pkg.servings) {
    price += (guests - pkg.servings) * pkg.extraPiecePrice; 
  }
  return { estimatedPrice: price, packageName: pkg.name };
}

export async function checkAvailability(date: string) {
  const eventDate = new Date(date);
  const bookings = await prisma.booking.count({
    where: { eventDate: eventDate, status: { in: ["CONFIRMED", "PENDING"] } }
  });
  
  const totalVehicles = await prisma.vehicle.count({ where: { status: "AVAILABLE" } });
  
  return {
    date,
    availableSlots: Math.max(0, totalVehicles - bookings),
    isAvailable: bookings < totalVehicles
  };
}

export async function detectScheduleConflicts(date: string) {
  const eventDate = new Date(date);
  const conflicts = await prisma.booking.findMany({
    where: { eventDate: eventDate, status: "CONFIRMED" },
    include: { vehicle: true }
  });
  
  return conflicts.map(c => ({
    bookingId: c.id,
    startTime: c.startTime,
    vehicle: c.vehicle?.name || "Unassigned"
  }));
}
