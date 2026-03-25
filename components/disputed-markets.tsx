"use client";

import { useEffect, useState } from "react";
import styles from "./disputed-markets.module.css";

interface DisputedMarket {
    id: string;
    slug?: string;
    question: string;
    lockInPrice: string;
    status: "bonding" | "resolved" | "monitoring" | "disputed";
    timeAgo: string;
}

const STATUS_CONFIG = {
    bonding: { label: "Bonding", className: styles.statusBonding },
    resolved: { label: "Resolved", className: styles.statusResolved },
    monitoring: { label: "Monitoring", className: styles.statusMonitoring },
    disputed: { label: "Disputed", className: styles.statusDisputed },
};

export function DisputedMarkets() {
    const [markets, setMarkets] = useState<DisputedMarket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        async function fetchDisputes() {
            try {
                const response = await fetch('/data/disputes.json');
                const data = await response.json();
                setMarkets(data);
            } catch (error) {
                console.error("Error fetching disputes:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDisputes();
    }, []);

    useEffect(() => {
        if (markets.length === 0) return;
        const timer = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= markets.length) return prev;
                return prev + 1;
            });
        }, 800);
        return () => clearInterval(timer);
    }, [markets.length]);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.label}>Live Agent Feed</span>
                        <h3 className={styles.title}>Currently Disputed Markets</h3>
                    </div>
                    <div className={styles.liveIndicator}>
                        <span className={styles.liveDot} />
                        <span className={styles.liveText}>Live</span>
                    </div>
                </div>

                <div className={styles.list}>
                    {isLoading || (markets.length > 0 && visibleCount === 0) ? (
                        <div style={{ textAlign: "center", padding: "48px 24px", color: "rgba(138, 155, 142, 0.5)" }}>
                            [AGENT] Initializing MoonPay CLI... Scanning Polymarket order books for active UMA disputes...
                        </div>
                    ) : markets.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 24px", color: "rgba(138, 155, 142, 0.5)" }}>
                            [AGENT] No active UMA disputes found. Monitoring order books...
                        </div>
                    ) : (
                        markets.slice(0, visibleCount).map((market, idx) => {
                            const config = STATUS_CONFIG[market.status] || { label: market.status, className: styles.statusMonitoring };
                            const isMonitoring = market.status === "monitoring";
                            
                            return (
                                <a
                                    key={market.id + idx}
                                    href={isMonitoring ? undefined : `https://polymarket.com/event/${market.slug || market.id}`}
                                    target={isMonitoring ? undefined : "_blank"}
                                    rel={isMonitoring ? undefined : "noopener noreferrer"}
                                    className={styles.item}
                                    style={{ 
                                        animation: "fadeIn 0.5s ease-out forwards", 
                                        textDecoration: 'none',
                                        cursor: isMonitoring ? 'default' : 'pointer'
                                    }}
                                >
                                    <div className={styles.itemLeft}>
                                        <span className={`${styles.status} ${config.className}`}>
                                            {config.label}
                                        </span>
                                        <span className={styles.question}>{market.question}</span>
                                    </div>
                                    <div className={styles.itemRight}>
                                        <span className={styles.price}>{market.lockInPrice}</span>
                                        <span className={styles.time}>{market.timeAgo}</span>
                                    </div>
                                </a>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
