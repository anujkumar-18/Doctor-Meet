
import { AlertCircle, ClipboardCheck, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/components/actions/onboarding";


const VerificationPage = async () => {
  const user = await getCurrentUser();

  // If already verified, redirect to dashboard
  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-900/20">
          <CardHeader className="text-center">
            <div
              className={`mx-auto p-4 ${isRejected ? "bg-red-900/20" : "bg-amber-900/20"
                } rounded-full mb-4 w-fit`}
            >
              {isRejected ? (
                <XCircle className="h-8 w-8 text-red-400" />
              ) : (
                <ClipboardCheck className="h-8 w-8 text-amber-400" />
              )}
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              {isRejected ? "Verification Rejected" : "Verification Pending"}
            </CardTitle>

            <CardDescription>
              {isRejected
                ? "Unfortunately, your application needs revision"
                : "Thank you for submitting your information"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isRejected ? (
              <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground text-left">
                  <p className="mb-2">
                    Our administrative ream has reviewed your application and found that it doesn&apos;t meet our current requirements.
                    Common reasons for rejection include:
                  </p>
                  <ul className="list-dise pl-5 space-y-1 mb-3">
                    <li>Insufficient or unclear credential documentation</li>
                    <li>Professional experience requirements not met</li>
                    <li>Incomplete or vague service descriptions</li>
                  </ul>
                  <p>
                    You can update your appliccation with more information and resubmit for review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground text-left">
                  Your profile is currently under review by our administrative team.
                  This process typically takes 1-2 business days. You&apos;ll receive an email notification once your account is verified.
                </p>

              </div>
            )}

            <p>
              {isRejected
                ? "You can update your doctor profile and resubmit for verification."
                : "While you wait, you can familiarize yoursel with our platform or reach out to our support team if you have any questions."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="outline"
                className="bg-emerald-900/30"
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;