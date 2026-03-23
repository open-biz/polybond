"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { AI_AGENT_ADDRESS, USDC_ADDRESS } from "@/config/contracts";
import { ERC20_ABI } from "@/config/abi";
import { useSafe } from "./safe-context";
import styles from "./vault-portfolio.module.css";

interface StatCardProps {
    label: string;
    value: string;
    subValue?: string;
    accent?: boolean;
}

function StatCard({ label, value, subValue, accent }: StatCardProps) {
    return (
        <div className={`${styles.card} ${accent ? styles.cardAccent : ""}`}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
            {subValue && <span className={styles.subValue}>{subValue}</span>}
        </div>
    );
}

export function VaultPortfolio() {
    const { address } = useAccount();
    const { safeAddress } = useSafe();
    const [balance, setBalance] = useState(0);

    const { data: balanceData } = useReadContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [(safeAddress || address) as `0x${string}`],
        query: {
            enabled: !!(safeAddress || address),
            refetchInterval: 10000,
        }
    });

    useEffect(() => {
        if (balanceData !== undefined) {
            setBalance(Number(formatUnits(balanceData as bigint, 6)));
        } else {
            setBalance(0);
        }
    }, [balanceData]);

    const yieldEarned = 0;
    const apr = 0;
    const daysActive = 0;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h2 className={styles.title}>Your Portfolio</h2>
                    <div className={styles.walletBadge} style={{ background: 'rgba(0, 82, 255, 0.1)', color: '#0052FF' }}>
                        <span className={styles.walletDot} style={{ background: '#0052FF' }} />
                        <span>Owner: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}</span>
                    </div>
                </div>
                <div className={styles.walletBadge}>
                    <span className={styles.walletDot} />
                    <span>AI Strategist: {AI_AGENT_ADDRESS.slice(0, 6)}...{AI_AGENT_ADDRESS.slice(-4)}</span>
                </div>
            </div>
            <div className={styles.grid}>
                <StatCard
                    label="Vault Balance"
                    value={`$${balance.toLocaleString()}`}
                    subValue="USDC deposited"
                    accent
                />
                <StatCard
                    label="Yield Earned"
                    value={`$${yieldEarned.toLocaleString()}`}
                    subValue="Lifetime returns"
                />
                <StatCard
                    label="Current APR"
                    value={`${apr}%`}
                    subValue="Annualized"
                />
                <StatCard
                    label="Days Active"
                    value={`${daysActive}`}
                    subValue="Since first deposit"
                />
            </div>
        </section>
    );
}
