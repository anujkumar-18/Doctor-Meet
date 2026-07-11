"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setUserRole } from "@/actions/onboarding";
import { doctorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();

  // Patient onboarding states
  const [patientAge, setPatientAge] = useState("");
  const [patientProblemOpt, setPatientProblemOpt] = useState("");
  const [patientCustomProblem, setPatientCustomProblem] = useState("");
  const [patientFormError, setPatientFormError] = useState("");

  // Custom hook for user role server action
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
      location: "",
    },
  });

  // Watch specialty value for controlled select component
  const specialtyValue = watch("specialty");

  // Handle patient role selection Form transition
  const handlePatientSelection = () => {
    setStep("patient-form");
  };

  // Handle patient form submit
  const onPatientSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setPatientFormError("");

    const ageNum = parseInt(patientAge, 10);
    if (!patientAge || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setPatientFormError("Please enter a valid age between 1 and 120.");
      return;
    }

    if (!patientProblemOpt) {
      setPatientFormError("Please select your primary medical concern/problem.");
      return;
    }

    let primaryProblem = patientProblemOpt;
    if (patientProblemOpt === "Other") {
      if (!patientCustomProblem.trim()) {
        setPatientFormError("Please describe your health concern/problem in the text field.");
        return;
      }
      primaryProblem = patientCustomProblem.trim();
    }

    const formData = new FormData();
    formData.append("role", "PATIENT");
    formData.append("age", ageNum.toString());
    formData.append("primaryProblem", primaryProblem);

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      router.push(data.redirect);
    }
  }, [data]);

  // Added missing onDoctorSubmit function
  const onDoctorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);
    formData.append("location", data.location);

    await submitUserRole(formData);
  };

  // Role selection screen
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => handlePatientSelection()}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Patient
            </CardTitle>
            <CardDescription className="mb-4">
              Book appointments, consult with doctors, and manage your
              healthcare journey
            </CardDescription>
            <Button
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={(e) => {
                e.stopPropagation();
                handlePatientSelection();
              }}
            >
              Continue as Patient
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => setStep("doctor-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional profile, set your availability, and
              provide consultations
            </CardDescription>
            <Button
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={(e) => {
                e.stopPropagation();
                setStep("doctor-form");
              }}
            >
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Patient registration form
  if (step === "patient-form") {
    return (
      <Card className="border-emerald-900/20 max-w-lg mx-auto">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Patient Profile Details
            </CardTitle>
            <CardDescription>
              Please tell us a bit about yourself so we can help personalize your care.
            </CardDescription>
          </div>

          <form onSubmit={onPatientSubmit} className="space-y-6">
            {patientFormError && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 text-red-400 rounded-md text-sm">
                {patientFormError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="patientAge">Your Age (उम्र)</Label>
              <Input
                id="patientAge"
                type="number"
                placeholder="Age in years (e.g. 25)"
                value={patientAge}
                onChange={(e) => {
                  setPatientAge(e.target.value);
                  setPatientFormError("");
                }}
                min="1"
                max="120"
                required
                className="bg-black/20 border-emerald-900/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientProblem">What is your primary health concern / problem? (मुख्य बीमारी / समस्या)</Label>
              <Select
                value={patientProblemOpt}
                onValueChange={(value) => {
                  setPatientProblemOpt(value);
                  setPatientFormError("");
                }}
              >
                <SelectTrigger id="patientProblem" className="bg-black/20 border-emerald-900/30">
                  <SelectValue placeholder="Select your health concern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cold & Cough (सर्दी और खांसी)">Cold & Cough (सर्दी और खांसी)</SelectItem>
                  <SelectItem value="Fever & Flu (बुखार)">Fever & Flu (बुखार)</SelectItem>
                  <SelectItem value="Headache / Migraine (सिरदर्द)">Headache / Migraine (सिरदर्द)</SelectItem>
                  <SelectItem value="Stomach Pain / Acidity (पेट दर्द)">Stomach Pain / Acidity (पेट दर्द)</SelectItem>
                  <SelectItem value="Skin Rash / Allergy (त्वचा की समस्या)">Skin Rash / Allergy (त्वचा की समस्या)</SelectItem>
                  <SelectItem value="Muscle / Joint Pain (बदन / जोड़ों में दर्द)">Muscle / Joint Pain (बदन / जोड़ों में दर्द)</SelectItem>
                  <SelectItem value="Weakness & Fatigue (कमजोरी और थकान)">Weakness & Fatigue (कमजोरी और थकान)</SelectItem>
                  <SelectItem value="Other">Other / Something Else (अन्य समस्या)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {patientProblemOpt === "Other" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="customProblem">Describe your health concern / problem</Label>
                <Textarea
                  id="customProblem"
                  placeholder="Describe your symptoms or medical concern in detail..."
                  value={patientCustomProblem}
                  onChange={(e) => {
                    setPatientCustomProblem(e.target.value);
                    setPatientFormError("");
                  }}
                  rows={4}
                  required
                  className="bg-black/20 border-emerald-900/30"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-emerald-900/30 hover:bg-emerald-950/20"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile & Continue"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Doctor registration form
  if (step === "doctor-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Complete Your Doctor Profile
            </CardTitle>
            <CardDescription>
              Please provide your professional details for verification
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <Select
                value={specialtyValue}
                onValueChange={(value) => setValue("specialty", value)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem
                      key={spec.name}
                      value={spec.name}
                      className="flex items-center gap-2"
                    >
                      <span className="text-emerald-400">{spec.icon}</span>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.specialty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 5"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Link to Credential Document</Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://example.com/my-medical-degree.pdf"
                {...register("credentialUrl")}
              />
              {errors.credentialUrl && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.credentialUrl.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Please provide a link to your medical degree or certification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Your Services</Label>
              <Textarea
                id="description"
                placeholder="Describe your expertise, services, and approach to patient care..."
                rows="4"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Your City / Location</Label>
              <Input
                id="location"
                placeholder="e.g. Delhi, Mumbai, or Area name"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-emerald-900/30"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}
