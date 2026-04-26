const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ where: { role: 'DOCTOR' } });
  console.log('Doctors count:', users.length);
  const allUsers = await prisma.user.count();
  console.log('Total users:', allUsers);
}

check().catch(console.error).finally(() => prisma.$disconnect());
