import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    data: { role: "OWNER" }
  });
  console.log(`Updated ${result.count} users to OWNER.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
