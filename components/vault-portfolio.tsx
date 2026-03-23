"use client";

import { useEffect, useState } from "react";
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
    const [balance, setBalance] = useState(0);
    const target = 25_000;
    const yieldEarned = 1842.50;
    const apr = 492;
    const daysActive = 14;

    useEffect(() => {
        const duration = 1500;
        const steps = 40;
        const inc = target / steps;
        let cur = 0;
        const t = setInterval(() => {
            cur += inc;
            if (cur >= target) {
                setBalance(target);
                clearInterval(t);
            } else {
                setBalance(Math.floor(cur));
            }
        }, duration / steps);
        return () => clearInterval(t);
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Your Portfolio</h2>
                <div className={styles.walletBadge}>
                    <span className={styles.walletDot} />
                    <span>0x6727...dd1c</span>
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
