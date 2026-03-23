"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { TVLCard } from "./tvl-card";
import Link from "next/link";
import styles from "./vault-dashboard.module.css";

function AnimatedStat({
    value,
    suffix,
    label,
    delay = 0,
}: {
    value: number;
    suffix: string;
    label: string;
    delay?: number;
}) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const duration = 1800;
            const steps = 50;
            const increment = value / steps;
            let acc = 0;
            const timer = setInterval(() => {
                acc += increment;
                if (acc >= value) {
                    setCurrent(value);
                    clearInterval(timer);
                } else {
                    setCurrent(Math.floor(acc));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return (
        <div className={styles.stat}>
            <span className={styles.statValue}>
                {current.toLocaleString()}
                <span className={styles.statSuffix}>{suffix}</span>
            </span>
            <span className={styles.statLabel}>{label}</span>
        </div>
    );
}

export function VaultDashboard() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {/* Stats Row */}
                    <div className={styles.statsRow}>
                        <AnimatedStat
                            value={0}
                            suffix="% APR"
                            label="Base Yield"
                            delay={200}
                        />
                        <div className={styles.divider} />
                        <AnimatedStat
                            value={0}
                            suffix="% APY"
                            label="Compounded"
                            delay={500}
                        />
                        <div className={styles.divider} />
                        <TVLCard />
                    </div>

                    {/* Strategy Info */}
                    <div className={styles.strategy}>
                        <div className={styles.strategyItem}>
                            <span className={styles.strategyDot} />
                            <span className={styles.strategyText}>
                                Delta-neutral • 2-day cycles • AI-managed
                            </span>
                        </div>
                        <div className={styles.strategyItem}>
                            <span className={styles.strategyDotGold} />
                            <span className={styles.strategyText}>
                                0.3% management fee • 10% stop-loss protection
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className={styles.cta}>
                        <Link
                            href="/vault"
                            className={styles.ctaButton}
                        >
                            <span>Open Vault</span>
                            <ArrowRight size={18} />
                        </Link>
                        <p className={styles.ctaSub}>
                            Deposit USDC to start earning yield
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
