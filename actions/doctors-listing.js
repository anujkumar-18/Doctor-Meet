"use server";

import { db } from "@/lib/prisma";

/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(specialty, location = null) {
  try {
    const where = {
      role: "DOCTOR",
      verificationStatus: "VERIFIED",
      specialty: decodeURIComponent(specialty),
    };

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    const doctors = await db.user.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    return { error: "Failed to fetch doctors" };
  }
}

/**
 * Get all verified doctors with optional location filter
 */
export async function getAllDoctors(location = null) {
  try {
    const where = {
      role: "DOCTOR",
      verificationStatus: "VERIFIED",
    };

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    const doctors = await db.user.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch all doctors:", error);
    return { error: "Failed to fetch doctors" };
  }
}
