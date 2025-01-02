const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {
      name: 'Alice',
    },
    create: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });
  
  await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {
      name: 'Bob',
    },
    create: {
      name: 'Bob',
      email: 'bob@example.com',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });