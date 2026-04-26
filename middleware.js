import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/doctor(.*)",
  "/admin(.*)",
  "/video-call(.*)",
  "/appointments(.*)",
  "/medical-details(.*)",
]);

// Helper to check if a route should be public
const isPublicRoute = createRouteMatcher([
  "/",
  "/doctors(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;

  // List of public routes that don't need authentication
  const isPublicPath = 
    path === "/" || 
    path.startsWith("/doctors") || 
    path.startsWith("/sign-in") || 
    path.startsWith("/sign-up");

  if (isPublicPath) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // List of protected routes
  const isProtectedPath = 
    path.startsWith("/onboarding") ||
    path.startsWith("/doctor") ||
    path.startsWith("/admin") ||
    path.startsWith("/video-call") ||
    path.startsWith("/appointments") ||
    path.startsWith("/medical-details");

  if (!userId && isProtectedPath) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
