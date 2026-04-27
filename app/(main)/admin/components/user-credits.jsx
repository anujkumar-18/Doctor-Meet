"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Coins, Search, UserPlus } from "lucide-react";
import { addManualCredits } from "@/actions/admin";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

export function UserCredits() {
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState("");

  const { loading, data, error, fn: submitCredits } = useFetch(addManualCredits);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !credits) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("credits", credits);

    await submitCredits(formData);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success(`Successfully added ${credits} credits to ${email}`);
      setEmail("");
      setCredits("");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to add credits");
    }
  }, [error]);

  return (
    <Card className="border-emerald-900/20 bg-background/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Coins className="h-5 w-5 mr-2 text-emerald-400" />
          Manage User Credits
        </CardTitle>
        <CardDescription>
          Manually add credits to a patient's account after verifying their payment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="email">Patient Email Address</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-background border-emerald-900/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Number of Credits to Add</Label>
            <div className="relative">
              <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="credits"
                type="number"
                placeholder="e.g. 10, 24"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="pl-10 bg-background border-emerald-900/20 focus:border-emerald-500"
                required
                min="1"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Balance...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Credits to Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 p-4 rounded-lg bg-emerald-900/10 border border-emerald-900/20">
          <h4 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">Quick Instructions</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
            <li>Ensure the patient has already registered on the platform.</li>
            <li>Verify the payment amount matches the plan they requested.</li>
            <li>Credits are added instantly to the user's balance.</li>
            <li>A transaction record will be created for tracking.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
