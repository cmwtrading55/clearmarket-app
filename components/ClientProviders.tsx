"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const WalletProviderWrapper = dynamic(
  () => import("@/lib/WalletProviderWrapper"),
  { ssr: false },
);

export default function ClientProviders({
  children,
}: {
  children: ReactNode;
}) {
  return <WalletProviderWrapper>{children}</WalletProviderWrapper>;
}
