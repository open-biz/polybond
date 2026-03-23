"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import Safe from "@safe-global/protocol-kit";
import { useSafe } from "./safe-context";
import { PlusCircle, ShieldCheck } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function SafeWalletConnector() {
  const { address, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { safeAddress, setSafeAddress } = useSafe();
  const [isDeploying, setIsDeploying] = useState(false);

  const deploySafe = async () => {
    if (!address || !connector || !walletClient) return;

    try {
      setIsDeploying(true);

      const safeAccountConfig = {
        owners: [address],
        threshold: 1,
      };

      const predictedSafe = {
        safeAccountConfig,
      };

      const provider = await connector.getProvider();

      const protocolKit = await Safe.init({
        provider: provider as any,
        signer: address,
        predictedSafe,
      });

      const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();

      const txHash = await walletClient.sendTransaction({
        to: deploymentTransaction.to as `0x${string}`,
        value: BigInt(deploymentTransaction.value),
        data: deploymentTransaction.data as `0x${string}`,
      });

      console.log("Safe deployment transaction sent:", txHash);

      const deployedAddress = await protocolKit.getAddress();
      setSafeAddress(deployedAddress);
    } catch (error) {
      console.error("Error deploying safe:", error);
      alert("Failed to deploy Safe. See console for details.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {/* 1. If connected, show Safe logic */}
      {isConnected && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "8px" }}>
          {!safeAddress ? (
            <button
              onClick={deploySafe}
              disabled={isDeploying || !walletClient}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "var(--primary, #7cb87c)",
                color: "#101a14",
                border: "none",
                cursor: isDeploying || !walletClient ? "wait" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <PlusCircle size={16} />
              {isDeploying ? "Deploying..." : "Setup Safe"}
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(124, 184, 124, 0.1)",
                border: "1px solid rgba(124, 184, 124, 0.2)",
                color: "var(--primary, #7cb87c)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              <ShieldCheck size={16} />
              Safe: {safeAddress.slice(0, 6)}...{safeAddress.slice(-4)}
            </div>
          )}
        </div>
      )}

      {/* 2. RainbowKit Connect Button */}
      <ConnectButton />
    </div>
  );
}