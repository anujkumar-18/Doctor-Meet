import React from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
  Menu,
  Home,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import { checkAndAllocateCredits } from "@/actions/credits";
import Image from "next/image";

export default async function Header() {
  const user = await checkUser();
  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/logo-single.png"
              alt="Docfone Logo"
              width={200}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link href="/doctors" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
              Find Doctors
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
              About & Pricing
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <SignedIn>
            {/* Admin Links */}
            {user?.role === "ADMIN" && (
              <>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                  asChild
                >
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0" asChild>
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            {/* Doctor Links */}
            {user?.role === "DOCTOR" && (
              <>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                  asChild
                >
                  <Link href="/doctor">
                    <Stethoscope className="h-4 w-4" />
                    Doctor Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0" asChild>
                  <Link href="/doctor">
                    <Stethoscope className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            {/* Patient Links */}
            {user?.role === "PATIENT" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                  asChild
                >
                  <Link href="/appointments">
                    <Calendar className="h-4 w-4" />
                    My Appointments
                  </Link>
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0" asChild>
                  <Link href="/appointments">
                    <Calendar className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                  asChild
                >
                  <Link href="/medical-details">
                    <User className="h-4 w-4" />
                    Medical Details
                  </Link>
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0" asChild>
                  <Link href="/medical-details">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Unassigned Role */}
            {user?.role === "UNASSIGNED" && (
              <>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                  asChild
                >
                  <Link href="/onboarding">
                    <User className="h-4 w-4" />
                    Complete Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0" asChild>
                  <Link href="/onboarding">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </SignedIn>

          {(!user || user?.role !== "ADMIN") && (
            <Link href={user?.role === "PATIENT" ? "/pricing" : "/doctor"}>
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}{" "}
                      <span className="hidden md:inline">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned Credits"}
                      </span>
                    </>
                  ) : (
                    <>Pricing</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          {/* Mobile Quick Links */}
          <div className="flex lg:hidden items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Stethoscope className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
