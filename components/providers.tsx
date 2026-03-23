"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { base } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { SafeProvider } from "./safe-context";

const config = getDefaultConfig({
  appName: "PolyBond",
  projectId: "21fef48091f12692cad574a6f7753643", // Valid project ID required for WalletConnect QR code scanning
  chains: [base],
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#7cb87c',
          accentColorForeground: '#101a14',
          borderRadius: 'small',
        })}>
          <SafeProvider>
            {children}
          </SafeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
