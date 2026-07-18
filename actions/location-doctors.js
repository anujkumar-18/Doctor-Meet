"use server";

import { db } from "@/lib/prisma";

// Maps common patient problems to doctor specialties
const PROBLEM_TO_SPECIALTY = {
  "Cold & Cough (सर्दी और खांसी)": ["General Physician", "Pulmonologist", "ENT Specialist"],
  "Fever & Flu (बुखार)": ["General Physician", "Internal Medicine"],
  "Headache / Migraine (सिरदर्द)": ["Neurologist", "General Physician"],
  "Stomach Pain / Acidity (पेट दर्द)": ["Gastroenterologist", "General Physician"],
  "Skin Rash / Allergy (त्वचा की समस्या)": ["Dermatologist", "General Physician"],
  "Muscle / Joint Pain (बदन / जोड़ों में दर्द)": ["Orthopedic Surgeon", "Rheumatologist", "General Physician"],
  "Weakness & Fatigue (कमजोरी और थकान)": ["General Physician", "Internal Medicine"],
};

/**
 * Get best doctors based on user location (city) and health problem
 */
export async function getSuggestedDoctors({ city, problem }) {
  try {
    // Build specialty list from problem
    let specialties = [];
    if (problem && PROBLEM_TO_SPECIALTY[problem]) {
      specialties = PROBLEM_TO_SPECIALTY[problem];
    }

    // Build where clause - verified doctors only
    const baseWhere = {
      role: "DOCTOR",
      verificationStatus: "VERIFIED",
    };

    let doctors = [];

    // Priority 1: Doctors matching both location AND specialty
    if (city && specialties.length > 0) {
      const localSpecialists = await db.user.findMany({
        where: {
          ...baseWhere,
          location: { contains: city, mode: "insensitive" },
          specialty: { in: specialties },
        },
        select: {
          id: true,
          name: true,
          specialty: true,
          location: true,
          experience: true,
          description: true,
          imageUrl: true,
          phone: true,
          doctorReviews: {
            select: { rating: true },
          },
        },
        orderBy: { experience: "desc" },
        take: 6,
      });
      doctors.push(...localSpecialists.map(d => ({ ...d, matchType: "local_specialist" })));
    }

    // Priority 2: Doctors matching specialty (any location) - fill up to 6
    if (specialties.length > 0 && doctors.length < 6) {
      const alreadyFound = doctors.map(d => d.id);
      const specialists = await db.user.findMany({
        where: {
          ...baseWhere,
          specialty: { in: specialties },
          id: { notIn: alreadyFound },
        },
        select: {
          id: true,
          name: true,
          specialty: true,
          location: true,
          experience: true,
          description: true,
          imageUrl: true,
          phone: true,
          doctorReviews: {
            select: { rating: true },
          },
        },
        orderBy: { experience: "desc" },
        take: 6 - doctors.length,
      });
      doctors.push(...specialists.map(d => ({ ...d, matchType: "specialist" })));
    }

    // Priority 3: Local doctors (any specialty) - fill up to 6
    if (city && doctors.length < 6) {
      const alreadyFound = doctors.map(d => d.id);
      const localDoctors = await db.user.findMany({
        where: {
          ...baseWhere,
          location: { contains: city, mode: "insensitive" },
          id: { notIn: alreadyFound },
        },
        select: {
          id: true,
          name: true,
          specialty: true,
          location: true,
          experience: true,
          description: true,
          imageUrl: true,
          phone: true,
          doctorReviews: {
            select: { rating: true },
          },
        },
        orderBy: { experience: "desc" },
        take: 6 - doctors.length,
      });
      doctors.push(...localDoctors.map(d => ({ ...d, matchType: "local" })));
    }

    // Priority 4: Any verified doctor - fill up to 6
    if (doctors.length < 6) {
      const alreadyFound = doctors.map(d => d.id);
      const anyDoctors = await db.user.findMany({
        where: {
          ...baseWhere,
          id: { notIn: alreadyFound },
        },
        select: {
          id: true,
          name: true,
          specialty: true,
          location: true,
          experience: true,
          description: true,
          imageUrl: true,
          phone: true,
          doctorReviews: {
            select: { rating: true },
          },
        },
        orderBy: { experience: "desc" },
        take: 6 - doctors.length,
      });
      doctors.push(...anyDoctors.map(d => ({ ...d, matchType: "general" })));
    }

    // Compute average rating for each doctor
    const enriched = doctors.map((doc) => {
      const reviews = doc.doctorReviews || [];
      const avgRating =
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : null;
      return {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        location: doc.location,
        experience: doc.experience,
        description: doc.description,
        imageUrl: doc.imageUrl,
        phone: doc.phone,
        avgRating: avgRating ? parseFloat(avgRating) : null,
        reviewCount: reviews.length,
        matchType: doc.matchType,
      };
    });

    return { doctors: enriched, specialties };
  } catch (error) {
    console.error("Error fetching suggested doctors:", error);
    return { error: "Failed to fetch doctors. Please try again." };
  }
}
