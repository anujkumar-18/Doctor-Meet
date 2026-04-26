const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctors = [
    {
      clerkUserId: 'dummy_doctor_1',
      email: 'doctor1@example.com',
      name: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
      specialty: 'General Medicine',
      experience: 10,
      description: 'Experienced general practitioner.',
      verificationStatus: 'VERIFIED',
    },
    {
      clerkUserId: 'dummy_doctor_2',
      email: 'doctor2@example.com',
      name: 'Dr. Michael Chen',
      role: 'DOCTOR',
      specialty: 'Cardiology',
      experience: 15,
      description: 'Expert cardiologist.',
      verificationStatus: 'VERIFIED',
    },
    {
      clerkUserId: 'dummy_doctor_3',
      email: 'doctor3@example.com',
      name: 'Dr. Emily Brown',
      role: 'DOCTOR',
      specialty: 'Dermatology',
      experience: 8,
      description: 'Board certified dermatologist.',
      verificationStatus: 'VERIFIED',
    },
    {
      clerkUserId: 'dummy_doctor_4',
      email: 'doctor4@example.com',
      name: 'Dr. James Wilson',
      role: 'DOCTOR',
      specialty: 'Neurology',
      experience: 20,
      description: 'Specialist in neurological disorders.',
      verificationStatus: 'VERIFIED',
    }
  ];

  console.log('Seeding doctors...');
  for (const doc of doctors) {
    const existing = await prisma.user.findUnique({ where: { email: doc.email } });
    if (!existing) {
      await prisma.user.create({ data: doc });
      console.log(`Created doctor: ${doc.name}`);
    } else {
      console.log(`Doctor already exists: ${doc.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
