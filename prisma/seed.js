const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding doctors...");

  const doctors = [
    {
      clerkUserId: "seed_doctor_1",
      name: "Dr. Ananya Sharma",
      email: "ananya.sharma@example.com",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Cardiology",
      experience: 12,
      description: "Senior Cardiologist with over 12 years of experience in interventional cardiology and heart failure management.",
      verificationStatus: "VERIFIED",
      credits: 0,
    },
    {
      clerkUserId: "seed_doctor_2",
      name: "Dr. Rajesh Khanna",
      email: "rajesh.khanna@example.com",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Dermatology",
      experience: 8,
      description: "Expert in clinical and cosmetic dermatology, specializing in skin rejuvenation and laser treatments.",
      verificationStatus: "VERIFIED",
      credits: 0,
    },
    {
      clerkUserId: "seed_doctor_3",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pediatrics",
      experience: 15,
      description: "Compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence.",
      verificationStatus: "VERIFIED",
      credits: 0,
    },
    {
      clerkUserId: "seed_doctor_4",
      name: "Dr. Amit Patel",
      email: "amit.patel@example.com",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Orthopedics",
      experience: 10,
      description: "Orthopedic surgeon specializing in sports medicine and joint replacement surgeries.",
      verificationStatus: "VERIFIED",
      credits: 0,
    },
    {
      clerkUserId: "seed_doctor_5",
      name: "Dr. Priya Iyer",
      email: "priya.iyer@example.com",
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Obstetrics & Gynecology",
      experience: 9,
      description: "Specialist in women's health, reproductive medicine, and prenatal care.",
      verificationStatus: "VERIFIED",
      credits: 0,
    },
    {
      clerkUserId: "seed_doctor_6",
      name: "Dr. Vikram Singh",
      email: "vikram.singh@example.com",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Neurology",
      experience: 14,
      description: "Neurologist focusing on epilepsy, stroke prevention, and cognitive disorders.",
      verificationStatus: "VERIFIED",
      credits: 0,
    },
  ];

  for (const doctor of doctors) {
    await prisma.user.upsert({
      where: { email: doctor.email },
      update: doctor,
      create: doctor,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
