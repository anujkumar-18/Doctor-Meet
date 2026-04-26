"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getPatientMedicalDetails,
  updatePatientMedicalDetails,
} from "@/actions/patient";
import { Loader2, User, Activity, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";

const medicalSchema = z.object({
  age: z.number().min(0).max(120).optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
});

export default function MedicalDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(medicalSchema),
    defaultValues: {
      age: null,
      bloodGroup: "",
      weight: null,
      height: null,
      allergies: "",
      medicalHistory: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { medicalDetails, error } = await getPatientMedicalDetails();
        if (error) {
          toast.error(error);
        } else if (medicalDetails) {
          form.reset({
            age: medicalDetails.age || null,
            bloodGroup: medicalDetails.bloodGroup || "",
            weight: medicalDetails.weight || null,
            height: medicalDetails.height || null,
            allergies: medicalDetails.allergies || "",
            medicalHistory: medicalDetails.medicalHistory || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load medical details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [form]);

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key].toString());
        }
      });

      const result = await updatePatientMedicalDetails(formData);
      if (result.success) {
        toast.success("Medical details updated successfully");
      } else {
        toast.error(result.error || "Failed to update medical details");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        icon={<User className="h-8 w-8" />}
        title="Medical Details"
        backLink="/appointments"
        backLabel="Back to Appointments"
      />

      <div className="max-w-4xl mx-auto mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info Card */}
              <Card className="border-emerald-900/20">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    Physical Information
                  </CardTitle>
                  <CardDescription>
                    Your basic physical measurements and age
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Years"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : null
                              )
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "A+",
                              "A-",
                              "B+",
                              "B-",
                              "AB+",
                              "AB-",
                              "O+",
                              "O-",
                            ].map((bg) => (
                              <SelectItem key={bg} value={bg}>
                                {bg}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="kg"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="cm"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Medical Info Card */}
              <Card className="border-emerald-900/20 h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    Medical History
                  </CardTitle>
                  <CardDescription>
                    Allergies and past medical records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. Peanuts, Penicillin, Dust..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          List any allergies you have
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="border-emerald-900/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  Detailed Medical History
                </CardTitle>
                <CardDescription>
                  Share your past surgeries, chronic conditions, or ongoing
                  medications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a brief summary of your medical history..."
                          className="min-h-[150px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto px-12"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Medical Details"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
