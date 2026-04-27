"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, MessageSquare, CheckCircle2, QrCode } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function QRPaymentModal({ isOpen, onClose, plan }) {
  if (!plan) return null;

  const upiId = "8115462049-2@ibl";
  const upiUrl = `upi://pay?pa=${upiId}&am=${plan.price}&tn=Payment_for_${plan.name}_Plan&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("UPI ID copied to clipboard!");
  };

  const openWhatsApp = () => {
    const message = `Hi, I just paid ₹${plan.price} for the ${plan.name} plan on MediMeet. Here is the screenshot of my payment. Please add ${plan.credits} credits to my account.`;
    window.open(`https://wa.me/918115462049?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-emerald-900/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Complete Payment
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Scan the QR code below to pay for the <span className="text-emerald-400 font-bold">{plan.name}</span> plan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* QR Code Placeholder/Generator */}
          <div className="p-4 bg-white rounded-xl shadow-2xl shadow-emerald-500/20">
            <img 
              src={qrCodeUrl} 
              alt="Payment QR Code" 
              width={250} 
              height={250} 
              className="rounded-lg"
            />
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-900/10 border border-emerald-900/20">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">UPI ID</span>
                <span className="text-white font-medium">{upiId}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(upiId)}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-900/10 border border-emerald-900/20">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Amount to Pay</span>
                <span className="text-2xl font-bold text-white">₹{plan.price}</span>
              </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>

          <div className="w-full space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              After payment, please send the screenshot to our support on WhatsApp to get your credits instantly.
            </p>
            <Button 
              onClick={openWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Send Screenshot on WhatsApp
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full border-emerald-900/30 text-muted-foreground hover:bg-emerald-900/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
