import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');
  
  // Create Vehicles
  const t1 = await prisma.vehicle.create({ data: { name: 'Classic Truck 1', type: 'TRUCK' } });
  const t2 = await prisma.vehicle.create({ data: { name: 'Classic Truck 2', type: 'TRUCK' } });
  const t3 = await prisma.vehicle.create({ data: { name: 'Classic Truck 3', type: 'TRUCK' } });
  const t4 = await prisma.vehicle.create({ data: { name: 'Premium Truck 1', type: 'TRUCK' } });
  const t5 = await prisma.vehicle.create({ data: { name: 'Premium Truck 2', type: 'TRUCK' } });
  
  const v1 = await prisma.vehicle.create({ data: { name: 'Sprinter Van 1', type: 'VAN' } });
  const v2 = await prisma.vehicle.create({ data: { name: 'Sprinter Van 2', type: 'VAN' } });
  
  // Create Packages
  await prisma.package.create({ data: { name: 'Classic Truck Package', type: 'TRUCK', durationMins: 45, basePrice: 250, description: 'Up to 50 servings' } });
  await prisma.package.create({ data: { name: 'Premium Truck Package', type: 'TRUCK', durationMins: 60, basePrice: 350, description: 'Up to 100 servings' } });
  await prisma.package.create({ data: { name: 'Van Express', type: 'VAN', durationMins: 45, basePrice: 300, description: 'Sleek sprinter van' } });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
