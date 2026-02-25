"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import ConnectWalletModal from "./ConnectWalletModal";
import ProfileDropdown from "./ProfileDropdown";

const NAV_LINKS = [
  { label: "Explore", href: "/" },
  { label: "Growers", href: "/growers" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Exchange", href: "/trade/CML-USDC" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { connected, disconnect } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on trade pages (they use their own layout)
  const isTradePage = pathname?.startsWith("/trade");
  if (isTradePage) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            ClearMarket Labs
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href ||
                (link.href === "/" && pathname === "/")
                  ? "text-foreground font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: wallet + mobile toggle */}
        <div className="flex items-center gap-3">
          {connected ? (
            <ProfileDropdown onDisconnect={disconnect} />
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="hidden sm:flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-foreground"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl p-6 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg ${
                pathname === link.href
                  ? "text-foreground font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!connected && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setWalletModalOpen(true);
              }}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-background w-fit"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          )}
        </div>
      )}

      <ConnectWalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
}
