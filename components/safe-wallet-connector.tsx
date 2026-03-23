"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function SafeWalletConnector() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ConnectButton />
    </div>
  );
}
