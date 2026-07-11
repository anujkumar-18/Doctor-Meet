"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Loader2, Clock, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { bookAppointmentWithPayment } from "@/actions/appointments";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { AppointmentPaymentModal } from "@/components/appointment-payment-modal";

export function AppointmentForm({ doctorId, slot, onBack, onComplete, doctorName }) {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { loading, data, fn: submitBooking } = useFetch(bookAppointmentWithPayment);

  // Called when user confirms payment in modal
  const handlePaymentConfirmed = async ({ transactionId, amountPaid }) => {
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", `Problem duration: ${duration}\n\n${description}`);
    formData.append("transactionId", transactionId);
    formData.append("amountPaid", amountPaid.toString());

    await submitBooking(formData);
  };

  // Watch for result
  useEffect(() => {
    if (data) {
      if (data.success) {
        setShowPaymentModal(false);
        toast.success("🎉 Appointment booked! Receipt sent to your email.");
        onComplete();
      } else {
        toast.error(data.error || "Failed to book appointment. Please try again.");
      }
    }
  }, [data]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!duration.trim()) {
      toast.error("Please tell us how long you have had this problem.");
      return;
    }
    // Open payment modal instead of directly booking
    setShowPaymentModal(true);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Slot summary */}
        <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-white font-medium">
              {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-white">{slot.formatted}</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-muted-foreground">
              Consultation Fee:{" "}
              <span className="text-white font-medium">₹299</span>
              <span className="text-muted-foreground text-xs ml-2">(2 credits deducted)</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">
              Aapko yeh problem kab se hai? (How long have you had this problem?)
            </Label>
            <Input
              id="duration"
              placeholder="e.g. 2 days, 1 week, etc."
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-background border-emerald-900/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Describe your medical concern (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-emerald-900/20 h-32"
            />
            <p className="text-sm text-muted-foreground">
              This information will be shared with the doctor before your appointment.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-emerald-900/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change Time Slot
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Pay & Book Appointment
          </Button>
        </div>
      </form>

      {/* Payment Modal */}
      <AppointmentPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        doctorName={doctorName || "Doctor"}
        slotFormatted={slot?.formatted || ""}
        isLoading={loading}
      />
    </>
  );
}
