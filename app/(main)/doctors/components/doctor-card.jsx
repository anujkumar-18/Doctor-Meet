import { User, Star, Calendar, MessageSquare, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <Card className="border-emerald-900/20 hover:border-emerald-700/40 transition-all overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {/* Main Content Info */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Avatar Container */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-900/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-emerald-900/30">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-emerald-400" />
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
              <h3 className="font-semibold text-white text-lg sm:text-xl truncate">
                {doctor.name?.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
              </h3>
              <Badge
                variant="outline"
                className="bg-emerald-950/40 border-emerald-900/30 text-emerald-400 self-start text-xs flex items-center gap-1 py-0.5 px-2"
              >
                <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                Verified
              </Badge>
            </div>

            <p className="text-sm text-emerald-400/90 mb-1 font-medium">
              {doctor.specialty} • {doctor.experience} years experience
            </p>

            {doctor.location && (
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <MapPin className="h-3.5 w-3.5 mr-1 text-emerald-500 shrink-0" />
                <span className="truncate">{doctor.location}</span>
              </div>
            )}

            <div className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {doctor.description}
            </div>
          </div>
        </div>

        {/* Responsive buttons grid/flex */}
        <div className="flex flex-col min-[450px]:flex-row gap-2 mt-5 w-full">
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex-1 transition-all active:scale-[0.98]"
          >
            <Link href={`/doctors/${encodeURIComponent(doctor.specialty)}/${doctor.id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
          <div className="flex gap-2 flex-1 min-[450px]:flex-[0.8]">
            <Button
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/20 flex-1 transition-all active:scale-[0.98]"
              asChild
            >
              <a href={`tel:${doctor.phone || "8115462049"}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-950/20 flex-1 transition-all active:scale-[0.98]"
              asChild
            >
              <a 
                href={`https://wa.me/91${doctor.phone || "8115462049"}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
