"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { AI_AGENT_ADDRESS, POLYBOND_STRATEGY_ADDRESS, CHAIN_ID } from "@/config/contracts";
import { POLYBOND_POOL_ABI } from "@/config/abi";
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
    const [balance, setBalance] = useState(0);
    const [stats, setStats] = useState({ yieldEarned: 0, apr: 492, daysActive: 0 });

    const { data: balanceData } = useReadContract({
        address: POLYBOND_STRATEGY_ADDRESS as `0x${string}`,
        abi: POLYBOND_POOL_ABI,
        functionName: "shares",
        args: [address as `0x${string}`],
        chainId: CHAIN_ID,
        query: {
            enabled: !!address,
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

    useEffect(() => {
        // Fetch Live Stats from AI Agent JSON
        Promise.all([
            fetch('/data/global-stats.json').then(r => r.json()).catch(() => ({})),
            fetch('/data/portfolio.json').then(r => r.json()).catch(() => ({}))
        ]).then(([globalData, portfolioData]) => {
            setStats(prev => ({
                apr: globalData.baseYield || prev.apr,
                yieldEarned: portfolioData.yieldEarned || 0,
                daysActive: portfolioData.daysActive || 0
            }));
        });
    }, []);

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
                    <span>AI Strategist (via Zodiac): {AI_AGENT_ADDRESS.slice(0, 6)}...{AI_AGENT_ADDRESS.slice(-4)}</span>
                </div>
            </div>
            <div className={styles.grid}>
                <StatCard
                    label="Vault Balance"
                    value={`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subValue="USDC equivalent (Live Shares)"
                    accent
                />
                <StatCard
                    label="Yield Earned"
                    value={`$${stats.yieldEarned.toLocaleString()}`}
                    subValue="Agent Lifetime Returns"
                />
                <StatCard
                    label="Current APR"
                    value={`${stats.apr}%`}
                    subValue="Live Agent Performance"
                />
                <StatCard
                    label="Days Active"
                    value={`${stats.daysActive}`}
                    subValue="Since first deposit"
                />
            </div>
        </section>
    );
}
