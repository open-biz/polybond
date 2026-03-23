import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PolyBond — The Yield Layer for Dispute Resolution",
  description:
    "AI-powered dispute factoring yielding up to 184% APR. Stake USDC in delta-neutral prediction market arbitrage. Powered by UMA & Polymarket on Base.",
  keywords: [
    "PolyBond",
    "yield",
    "dispute resolution",
    "Polymarket",
    "UMA",
    "DeFi",
    "prediction markets",
    "Base",
  ],
  openGraph: {
    title: "PolyBond — 184% APR Yield from Dispute Resolution",
    description:
      "AI dispute factoring on Polymarket. Delta-neutral yield, fully automated.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
