"use client";

import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PricingCard({ 
  name, 
  price, 
  credits, 
  features, 
  popular = false, 
  onSelect 
}) {
  return (
    <Card className={`relative flex flex-col h-full border-emerald-900/20 bg-background/50 backdrop-blur-sm transition-all hover:border-emerald-700/40 ${popular ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-105 z-10' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">{name}</CardTitle>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-white">₹{price}</span>
          <span className="ml-1 text-muted-foreground">/one-time</span>
        </div>
        <p className="mt-2 text-emerald-400 font-medium">
          {credits} Credits Included
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <Check className="h-4 w-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={`w-full ${popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30'}`}
          onClick={() => onSelect({ name, price, credits })}
        >
          {price === 0 ? "Get Started" : "Buy Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
