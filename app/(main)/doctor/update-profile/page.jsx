"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope } from "lucide-react";
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
import { doctorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import { getCurrentUser, setUserRole } from "@/actions/onboarding";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";

export default function UpdateDoctorProfilePage() {
  const [fetchingUser, setFetchingUser] = useState(true);
  const router = useRouter();

  const { loading, data, fn: submitUpdate } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: 0,
      credentialUrl: "",
      description: "",
    },
  });

  const specialtyValue = watch("specialty");

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user && user.role === "DOCTOR") {
          reset({
            specialty: user.specialty || "",
            experience: user.experience || 0,
            credentialUrl: user.credentialUrl || "",
            description: user.description || "",
          });
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        toast.error("Failed to fetch profile data");
      } finally {
        setFetchingUser(false);
      }
    }
    fetchUser();
  }, [reset, router]);

  const onUpdateSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUpdate(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Profile updated and resubmitted for verification!");
      router.push("/doctor/verification");
    }
  }, [data, router]);

  if (fetchingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        icon={<Stethoscope className="h-8 w-8" />}
        title="Update Professional Profile"
        backLink="/doctor/verification"
        backLabel="Back to Verification Status"
      />

      <div className="max-w-3xl mx-auto mt-8">
        <Card className="border-emerald-900/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Revise Your Information
            </CardTitle>
            <CardDescription>
              Update your credentials and details for administrative re-review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
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
                <Label htmlFor="credentialUrl">
                  Link to Credential Document
                </Label>
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
                  Please ensure this link is publicly accessible for verification
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

              <div className="pt-2 flex items-center justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-12"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update and Resubmit"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
