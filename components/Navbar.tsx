"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import RequestAccessModal from "./RequestAccessModal";

const NAV_LINKS = [
  { label: "Platform", href: "/" },
  { label: "Markets", href: "/markets" },
  { label: "Developers", href: "/developers", disabled: true },
  { label: "Team", href: "/team" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on trade pages (they use their own layout)
  const isTradePage = pathname?.startsWith("/trade");
  if (isTradePage) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            ClearMarket Labs
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.disabled ? (
              <span
                key={link.href}
                className="text-sm text-muted/50 cursor-not-allowed"
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            Request Access
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl p-6 flex flex-col gap-6">
          {NAV_LINKS.map((link) =>
            link.disabled ? (
              <span
                key={link.href}
                className="text-lg text-muted/50 cursor-not-allowed"
              >
                {link.label}
              </span>
            ) : (
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
            )
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setModalOpen(true);
            }}
            className="text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-background w-fit"
          >
            Request Access
          </button>
        </div>
      )}

      <RequestAccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
