"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RequestAccessModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !region) return;

    setSubmitting(true);
    try {
      await supabase.from("access_requests").insert({
        name,
        email,
        region,
        message: message || null,
        consent,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setName("");
        setEmail("");
        setRegion("");
        setMessage("");
        setConsent(false);
      }, 2000);
    } catch {
      // Silently handle — form still closes
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-xl bg-card border border-border p-0 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Request Access</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <p className="text-lg font-medium">Thank you</p>
            <p className="text-sm text-muted mt-1">
              We&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted block mb-1.5">
                Name <span className="text-sell">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1.5">
                Email <span className="text-sell">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1.5">
                Region <span className="text-sell">*</span>
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. United Kingdom, UAE, United States"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1.5">
                Additional Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Tell us about your interest..."
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <span className="text-xs text-muted">
                I agree to receive future communications from ClearMarket
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || !name || !email || !region}
              className="w-full py-2.5 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {submitting ? "Submitting..." : "Request Access"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
