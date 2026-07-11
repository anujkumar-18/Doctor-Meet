const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Seeding of Uttar Pradesh (UP) Justdial Doctors...");

  const upDoctors = [
    // LUCKNOW
    {
      clerkUserId: "dr_up_lucknow_med",
      name: "Dr. Alok Srivastava",
      email: "alok.srivastava@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "General Medicine",
      experience: 15,
      description: "Senior Counsel Physician in Hazratganj, Lucknow. Expert in treating viral fevers, chronic hypertension, diabetes, and joint pains.",
      location: "Lucknow",
      phone: "9839912040",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_lucknow_cardio",
      name: "Dr. Shishir Chandra",
      email: "shishir.chandra@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Cardiology",
      experience: 22,
      description: "Gold medalist Cardiologist practicing near Sahara Hospital, Lucknow. Specializes in Angioplasty and Preventive Cardiac Therapies.",
      location: "Lucknow",
      phone: "9415004562",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_lucknow_peds",
      name: "Dr. Archana Shukla",
      email: "archana.shukla@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pediatrics",
      experience: 10,
      description: "Consultant Pediatrician offering affectionate care to newborns & children. Located in Aliganj, Lucknow.",
      location: "Lucknow",
      phone: "9919854721",
      verificationStatus: "VERIFIED",
    },
    // NOIDA
    {
      clerkUserId: "dr_up_noida_derm",
      name: "Dr. Kirti Rastogi",
      email: "kirti.rastogi@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Dermatology",
      experience: 9,
      description: "Dermatologist and Cosmetologist located in Sector 62, Noida. Expert in acne treatments, skin allergies, and anti-aging therapies.",
      location: "Noida",
      phone: "8800142369",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_noida_ortho",
      name: "Dr. Rahul Malhotra",
      email: "rahul.malhotra@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Orthopedics",
      experience: 14,
      description: "Expert Orthopedic Joint Replacement Surgeon based in Sector 15 Noida. Treatment of arthritis and sports injuries.",
      location: "Noida",
      phone: "9818223654",
      verificationStatus: "VERIFIED",
    },
    // GHAZIABAD
    {
      clerkUserId: "dr_up_ghaziabad_gyne",
      name: "Dr. Vandana Saxena",
      email: "vandana.saxena@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Obstetrics & Gynecology",
      experience: 18,
      description: "Senior Gynecologist and Obstetrician at Indirapuram, Ghaziabad. Known for handling high-risk pregnancy and minimal access surgeries.",
      location: "Ghaziabad",
      phone: "9811054723",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_ghaziabad_psych",
      name: "Dr. Nitesh Dwivedi",
      email: "nitesh.dwivedi@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Psychiatry",
      experience: 8,
      description: "Psychiatrist & De-addiction specialist at Raj Nagar, Ghaziabad. Focuses on anxiety, depression, and child counseling.",
      location: "Ghaziabad",
      phone: "9560412358",
      verificationStatus: "VERIFIED",
    },
    // KANPUR
    {
      clerkUserId: "dr_up_kanpur_physician",
      name: "Dr. Devendra Bhadauria",
      email: "devendra.bhadauria@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "General Medicine",
      experience: 20,
      description: "Renowned Consulting Physician in Kakadeo, Kanpur. Specialized in diabetes management, thyroid disorders, and infectious fevers.",
      location: "Kanpur",
      phone: "9839032541",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_kanpur_neuro",
      name: "Dr. Saurabh Awasthi",
      email: "saurabh.awasthi@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Neurology",
      experience: 12,
      description: "Consultant Neurologist based in Swaroop Nagar, Kanpur. Specialist in stroke rehabilitation, migraine, and epilepsy.",
      location: "Kanpur",
      phone: "9336125478",
      verificationStatus: "VERIFIED",
    },
    // AGRA
    {
      clerkUserId: "dr_up_agra_derm",
      name: "Dr. Shikha Goyal",
      email: "shikha.goyal@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Dermatology",
      experience: 7,
      description: "Aesthetic Dermatologist in Sanjay Place, Agra. Specialized in laser treatments, mole removals, and chronic eczema.",
      location: "Agra",
      phone: "9760085421",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_agra_peds",
      name: "Dr. Vineet Singhal",
      email: "vineet.singhal@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pediatrics",
      experience: 16,
      description: "Senior Pediatric Doctor located near water-works crossing, Agra. Expert in neonatal intensive care and child growth counseling.",
      location: "Agra",
      phone: "9319114256",
      verificationStatus: "VERIFIED",
    },
    // VARANASI
    {
      clerkUserId: "dr_up_varanasi_cardio",
      name: "Dr. R. K. Mishra",
      email: "rk.mishra@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Cardiology",
      experience: 19,
      description: "Senior Interventional Cardiologist in Sigra, Varanasi. Associated with top tertiary care centers in East UP.",
      location: "Varanasi",
      phone: "9450512689",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_varanasi_med",
      name: "Dr. Anand Sen",
      email: "anand.sen@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "General Medicine",
      experience: 11,
      description: "General Practitioner in Lanka, Varanasi (near BHU). Specializes in family healthcare, infections, diabetes, and preventive checkups.",
      location: "Varanasi",
      phone: "9161254388",
      verificationStatus: "VERIFIED",
    },
    // PRAYAGRAJ
    {
      clerkUserId: "dr_up_prg_ortho",
      name: "Dr. Satish Chaurasia",
      email: "satish.chaurasia@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Orthopedics",
      experience: 13,
      description: "Orthopedic & Spine Surgeon in Civil Lines, Prayagraj. Specializing in osteopathic care, fracture management, and joint pains.",
      location: "Prayagraj",
      phone: "9838025413",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_prg_pulmo",
      name: "Dr. Vinay Tripathi",
      email: "vinay.tripathi@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1622902046580-2b47f47f0871?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pulmonology",
      experience: 15,
      description: "Asthma & Chest specialist at George Town, Prayagraj. Handles allergy-induced breathing issues, sleep apnea, and tuberculosis.",
      location: "Prayagraj",
      phone: "9305142589",
      verificationStatus: "VERIFIED",
    },
    // MEERUT
    {
      clerkUserId: "dr_up_meerut_derm",
      name: "Dr. Mohit Chaudhari",
      email: "mohit.chaudhari@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Dermatology",
      experience: 11,
      description: "Consultant Dermatologist and Trichologist located in Shastri Nagar, Meerut. Treats skin infections, psoriasis, and major hair fall problems.",
      location: "Meerut",
      phone: "9927014589",
      verificationStatus: "VERIFIED",
    },
    // GORAKHPUR
    {
      clerkUserId: "dr_up_gkp_gastro",
      name: "Dr. Raghavendra Pratap",
      email: "ragha.pratap@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Gastroenterology",
      experience: 17,
      description: "Gastroenterologist in Medical College Road, Gorakhpur. Specialized in fatty liver diagnosis, gastritis, and endoscopy operations.",
      location: "Gorakhpur",
      phone: "9451023547",
      verificationStatus: "VERIFIED",
    },
    {
      clerkUserId: "dr_up_gkp_peds",
      name: "Dr. K. P. Mall",
      email: "kp.mall@doctorsmeet.in",
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200&h=200&auto=format&fit=crop",
      role: "DOCTOR",
      specialty: "Pediatrics",
      experience: 21,
      description: "Highly senior Child Specialist close to Golghar, Gorakhpur. Specializes in child immunization, growth monitoring, and pediatric asthma.",
      location: "Gorakhpur",
      phone: "9838125479",
      verificationStatus: "VERIFIED",
    }
  ];

  for (const doc of upDoctors) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: doc,
      create: doc,
    });

    // Create availability slots for next 7 days for these UP doctors
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const startTime = new Date(date);
      startTime.setHours(9, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(17, 0, 0, 0);

      await prisma.availability.upsert({
        where: { id: `availability_up_${user.id}_${i}` },
        update: {
          startTime,
          endTime,
          status: "AVAILABLE",
        },
        create: {
          id: `availability_up_${user.id}_${i}`,
          doctorId: user.id,
          startTime,
          endTime,
          status: "AVAILABLE",
        },
      });
    }
  }

  console.log(`Successfully seeded ${upDoctors.length} UP Doctors with 7-day availability slots!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
