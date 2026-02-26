import Link from "next/link";
import { PROGRAM_ID, shortenAddress } from "@/lib/solana";

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Risk Notice", href: "/risk" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                ClearMarket Labs
              </span>
            </div>
            <p className="text-sm text-muted max-w-md">
              Tokenised crop markets for cannabis supply chains. Built for
              regulated reality.
            </p>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} ClearMarket Labs. All rights
              reserved. ClearMarket Labs is a prototype and does not provide
              regulated financial services.
            </p>
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-muted" viewBox="0 0 397.7 311.7" fill="currentColor">
                <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
              </svg>
              <span className="text-xs text-muted">Built on Solana</span>
            </div>
          </div>
          <p className="text-[10px] text-muted/60 font-mono">
            Program: {shortenAddress(PROGRAM_ID, 8)}
          </p>
        </div>
      </div>
    </footer>
  );
}
