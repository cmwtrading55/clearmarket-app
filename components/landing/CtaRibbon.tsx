"use client";

import { useState } from "react";
import RequestAccessModal from "../RequestAccessModal";

interface Props {
  heading: string;
  buttonText: string;
}

export default function CtaRibbon({ heading, buttonText }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          {heading}
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-8 py-3 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {buttonText}
        </button>
      </div>
      <RequestAccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
