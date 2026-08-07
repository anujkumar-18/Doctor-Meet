"use client";

import { useEffect, useRef } from "react";
import { checkAndAllocateCredits } from "@/actions/credits";

export default function CreditInitializer({ user }) {
  const ranRef = useRef(false);

  useEffect(() => {
    if (!user || user.role !== "PATIENT" || ranRef.current) return;

    // Run this check once per browser session to avoid database/Clerk API overload
    const sessionKey = `docfone_credits_checked_${user.id}`;
    const alreadyChecked = sessionStorage.getItem(sessionKey);

    if (!alreadyChecked) {
      ranRef.current = true;
      
      // Perform background transaction check
      checkAndAllocateCredits(user)
        .then(() => {
          sessionStorage.setItem(sessionKey, "true");
        })
        .catch((err) => {
          console.error("Background credits sync error:", err);
          ranRef.current = false; // Allow retry on failure
        });
    }
  }, [user]);

  return null;
}
