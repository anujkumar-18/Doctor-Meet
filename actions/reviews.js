"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Submit a review for a doctor
 */
export async function submitReview(formData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      return { success: false, error: "Only patients can submit reviews" };
    }

    const doctorId = formData.get("doctorId");
    const rating = parseInt(formData.get("rating"));
    const comment = formData.get("comment");

    if (!doctorId || !rating) {
      return { success: false, error: "Doctor ID and rating are required" };
    }

    const review = await db.review.create({
      data: {
        patientId: patient.id,
        doctorId: doctorId,
        rating,
        comment,
      },
    });

    revalidatePath("/doctors");
    return { success: true, review };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

/**
 * Get reviews for a doctor
 */
export async function getDoctorReviews(doctorId) {
  try {
    const reviews = await db.review.findMany({
      where: {
        doctorId: doctorId,
      },
      include: {
        patient: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { reviews };
  } catch (error) {
    console.error("Failed to get reviews:", error);
    return { error: "Failed to fetch reviews" };
  }
}
