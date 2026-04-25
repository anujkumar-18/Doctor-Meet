"use server";

import { checkUser } from "@/lib/checkUser";

export const verifyAdmin = async () => {
  try {
    const user = await checkUser();
    
    if (!user) {
      return false;
    }
    
    return user.role === "ADMIN";
  } catch (error) {
    console.error("Error in verifyAdmin:", error);
    return false;
  }
};
