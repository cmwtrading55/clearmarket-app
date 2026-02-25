"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import Footer from "@/components/Footer";
import { Wallet, CheckCircle, Circle, Upload, User, FileText, Shield } from "lucide-react";

const STEPS = [
  { id: 1, label: "Personal Info", icon: User, description: "Name, date of birth, nationality" },
  { id: 2, label: "Document Upload", icon: FileText, description: "Government-issued ID (passport or driving licence)" },
  { id: 3, label: "Selfie Verification", icon: Upload, description: "Take a selfie matching your document photo" },
  { id: 4, label: "Review", icon: Shield, description: "We'll review your submission within 24 hours" },
];

export default function VerificationPage() {
  const { connected } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);

  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Verification</h2>
          <p className="text-sm text-muted max-w-sm">
            Connect your wallet to begin identity verification.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Identity Verification</h1>
          <p className="text-sm text-muted mt-1">
            Complete KYC to unlock full platform access
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isFuture = step.id > currentStep;

            return (
              <div
                key={step.id}
                className={`bg-card-bg border rounded-xl p-5 transition-colors ${
                  isCurrent
                    ? "border-primary/50"
                    : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 ${isComplete ? "text-primary" : isCurrent ? "text-primary" : "text-muted/30"}`}>
                    {isComplete ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isFuture ? "text-muted/30" : "text-primary"} />
                      <h3 className={`text-sm font-medium ${isFuture ? "text-muted/50" : "text-foreground"}`}>
                        Step {step.id}: {step.label}
                      </h3>
                    </div>
                    <p className={`text-xs mt-1 ${isFuture ? "text-muted/30" : "text-muted"}`}>
                      {step.description}
                    </p>

                    {isCurrent && (
                      <button
                        onClick={() => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length + 1))}
                        className="mt-3 text-xs font-medium px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
                      >
                        {step.id === STEPS.length ? "Submit for Review" : "Continue"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {currentStep > STEPS.length && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
            <CheckCircle size={32} className="text-primary mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">Verification Submitted</h3>
            <p className="text-xs text-muted mt-1">
              Your documents are being reviewed. This typically takes 24 hours.
              This is a mock verification flow — no real documents are processed.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
