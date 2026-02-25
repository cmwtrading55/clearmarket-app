import Link from "next/link";

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

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} ClearMarket Labs. All rights
            reserved. ClearMarket Labs is a prototype and does not provide
            regulated financial services.
          </p>
        </div>
      </div>
    </footer>
  );
}
