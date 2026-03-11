"use client";

import { usePathname } from "next/navigation";

export default function ComplianceBanner() {
  const pathname = usePathname();

  // Trade pages use their own full-screen layout; banner breaks h-screen calc
  if (pathname?.startsWith("/trade")) return null;

  return (
    <div className="bg-red-600/90 text-white text-center text-xs py-1.5 px-4 font-medium">
      ClearMarket Labs is a prototype platform. This is not financial advice and
      does not constitute a regulated financial service.
    </div>
  );
}
