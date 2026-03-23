"use client";

import { useAccount } from "wagmi";
import { VaultPortfolio } from "./vault-portfolio";
import { VaultActions } from "./vault-actions";
import { VaultPositions } from "./vault-positions";
import { Lock } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function VaultContent() {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                textAlign: "center",
                padding: "24px",
                background: "rgba(16, 26, 20, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(124, 184, 124, 0.08)",
                borderRadius: "16px",
                maxWidth: "600px",
                margin: "40px auto"
            }}>
                <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(124, 184, 124, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px"
                }}>
                    <Lock size={32} color="var(--primary, #7cb87c)" />
                </div>
                <h2 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "28px",
                    fontWeight: "600",
                    color: "var(--foreground, #e8ede9)",
                    marginBottom: "16px"
                }}>
                    Vault Locked
                </h2>
                <p style={{
                    color: "rgba(138, 155, 142, 0.7)",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    marginBottom: "32px",
                    maxWidth: "400px"
                }}>
                    Please connect your wallet to view your portfolio, manage deposits, and monitor AI-driven dispute yields.
                </p>
                <ConnectButton />
            </div>
        );
    }

    return (
        <>
            <VaultPortfolio />
            <VaultActions />
            <VaultPositions />
        </>
    );
}
