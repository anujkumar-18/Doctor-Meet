"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope, User } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { setUserRole } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/specialities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z
    .number({
      required_error: "Experience is required",
      invalid_type_error: "Experience must be a number",
    })
    .min(1, "Experience must be at least 1 year")
    .max(70, "Experience must be less than 70 years"),
  credentialUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Credential URL is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

const OnboardingPage = () => {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();
  const { data, fn: submitUserRole, loading } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  const specialtyValue = watch("specialty");

  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Role selected successfully!");
      router.push(data.redirect);
    }
  }, [data, router]);

  const onDoctorSubmit = async (formDataValues) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", formDataValues.specialty);
    formData.append("experience", formDataValues.experience.toString());
    formData.append("credentialUrl", formDataValues.credentialUrl);
    formData.append("description", formDataValues.description);

    await submitUserRole(formData);
  };

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Patient Card */}
        <Card
          onClick={() => !loading && handlePatientSelection()}
          className="cursor-pointer border-emerald-900/20 transition-all hover:border-emerald-700/40"
        >
          <CardContent className="flex flex-col items-center pt-6 pb-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-900/20 p-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>

            <CardTitle className="mb-2 text-xl font-semibold text-white">
              Join as a Patient
            </CardTitle>

            <CardDescription className="mb-4">
              Book appointments, consult with doctors, and manage your healthcare
              journey.
            </CardDescription>

            <Button
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue as a Patient"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Doctor Card */}
        <Card
          onClick={() => !loading && setStep("doctor-form")}
          className="cursor-pointer border-emerald-900/20 transition-all hover:border-emerald-700/40"
        >
          <CardContent className="flex flex-col items-center pt-6 pb-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-900/20 p-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>

            <CardTitle className="mb-2 text-xl font-semibold text-white">
              Join as a Doctor
            </CardTitle>

            <CardDescription className="mb-4">
              Create your professional profile, set your availability, and provide
              consultations.
            </CardDescription>

            <Button
              type="button"
              onClick={() => setStep("doctor-form")}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Continue as a Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "doctor-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="mb-2 text-2xl font-bold text-white">
              Complete Your Doctor Profile
            </CardTitle>
            <CardDescription>
              Please provide your professional details for verification.
            </CardDescription>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onDoctorSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <Select
                value={specialtyValue}
                onValueChange={(value) =>
                  setValue("specialty", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>

                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem key={spec.name} value={spec.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">{spec.icon}</span>
                        {spec.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.specialty && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {errors.specialty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="eg. 5"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="mt-1 text-sm font-medium text-red-500">
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
                <p className="mt-1 text-sm font-medium text-red-500">
                  {errors.credentialUrl.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Please provide a link to your medical degree or certification.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Your Services</Label>
              <Textarea
                id="description"
                placeholder="Describe your expertise, services, and approach to patient care..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
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

  return null;
};

export default OnboardingPage;