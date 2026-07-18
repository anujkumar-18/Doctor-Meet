"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Copy,
  Loader2,
  ShieldCheck,
  Smartphone,
  Clock,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

const APPOINTMENT_FEE = 299;
const UPI_ID = "8115462049-2@ibl";

export function AppointmentPaymentModal({
  isOpen,
  onClose,
  onPaymentConfirmed,
  doctorName,
  slotFormatted,
  isLoading,
}) {
  const [step, setStep] = useState("payment"); // "payment" | "confirm"
  const [transactionId, setTransactionId] = useState("");

  const upiUrl = `upi://pay?pa=${UPI_ID}&am=${APPOINTMENT_FEE}&tn=Docfone_Appointment&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=000000&margin=10`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
  };

  const handleProceedToConfirm = () => {
    setStep("confirm");
  };

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) {
      toast.error("Please enter your UPI transaction ID to confirm payment.");
      return;
    }
    onPaymentConfirmed({ transactionId: transactionId.trim(), amountPaid: APPOINTMENT_FEE });
  };

  const handleClose = () => {
    setStep("payment");
    setTransactionId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[#0d1a27] border border-emerald-900/30 p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/40 px-6 pt-6 pb-5 border-b border-emerald-900/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Complete Payment to Book
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-400 mt-1">
              Pay <span className="text-emerald-400 font-bold">₹{APPOINTMENT_FEE}</span> to confirm your appointment with{" "}
              <span className="text-white font-semibold">Dr. {doctorName}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          {step === "payment" && (
            <div className="space-y-5">
              {/* Appointment Summary */}
              <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Clock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{slotFormatted}</span>
                </div>
              </div>

              {/* QR Code + Amount */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-slate-400 text-center">
                  Scan QR code with any UPI app (PhonePe, GPay, Paytm, etc.)
                </p>
                <div className="relative">
                  <div className="p-3 bg-white rounded-2xl shadow-2xl shadow-emerald-500/10">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="rounded-lg block"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow">
                    ₹{APPOINTMENT_FEE}
                  </div>
                </div>
              </div>

              {/* UPI ID */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-700/50 rounded-xl mt-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">UPI ID</p>
                  <p className="text-white font-mono text-sm font-medium">{UPI_ID}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyUpiId}
                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>

              {/* Instruction */}
              <div className="flex items-start gap-3 p-3 bg-blue-900/10 border border-blue-900/20 rounded-xl">
                <Smartphone className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  After payment, note your <strong className="text-white">UPI Transaction ID</strong> from the payment confirmation screen. You will need to enter it in the next step.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToConfirm}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Maine Pay Kar Diya →
                </Button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-5">
              {/* Success-like header */}
              <div className="flex flex-col items-center text-center gap-2 py-2">
                <div className="bg-emerald-900/30 border border-emerald-900/40 rounded-full p-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Payment Done?</h3>
                <p className="text-slate-400 text-sm">
                  Enter your UPI transaction ID to confirm and book your appointment.
                  Your receipt will be sent to your registered email.
                </p>
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-2">
                <Label htmlFor="txn-id" className="text-slate-300 text-sm font-medium">
                  UPI Transaction ID <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="txn-id"
                  placeholder="e.g. 123456789012 or T2506XXXXXX"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500"
                />
                <p className="text-xs text-slate-500">
                  Find this in your UPI app payment history or SMS.
                </p>
              </div>

              {/* Email notice */}
              <div className="flex items-start gap-3 p-3 bg-emerald-900/10 border border-emerald-900/20 rounded-xl">
                <Mail className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  A detailed <strong className="text-emerald-400">receipt email</strong> with appointment details will be sent to your registered email address automatically.
                </p>
              </div>

              {/* Payment summary */}
              <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="text-white font-bold">₹{APPOINTMENT_FEE}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Doctor</span>
                  <span className="text-white">Dr. {doctorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Slot</span>
                  <span className="text-emerald-400 text-xs">{slotFormatted}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("payment")}
                  disabled={isLoading}
                  className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleSubmitPayment}
                  disabled={isLoading || !transactionId.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm & Book Appointment"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
