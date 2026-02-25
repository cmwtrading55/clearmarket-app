"use client";

import { useWallet } from "@/lib/wallet";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Wallet, User, Bell, Shield, Copy } from "lucide-react";
import { useState } from "react";

export default function AccountPage() {
  const { connected, address, provider } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
          <p className="text-sm text-muted max-w-sm">
            Connect your wallet to manage your account settings.
          </p>
        </div>
      </main>
    );
  }

  function copyAddress() {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Account</h1>

        {/* Profile */}
        <div className="bg-card-bg border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User size={16} className="text-primary" />
            Profile
          </div>
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Display Name</label>
              <input
                defaultValue="Anonymous Trader"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Email</label>
              <input
                placeholder="your@email.com"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-card-bg border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Wallet size={16} className="text-primary" />
            Wallet
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted capitalize">{provider}</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
            <button
              onClick={copyAddress}
              className="text-muted hover:text-foreground transition-colors shrink-0"
            >
              <Copy size={14} />
            </button>
            {copied && <span className="text-xs text-primary">Copied!</span>}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card-bg border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Bell size={16} className="text-primary" />
            Notifications
          </div>
          <div className="space-y-3">
            {["Batch status updates", "Settlement payouts", "New batch listings", "Price alerts"].map((label) => (
              <label key={label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-foreground">{label}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-primary" />
              </label>
            ))}
          </div>
        </div>

        {/* Verification link */}
        <div className="bg-card-bg border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Verification</span>
            </div>
            <Link
              href="/verification"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Start Verification
            </Link>
          </div>
          <p className="text-xs text-muted mt-2">
            Complete identity verification to unlock higher trading limits and grower access.
          </p>
        </div>

        <button className="w-full py-2.5 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>
      <Footer />
    </main>
  );
}
