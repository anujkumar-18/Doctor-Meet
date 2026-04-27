import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctors-listing";
import { DoctorCard } from "../components/doctor-card";
import { PageHeader } from "@/components/page-header";
import { LocationSearch } from "../components/location-search";
import { Suspense } from "react";

export default async function DoctorSpecialtyPage({ params, searchParams }) {
  const { specialty } = await params;
  const { location } = await searchParams;

  // Redirect to main doctors page if no specialty is provided
  if (!specialty) {
    redirect("/doctors");
  }

  // Fetch doctors by specialty and location
  const { doctors, error } = await getDoctorsBySpecialty(specialty, location);

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={decodeURIComponent(specialty)}
        backLink="/doctors"
        backLabel="All Specialties"
      />

      <Suspense fallback={<div>Loading search...</div>}>
        <LocationSearch />
      </Suspense>

      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            No doctors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please
            check back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
}
