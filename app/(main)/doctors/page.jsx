import { SPECIALTIES } from "@/lib/specialities";
import { LocationSearch } from "./components/location-search";
import { getAllDoctors } from "@/actions/doctors-listing";
import { DoctorCard } from "./components/doctor-card";
import { Suspense } from "react";

export default async function DoctorsPage({ searchParams }) {
  const { location } = await searchParams;

  let doctors = [];
  if (location) {
    const res = await getAllDoctors(location);
    doctors = res.doctors || [];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4 gradient-title">
          Find Your Healthcare Expert
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mb-8">
          Search by location to find doctors near you, or browse by specialty
          for expert care in specific fields.
        </p>

        <Suspense fallback={<div>Loading search...</div>}>
          <LocationSearch />
        </Suspense>
      </div>

      {location ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-900/20 pb-4">
            <h2 className="text-2xl font-bold text-white">
              Doctors in <span className="text-emerald-400">"{location}"</span>
            </h2>
            <p className="text-muted-foreground">
              {doctors.length} doctors found
            </p>
          </div>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-emerald-950/10 rounded-2xl border border-emerald-900/20">
              <h3 className="text-xl font-medium text-white mb-2">
                No doctors found in this location
              </h3>
              <p className="text-muted-foreground">
                We couldn't find any verified doctors in "{location}". Try
                another city or browse by specialty below.
              </p>
            </div>
          )}
        </div>
      ) : null}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-emerald-900/20 pb-4">
          Browse by Specialty
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty.name}
              href={`/doctors/${encodeURIComponent(specialty.name)}`}
            >
              <Card className="hover:border-emerald-700/40 transition-all cursor-pointer border-emerald-900/20 h-full bg-background/50 hover:bg-emerald-900/5">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <div className="text-emerald-400 scale-125">
                      {specialty.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400">
                    {specialty.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
