const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.package.findMany({ select: { id: true, name: true, imageUrl: true, isActive: true } })
  .then(rows => {
    console.log(JSON.stringify(rows, null, 2));
    return p["$disconnect"]();
  })
  .then(() => process.exit(0))
  .catch(e => { console.error(e.message); process.exit(1); });
