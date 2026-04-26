import { getDoctorById, getAvailableTimeSlots } from "@/actions/appointments";
import { getDoctorReviews } from "@/actions/reviews";
import { DoctorProfile } from "./_components/doctor-profile";
import { ReviewSection } from "./_components/review-section";
import { redirect } from "next/navigation";

export default async function DoctorProfilePage({ params }) {
  const { id } = await params;

  try {
    // Fetch doctor data, available slots, and reviews in parallel
    const [doctorData, slotsData, reviewsData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id).catch(() => ({ days: [] })),
      getDoctorReviews(id).catch(() => ({ reviews: [] })),
    ]);

    return (
      <div className="space-y-8">
        <DoctorProfile
          doctor={doctorData.doctor}
          availableDays={slotsData.days || []}
        />
        
        <ReviewSection 
          doctorId={id} 
          reviews={reviewsData.reviews || []} 
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading doctor profile:", error);
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h2>
        <p className="text-muted-foreground mb-6">{error.message || "Could not load doctor details."}</p>
        <a href="/doctors" className="text-emerald-400 hover:underline">Back to Doctors List</a>
      </div>
    );
  }
}
