"use client";

import { usePathname } from "next/navigation";

export default function ComplianceBanner() {
  const pathname = usePathname();

  // Trade pages use their own full-screen layout; banner breaks h-screen calc
  if (pathname?.startsWith("/trade")) return null;

  return (
    <div className="bg-primary/10 text-primary text-center text-xs py-1.5 px-4 font-medium border-b border-primary/20">
      ClearMarket Labs operates in jurisdictions where cannabis investment is permitted. Not available in all regions.
    </div>
  );
}
