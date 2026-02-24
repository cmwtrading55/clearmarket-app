"use client";

import { useState } from "react";
import RequestAccessModal from "../RequestAccessModal";

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-sm font-medium text-primary tracking-wide uppercase mb-6">
          Pricing Oracles for the Real World
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
          Real-World Price Intelligence for Institutional Markets
        </h1>

        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          We create market architecture for converting real-world production into
          clean financial signals.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Request Access
          </button>
          <a
            href="#solution"
            className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-surface transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      <RequestAccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
