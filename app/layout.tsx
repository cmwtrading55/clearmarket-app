import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ComplianceBanner from "@/components/ComplianceBanner";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ClearMarket Labs",
  description:
    "Tokenised crop markets for cannabis supply chains — bonding curves, settlement rails, and grower infrastructure by ClearMarket Labs",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ComplianceBanner />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
