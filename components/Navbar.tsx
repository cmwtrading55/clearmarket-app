"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf, Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import ConnectWalletModal from "./ConnectWalletModal";
import ProfileDropdown from "./ProfileDropdown";

const NAV_LINKS = [
  { label: "Fund", href: "/" },
  { label: "Growers", href: "/growers" },
  { label: "Launchpad", href: "/launchpad" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { connected, disconnect } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between h-20 px-8 bg-background/60 backdrop-blur-2xl border-b border-white/5">
        {/* Logo - Agri-DeFi Style */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]">
            <Leaf className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-foreground leading-none">
              CLEARMARKET
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-primary leading-none mt-1">
              LABS
            </span>
          </div>
        </Link>

        {/* Desktop links - Minimalist Terminal Style */}
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                pathname === link.href ||
                (link.href === "/" && pathname === "/")
                  ? "text-primary"
                  : "text-muted hover:text-foreground hover:tracking-[0.3em]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: wallet + mobile toggle */}
        <div className="flex items-center gap-4">
          {connected ? (
            <ProfileDropdown onDisconnect={disconnect} />
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest font-black px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] active:scale-95"
            >
              <Wallet size={14} />
              Connect Wallet
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay - High-end Glassmorphism */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40 bg-background/95 backdrop-blur-3xl p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-black tracking-tight ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pb-12">
            {!connected && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWalletModalOpen(true);
                }}
                className="flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest px-8 py-4 rounded-2xl bg-primary text-white w-full shadow-[0_0_30px_rgba(124,58,237,0.4)]"
              >
                <Wallet size={18} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}

      <ConnectWalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
}
