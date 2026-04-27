import { SPECIALTIES } from "@/lib/specialities";
import { LocationSearch } from "./components/location-search";
import { getAllDoctors } from "@/actions/doctors-listing";
import { DoctorCard } from "./components/doctor-card";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DoctorsPage({ searchParams }) {
  const { location } = await searchParams;

  let doctors = [];
  if (location) {
    const res = await getAllDoctors(location);
    doctors = res.doctors || [];
  } else {
    const res = await getAllDoctors(); // Get some doctors to feature
    doctors = res.doctors?.slice(0, 4) || [];
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center justify-center text-center pt-8">
        <h1 className="text-5xl font-extrabold text-white mb-6 gradient-title tracking-tight">
          Find Your Healthcare Expert
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mb-10 leading-relaxed">
          Search by location to find doctors near you, or browse by specialty
          for expert care in specific fields.
        </p>

        <Suspense fallback={<div>Loading search...</div>}>
          <LocationSearch />
        </Suspense>
      </div>

      {location ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b border-emerald-900/30 pb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <MapPin className="h-7 w-7 text-emerald-400" />
              Doctors in <span className="text-emerald-400">"{location}"</span>
            </h2>
            <Badge variant="outline" className="text-lg px-4 py-1 border-emerald-900/40 text-emerald-400">
              {doctors.length} Results
            </Badge>
          </div>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-emerald-950/20 rounded-3xl border border-emerald-900/30 shadow-2xl">
              <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-emerald-400/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No doctors found in this location
              </h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                We couldn't find any verified doctors in "{location}". Try
                searching for Delhi, Mumbai, or Kanpur.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-emerald-900/30 pb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Star className="h-7 w-7 text-emerald-400" />
              Featured Doctors
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-10 pt-8">
        <div className="flex items-center justify-between border-b border-emerald-900/30 pb-6">
          <h2 className="text-3xl font-bold text-white">Browse by Specialty</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty.name}
              href={`/doctors/${encodeURIComponent(specialty.name)}`}
              className="group"
            >
              <Card className="hover:border-emerald-500/50 transition-all duration-300 cursor-pointer border-emerald-900/30 h-full bg-emerald-950/10 hover:bg-emerald-900/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-emerald-400" />
                </div>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-900/30 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-emerald-500/20 group-hover:rotate-6">
                    <div className="text-emerald-400 scale-[1.75]">
                      {specialty.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {specialty.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    View Specialists
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
