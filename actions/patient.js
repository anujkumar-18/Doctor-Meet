"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get all appointments for the authenticated patient
 */
export async function getPatientAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("Patient not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        patientId: user.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    console.error("Failed to get patient appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
}

/**
 * Get medical details for the authenticated patient
 */
export async function getPatientMedicalDetails() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
      select: {
        age: true,
        bloodGroup: true,
        weight: true,
        height: true,
        allergies: true,
        medicalHistory: true,
      },
    });

    return { medicalDetails: user };
  } catch (error) {
    console.error("Failed to get patient medical details:", error);
    return { error: "Failed to fetch medical details" };
  }
}

/**
 * Update medical details for the authenticated patient
 */
export async function updatePatientMedicalDetails(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const age = parseInt(formData.get("age"));
    const bloodGroup = formData.get("bloodGroup");
    const weight = parseFloat(formData.get("weight"));
    const height = parseFloat(formData.get("height"));
    const allergies = formData.get("allergies");
    const medicalHistory = formData.get("medicalHistory");

    await db.user.update({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
      data: {
        age: isNaN(age) ? null : age,
        bloodGroup,
        weight: isNaN(weight) ? null : weight,
        height: isNaN(height) ? null : height,
        allergies,
        medicalHistory,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update medical details:", error);
    return { error: "Failed to update medical details" };
  }
}

