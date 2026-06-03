const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const p = new PrismaClient()

async function seed() {
  // ── ADMIN ─────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Dvyns1234@', 12)
  await p.user.upsert({
    where: { email: 'Ahiyari@outlook.com' },
    update: { passwordHash: adminHash, name: 'Admin', role: 'ADMIN' },
    create: { email: 'Ahiyari@outlook.com', passwordHash: adminHash, role: 'ADMIN', name: 'Admin' }
  })

  // ── DRIVER: Saad Mouad ────────────────────────────────────
  const driverHash = await bcrypt.hash('716420699', 12)
  const driverUser = await p.user.upsert({
    where: { email: 'saadmouad2003@gmail.com' },
    update: { passwordHash: driverHash, name: 'Saad Mouad' },
    create: { email: 'saadmouad2003@gmail.com', passwordHash: driverHash, role: 'DRIVER', name: 'Saad Mouad' }
  })
  const existingDriver = await p.driver.findUnique({ where: { userId: driverUser.id } })
  if (!existingDriver) {
    await p.driver.create({ data: { userId: driverUser.id, displayName: 'Saad Mouad', active: true } })
  }

  // ── VEHICLES ──────────────────────────────────────────────
  const vehicles = [
    { code: 'TRUCK-1', name: 'Americano Classic 1', type: 'TRUCK' },
    { code: 'TRUCK-2', name: 'Americano Classic 2', type: 'TRUCK' },
    { code: 'TRUCK-3', name: 'Americano Classic 3', type: 'TRUCK' },
    { code: 'TRUCK-4', name: 'Americano Premium 1', type: 'TRUCK' },
    { code: 'TRUCK-5', name: 'Americano Premium 2', type: 'TRUCK' },
    { code: 'VAN-1', name: 'Sprinter Van', type: 'VAN' },
    { code: 'VAN-2', name: 'Dodge Van', type: 'VAN' },
  ]
  for (const v of vehicles) {
    await p.vehicle.upsert({ where: { code: v.code }, update: { name: v.name }, create: v })
  }

  // ── PACKAGES ──────────────────────────────────────────────
  // Clear old packages before inserting fresh ones
  await p.package.deleteMany({})

  const packages = [
    // ── Americano Ice Cream Truck ──────────────────────────
    {
      slug: 'starter-event',
      serviceType: 'AMERICANO_TRUCK',
      name: 'Patriot',
      description: 'Perfect for small birthdays, family gatherings, and neighborhood events.',
      servings: 30,
      price: 250,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 45,
      badge: 'Perfect for Small Events',
      imageUrl: '/images/packages/starter-event.jpg',
      sortOrder: 1,
      isActive: true,
    },
    {
      slug: 'family-event',
      serviceType: 'AMERICANO_TRUCK',
      name: 'Fenway',
      description: 'A sweet choice for family parties and private celebrations.',
      servings: 50,
      price: 340,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 45,
      badge: 'Family Favorite',
      imageUrl: '/images/packages/family-event.jpg',
      sortOrder: 2,
      isActive: true,
    },
    {
      slug: 'celebration-pack',
      serviceType: 'AMERICANO_TRUCK',
      name: 'Harbor',
      description: 'Great for birthdays, community events, and medium-sized celebrations.',
      servings: 75,
      price: 425,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 45,
      badge: 'Most Popular',
      imageUrl: '/images/packages/celebration-pack.jpg',
      sortOrder: 3,
      isActive: true,
    },
    {
      slug: 'silver-event',
      serviceType: 'AMERICANO_TRUCK',
      name: 'All-Star',
      description: 'A polished package for larger parties, schools, and corporate gatherings.',
      servings: 100,
      price: 495,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 45,
      badge: 'Best Value',
      imageUrl: '/images/packages/silver-event.jpg',
      sortOrder: 4,
      isActive: true,
    },
    {
      slug: 'gold-event',
      serviceType: 'AMERICANO_TRUCK',
      name: 'Hall of Fame',
      description: 'Designed for high-energy events with more guests and bigger smiles.',
      servings: 150,
      price: 725,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 60,
      badge: 'Large Events',
      imageUrl: '/images/packages/gold-event.jpg',
      sortOrder: 5,
      isActive: true,
    },
    {
      slug: 'signature-event',
      serviceType: 'AMERICANO_TRUCK',
      name: 'Dynasty',
      description: 'Our premium truck experience for major celebrations and special occasions.',
      servings: 200,
      price: 950,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 90,
      badge: 'Premium Experience',
      imageUrl: '/images/packages/signature-event.jpg',
      sortOrder: 6,
      isActive: true,
    },

    // ── Sprinter / Dodge Van ───────────────────────────────
    {
      slug: 'van-starter-party',
      serviceType: 'SPRINTER_VAN',
      name: 'Starter Party',
      description: 'A simple and affordable van package for small parties and quick celebrations.',
      servings: 30,
      price: 190,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 40,
      badge: 'Budget Friendly',
      imageUrl: '/images/packages/van-starter-party.jpg',
      sortOrder: 7,
      isActive: true,
    },
    {
      slug: 'van-family-event',
      serviceType: 'SPRINTER_VAN',
      name: 'Family Event',
      description: 'A flexible van package for family gatherings and private events.',
      servings: 50,
      price: 275,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 40,
      badge: 'Family Favorite',
      imageUrl: '/images/packages/van-family-event.jpg',
      sortOrder: 8,
      isActive: true,
    },
    {
      slug: 'van-celebration-pack',
      serviceType: 'SPRINTER_VAN',
      name: 'Celebration Pack',
      description: 'A great mid-size option for birthdays, schools, and community events.',
      servings: 75,
      price: 365,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 40,
      badge: 'Popular Van Package',
      imageUrl: '/images/packages/van-celebration-pack.jpg',
      sortOrder: 9,
      isActive: true,
    },
    {
      slug: 'van-silver-special',
      serviceType: 'SPRINTER_VAN',
      name: 'Silver Special',
      description: 'A strong value package for bigger parties and school events.',
      servings: 100,
      price: 450,
      extraPiecePrice: 5,
      extraGuestPrice: 5,
      durationMins: 40,
      badge: 'Best Value',
      imageUrl: '/images/packages/van-silver-special.jpg',
      sortOrder: 10,
      isActive: true,
    },
    {
      slug: 'van-big-smile-package',
      serviceType: 'SPRINTER_VAN',
      name: 'Big Smile Package',
      description: 'Built for larger groups that need more servings and a smooth service experience.',
      servings: 150,
      price: 695,
      extraPiecePrice: 4,
      extraGuestPrice: 4,
      durationMins: 60,
      badge: 'Big Events',
      imageUrl: '/images/packages/van-big-smile-package.jpg',
      sortOrder: 11,
      isActive: true,
    },
    {
      slug: 'van-school-festival-special',
      serviceType: 'SPRINTER_VAN',
      name: 'School Festival Special',
      description: 'A high-capacity package designed for schools, festivals, and large community events.',
      servings: 200,
      price: 825,
      extraPiecePrice: 4,
      extraGuestPrice: 4,
      durationMins: 60,
      badge: 'Great for Schools',
      imageUrl: '/images/packages/van-school-festival-special.jpg',
      sortOrder: 12,
      isActive: true,
    },
    {
      slug: 'custom-event-package',
      serviceType: 'CUSTOM',
      name: 'Custom Event Package',
      description: 'Planning a larger celebration? Tell us about your event and our team will prepare a custom package and final quote for you.',
      servings: 201,
      price: 0,
      extraPiecePrice: 0,
      extraGuestPrice: 0,
      durationMins: 0,
      badge: 'For 200+ guests',
      imageUrl: '/images/packages/custom-event.jpg',
      sortOrder: 13,
      isActive: true,
    },
  ]

  for (const pkg of packages) {
    await p.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    })
  }

  // ── SETTINGS ──────────────────────────────────────────────
  const settings = [
    { key: 'FREE_MILES', value: '10' },
    { key: 'RATE_PER_MILE', value: '2.25' },
    { key: 'OVERTIME_RATE_PER_30', value: '75' },
    { key: 'AUTO_CONFIRM_THRESHOLD', value: '400' },
    { key: 'MAX_DISTANCE_MILES', value: '35' },
    { key: 'BASE_ZIP', value: '02151' },
    { key: 'SCHOOL_DISCOUNT_PCT', value: '10' },
    { key: 'LARGE_EVENT_DISCOUNT_PCT', value: '8' },
    { key: 'LARGE_EVENT_THRESHOLD', value: '250' },
    { key: 'BUSINESS_START_WEEKDAY', value: '0' },
    { key: 'BUSINESS_END_WEEKDAY', value: '24' },
    { key: 'BUSINESS_START_WEEKEND', value: '0' },
    { key: 'BUSINESS_END_WEEKEND', value: '24' },
  ]
  for (const s of settings) {
    await p.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }

  console.log('✅ Seed complete — 2 users, 7 vehicles, 12 packages, 9 settings.')
}

seed().catch(e => { console.error(e); process.exit(1) }).finally(() => p.$disconnect())
