"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Stethoscope,
  X,
  Loader2,
  Star,
  ChevronRight,
  AlertCircle,
  Navigation,
  Search,
  CheckCircle2,
  Phone,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSuggestedDoctors } from "@/actions/location-doctors";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const HEALTH_PROBLEMS = [
  { value: "Cold & Cough (सर्दी और खांसी)", emoji: "🤧" },
  { value: "Fever & Flu (बुखार)", emoji: "🌡️" },
  { value: "Headache / Migraine (सिरदर्द)", emoji: "🤕" },
  { value: "Stomach Pain / Acidity (पेट दर्द)", emoji: "🤢" },
  { value: "Skin Rash / Allergy (त्वचा की समस्या)", emoji: "🔴" },
  { value: "Muscle / Joint Pain (बदन / जोड़ों में दर्द)", emoji: "🦴" },
  { value: "Weakness & Fatigue (कमजोरी और थकान)", emoji: "😴" },
  { value: "Other Problem", emoji: "❓" },
];

const MATCH_TYPE_LABELS = {
  local_specialist: { text: "Near You • Best Match", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  specialist: { text: "Specialist Match", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  local: { text: "Near You", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
  general: { text: "Top Doctor", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
};

const MODAL_SHOWN_KEY = "docfone_location_modal_shown";

export default function LocationDoctorModal() {
  const { isSignedIn, isLoaded } = useUser();
  const [step, setStep] = useState("idle"); // idle | location | problem | loading | results | error
  const [city, setCity] = useState("");
  const [locationError, setLocationError] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Show modal automatically after login (once per session)
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    const alreadyShown = sessionStorage.getItem(MODAL_SHOWN_KEY);
    if (!alreadyShown) {
      // Wait a bit so that the page content renders first
      const timer = setTimeout(() => {
        setStep("location");
        setIsVisible(true);
        sessionStorage.setItem(MODAL_SHOWN_KEY, "1");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isLoaded]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setStep("idle");
    }, 300);
  }, []);

  // Get GPS location
  const handleGetLocation = useCallback(() => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Aapka browser location support nahi karta. City name type karein.");
      return;
    }

    setStep("locating");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using free nominatim API
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await resp.json();
          const detectedCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            "";
          setCity(detectedCity);
          setStep("problem");
        } catch {
          setLocationError("Location detect nahi hua. Please apna shehar ka naam type karein.");
          setStep("location");
        }
      },
      () => {
        setLocationError("Location permission nahi mili. Please apna shehar ka naam type karein neeche.");
        setStep("location");
      },
      { timeout: 10000 }
    );
  }, []);

  // Skip location, go straight to problem
  const handleSkipLocation = useCallback(() => {
    setStep("problem");
  }, []);

  // Fetch doctors
  const handleFindDoctors = useCallback(async () => {
    if (!selectedProblem) return;
    setStep("loading");
    try {
      const result = await getSuggestedDoctors({
        city: city.trim() || null,
        problem: selectedProblem === "Other Problem" ? null : selectedProblem,
      });
      if (result.error) {
        setStep("error");
      } else {
        setDoctors(result.doctors || []);
        setStep("results");
      }
    } catch {
      setStep("error");
    }
  }, [city, selectedProblem]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg bg-zinc-950 border border-emerald-900/30 rounded-2xl shadow-2xl shadow-emerald-900/20 overflow-hidden transition-all duration-300 ${
          isClosing ? "translate-y-4" : "translate-y-0"
        }`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── STEP: LOCATION ── */}
        {(step === "location" || step === "locating") && (
          <div className="p-6 pb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Apna Location Batao</h2>
                <p className="text-xs text-gray-400">Nazdeeqi best doctors dhundhne ke liye</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* GPS Button */}
              <button
                onClick={handleGetLocation}
                disabled={step === "locating"}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-emerald-600/10 border border-emerald-600/25 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="w-11 h-11 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  {step === "locating" ? (
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">
                    {step === "locating" ? "Location detect ho rahi hai..." : "GPS se apna location use karo"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Automatically shehar detect hoga</p>
                </div>
                {step !== "locating" && (
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto shrink-0 group-hover:text-emerald-400 transition-colors" />
                )}
              </button>

              {/* Manual input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ya shehar ka naam type karo (e.g. Lucknow, Delhi)"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded-xl text-sm text-white placeholder-gray-500 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && city.trim() && setStep("problem")}
                />
              </div>

              {locationError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-950/30 border border-amber-800/30 text-amber-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {locationError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-600"
                  onClick={handleSkipLocation}
                >
                  Skip / Baad mein
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  onClick={() => city.trim() ? setStep("problem") : handleSkipLocation()}
                >
                  Aage Badho →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: PROBLEM SELECT ── */}
        {step === "problem" && (
          <div className="p-6 pb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Kya Takleef Hai? 🤒</h2>
                <p className="text-xs text-gray-400">
                  {city ? `📍 ${city}` : "Location: Sab jagah"} • Apni problem batao
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 mt-3">
              Apni main problem select karo — hum usi ke hisaab se best doctor suggest karenge:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {HEALTH_PROBLEMS.map((prob) => (
                <button
                  key={prob.value}
                  onClick={() => setSelectedProblem(prob.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm ${
                    selectedProblem === prob.value
                      ? "bg-emerald-600/20 border-emerald-500/60 text-white ring-1 ring-emerald-500/30"
                      : "bg-zinc-900 border-zinc-800 text-gray-300 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  <span className="text-lg shrink-0">{prob.emoji}</span>
                  <span className="leading-tight text-xs font-medium">{prob.value}</span>
                  {selectedProblem === prob.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-600"
                onClick={() => setStep("location")}
              >
                ← Wapas
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                disabled={!selectedProblem}
                onClick={handleFindDoctors}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Best Doctors Dhundho!
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP: LOADING ── */}
        {step === "loading" && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[250px] gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Best Doctors Dhundh Rahe Hain...</p>
              <p className="text-gray-400 text-sm mt-1">
                {city ? `${city} ke` : "Aapke liye"} top doctors filter ho rahe hain
              </p>
            </div>
          </div>
        )}

        {/* ── STEP: ERROR ── */}
        {step === "error" && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[250px] gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Kuch Gadbad Ho Gayi!</p>
              <p className="text-gray-400 text-sm mt-1">Doctors fetch karne mein error aaya. Dobara try karo.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="border-zinc-700 text-gray-400">
                Bandh Karo
              </Button>
              <Button onClick={handleFindDoctors} className="bg-emerald-600 hover:bg-emerald-500">
                Dobara Try Karo
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP: RESULTS ── */}
        {step === "results" && (
          <div className="p-5 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Top Doctors Aapke Liye
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {city ? `📍 ${city}` : "Sab jagah"} •{" "}
                  <span className="text-emerald-400">{selectedProblem}</span>
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                {doctors.length} doctors
              </span>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Is area mein abhi koi doctor available nahi hai.</p>
                <Link href="/doctors" onClick={handleClose} className="text-emerald-400 text-sm hover:underline mt-2 block">
                  Sabhi doctors dekho →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
                {doctors.map((doc) => {
                  const matchLabel = MATCH_TYPE_LABELS[doc.matchType] || MATCH_TYPE_LABELS.general;
                  return (
                    <div
                      key={doc.id}
                      className="flex gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/60 hover:border-emerald-900/50 transition-all group"
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-emerald-900/20 border border-emerald-900/30 flex items-center justify-center shrink-0 overflow-hidden">
                        {doc.imageUrl ? (
                          <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-emerald-400/60" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              Dr. {doc.name}
                            </p>
                            <p className="text-xs text-emerald-400 truncate">{doc.specialty || "General Physician"}</p>
                          </div>
                          {/* Match badge */}
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${matchLabel.bg} ${matchLabel.color}`}>
                            {matchLabel.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                          {doc.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {doc.location}
                            </span>
                          )}
                          {doc.experience && (
                            <span>{doc.experience}+ yrs exp</span>
                          )}
                          {doc.avgRating && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {doc.avgRating}
                              <span className="text-gray-500">({doc.reviewCount})</span>
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-2">
                          <Link
                            href={`/doctors/${encodeURIComponent(doc.specialty || "General Physician")}/${doc.id}`}
                            onClick={handleClose}
                            className="flex-1 text-center text-[11px] font-semibold py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                          >
                            Book Appointment
                          </Link>
                          {doc.phone && (
                            <a
                              href={`tel:${doc.phone}`}
                              className="text-[11px] font-medium py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
              <p className="text-xs text-gray-500">Sabhi verified doctors dekhne ke liye</p>
              <Link
                href="/doctors"
                onClick={handleClose}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                Sabhi Doctors Dekho
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
