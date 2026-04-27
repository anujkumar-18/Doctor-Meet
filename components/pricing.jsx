"use client";

import React, { useState } from "react";
import { PricingCard } from "./pricing-card";
import { QRPaymentModal } from "./qr-payment-modal";

const PLANS = [
  {
    name: "Basic",
    price: 100,
    credits: 2,
    features: [
      "Access to all Doctors",
      "2 Consultation Credits",
      "Video Consultations",
      "Digital Prescriptions",
      "Email Support",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: 499,
    credits: 10,
    features: [
      "Everything in Basic",
      "10 Consultation Credits",
      "Priority Appointment Booking",
      "Medical History Storage",
      "Chat with Doctors",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: 999,
    credits: 24,
    features: [
      "Everything in Standard",
      "24 Consultation Credits",
      "24/7 Priority Support",
      "Family Profile Management",
      "Personal Health Dashboard",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan) => {
    if (plan.price === 0) {
      // Handle free plan logic if needed (e.g. redirect to onboarding)
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.name}
            {...plan}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      <QRPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />
    </div>
  );
};

export default Pricing;
