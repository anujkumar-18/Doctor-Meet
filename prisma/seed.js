const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding doctors with 7-day availability and WhatsApp support...");

  const doctors = [
    {
      clerkUserId: "dr_ananya_sharma",
      name: "Ananya Sharma",
      email: "ananya.sharma@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Cardiology",
      experience: 12,
      description: "Senior Cardiologist at AIIMS, specializing in heart failure and non-invasive cardiology.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_rajesh_khanna",
      name: "Rajesh Khanna",
      email: "rajesh.khanna@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Dermatology",
      experience: 8,
      description: "Top-rated Dermatologist from Mumbai, expert in skin diseases and aesthetic treatments.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_sarah_johnson",
      name: "Sarah Johnson",
      email: "sarah.johnson@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pediatrics",
      experience: 15,
      description: "Renowned Pediatrician in Bangalore, dedicated to child healthcare and immunization.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_amit_patel",
      name: "Amit Patel",
      email: "amit.patel@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Orthopedics",
      experience: 10,
      description: "Orthopedic Surgeon in Ahmedabad, specialist in joint replacements and sports injuries.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_priya_iyer",
      name: "Priya Iyer",
      email: "priya.iyer@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Obstetrics & Gynecology",
      experience: 9,
      description: "Leading Gynecologist in Chennai, expert in maternal-fetal medicine and laparoscopy.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_vikram_singh",
      name: "Vikram Singh",
      email: "vikram.singh@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Neurology",
      experience: 14,
      description: "Neurologist in Delhi, specializing in stroke management and neuro-rehabilitation.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_sunita_reddy",
      name: "Sunita Reddy",
      email: "sunita.reddy@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "General Medicine",
      experience: 11,
      description: "Expert General Physician in Hyderabad with extensive experience in chronic disease management.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_arjun_mehta",
      name: "Arjun Mehta",
      email: "arjun.mehta@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1622902046580-2b47f47f0871?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Endocrinology",
      experience: 7,
      description: "Diabetes specialist and Endocrinologist in Pune, helping patients manage hormonal disorders.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_meera_nair",
      name: "Meera Nair",
      email: "meera.nair@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Gastroenterology",
      experience: 13,
      description: "Gastroenterologist in Kochi, expert in liver diseases and advanced endoscopy.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_sanjay_gupta",
      name: "Sanjay Gupta",
      email: "sanjay.gupta@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Oncology",
      experience: 16,
      description: "Cancer specialist in Kolkata, dedicated to precision oncology and immunotherapy.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_kavita_sharma",
      name: "Kavita Sharma",
      email: "kavita.sharma@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Ophthalmology",
      experience: 10,
      description: "Eye specialist in Jaipur, specializing in cataract surgery and LASIK.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_rahul_verma",
      name: "Rahul Verma",
      email: "rahul.verma@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Psychiatry",
      experience: 9,
      description: "Psychiatrist in Lucknow, helping patients with mental wellness and stress management.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_sneha_desai",
      name: "Sneha Desai",
      email: "sneha.desai@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pulmonology",
      experience: 12,
      description: "Chest specialist in Surat, expert in asthma, COPD, and sleep disorders.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_manoj_kumar",
      name: "Manoj Kumar",
      email: "manoj.kumar@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Radiology",
      experience: 11,
      description: "Radiologist in Chandigarh, specialist in MRI, CT, and interventional radiology.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_neha_bansal",
      name: "Neha Bansal",
      email: "neha.bansal@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Urology",
      experience: 8,
      description: "Urologist in Indore, expert in kidney stones and male reproductive health.",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_alok_mishra",
      name: "Alok Mishra",
      email: "alok.mishra@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Other",
      experience: 5,
      description: "General healthcare advisor providing wellness consultations across India.",
      verificationStatus: "VERIFIED",
    },
  ];

  for (const doc of doctors) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: doc,
      create: doc,
    });

    // Create availability for each doctor for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const startTime = new Date(date);
      startTime.setHours(9, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(17, 0, 0, 0);

      await prisma.availability.upsert({
        where: { id: `availability_${user.id}_${i}` },
        update: {
          startTime,
          endTime,
          status: "AVAILABLE",
        },
        create: {
          id: `availability_${user.id}_${i}`,
          doctorId: user.id,
          startTime,
          endTime,
          status: "AVAILABLE",
        },
      });
    }
  }

  console.log("Seeding of " + doctors.length + " doctors and 7-day availability completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
