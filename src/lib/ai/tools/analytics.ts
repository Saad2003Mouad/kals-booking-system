import { prisma } from "@/lib/prisma";

export async function getRevenueStats() {
  const allBookings = await prisma.booking.findMany({
    where: { status: "CONFIRMED" },
    include: { quote: true }
  });
  
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.quote?.totalAmount || 0), 0);
  return { totalRevenue, totalConfirmedBookings: allBookings.length };
}

export async function getCustomerStats() {
  const totalCustomers = await prisma.customer.count();
  return { totalCustomers };
}

export async function getEventAnalytics() {
  const stats = await prisma.booking.groupBy({
    by: ['eventType'],
    _count: {
      id: true
    }
  });
  return stats;
}
