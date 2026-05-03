import { prisma } from './prisma';

export async function checkAvailability(date: string, startTime: string, durationMins: number, vehicleType: string) {
  const vehicles = await prisma.vehicle.findMany({
    where: { type: vehicleType as any, status: 'AVAILABLE' }
  });

  if (vehicles.length === 0) return { available: false, vehicles: [] };

  const eventDate = new Date(date);
  
  const bookingsOnDate = await prisma.booking.findMany({
    where: {
      eventDate: eventDate,
      status: { in: ['CONFIRMED', 'PENDING'] },
      vehicleId: { in: vehicles.map((v: any) => v.id) }
    }
  });

  const [reqH, reqM] = startTime.split(':').map(Number);
  const reqStartMins = reqH * 60 + reqM;
  const reqEndMins = reqStartMins + durationMins + 60; // 60 min buffer

  const availableVehicles = vehicles.filter((v: any) => {
    const vBookings = bookingsOnDate.filter((b: any) => b.vehicleId === v.id);
    
    for (const b of vBookings) {
      const [bH, bM] = b.startTime.split(':').map(Number);
      const bStartMins = bH * 60 + bM;
      const bEndMins = bStartMins + b.durationMins + 60;
      
      if (reqStartMins < bEndMins && reqEndMins > bStartMins) {
        return false;
      }
    }
    return true;
  });

  return {
    available: availableVehicles.length > 0,
    vehicles: availableVehicles
  };
}
