"use client";

import { useState } from "react";
import {
  Lightbulb,
  Brain,
  Target,
  Leaf,
  CreditCard,
  BarChart3,
  FileCheck,
} from "lucide-react";
import RequestAccessModal from "@/components/RequestAccessModal";
import Footer from "@/components/Footer";

const LAYERS = [
  {
    icon: Lightbulb,
    label: "The Thesis",
    title: "Price is the unlock for every mature market",
    description:
      "Without reliable, verifiable pricing, markets cannot develop hedging, insurance, lending, or structured products. ClearMarket builds the pricing layer that enables everything else — starting from first principles.",
  },
  {
    icon: Brain,
    label: "Methodology",
    title: "Why Bayesian?",
    description:
      "Traditional pricing averages fail in fragmented markets. Bayesian inference lets us incorporate prior beliefs, weigh sources by reliability, and continuously update as new data arrives — producing prices that are predictive, explainable, and defensible.",
  },
  {
    icon: Target,
    label: "Strategy",
    title: "Oracle first, market second, settlement always",
    description:
      "We start with the hardest problem — creating trusted reference prices where none exist. Once pricing is established, trading follows naturally. Settlement rails lock in the value chain end-to-end.",
  },
  {
    icon: Leaf,
    label: "Proving Ground",
    title: "Why Cannabis?",
    description:
      "Cannabis is legal in 50+ countries but has no institutional pricing infrastructure. It is the most fragmented commodity on earth — if our oracle works here, it works everywhere. Each market we enter compounds the value of the ClearMarket stack.",
  },
];

const FROM_PRICE = [
  {
    icon: CreditCard,
    title: "Financing",
    items: [
      "Forward purchase",
      "Inventory finance",
      "Production funding",
      "Structured yield",
    ],
  },
  {
    icon: BarChart3,
    title: "Trading",
    items: [
      "Spot references",
      "Forwards",
      "Options",
      "Index-linked instruments",
    ],
  },
  {
    icon: FileCheck,
    title: "Settlement",
    items: [
      "Standardised clearing",
      "Faster settlement",
      "Reduced disputes",
      "Automated invoicing",
    ],
  },
];

export default function MarketsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
            The pricing layer for the next generation of commodities
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            From Bayesian oracles to institutional settlement — the full stack
            for markets that lack financial plumbing.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-10 px-6 py-3 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Request Access
          </button>
        </div>
      </section>

      {/* The ClearMarket Layers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            The ClearMarket Layers
          </h2>

          <div className="space-y-8">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.label}
                className={`flex flex-col md:flex-row gap-8 items-start ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <layer.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {layer.label}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {layer.title}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {layer.description}
                  </p>
                </div>
                <div className="flex-1 w-full h-48 rounded-xl bg-card border border-border flex items-center justify-center">
                  <layer.icon className="w-16 h-16 text-primary/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From Price to Markets */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            From Price to Markets
          </h2>
          <p className="text-muted text-lg mb-12 max-w-3xl">
            Reliable pricing unlocks the full financial stack — from financing
            through trading to settlement.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {FROM_PRICE.map((section) => (
              <div
                key={section.title}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <section.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <RequestAccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
