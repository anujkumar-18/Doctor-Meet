"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X } from "lucide-react";

export function LocationSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }
    router.push(`?${params.toString()}`);
  };

  const clearSearch = () => {
    setLocation("");
    const params = new URLSearchParams(searchParams);
    params.delete("location");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md mb-6">
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
        <Input
          placeholder="Search by city (e.g. Delhi, Mumbai)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 bg-background border-emerald-900/20 focus:border-emerald-500"
        />
        {location && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-3 text-muted-foreground hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
        <Search className="h-4 w-4 mr-2" />
        Find
      </Button>
    </form>
  );
}
