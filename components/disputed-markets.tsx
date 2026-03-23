"use client";

import { useEffect, useState } from "react";
import styles from "./disputed-markets.module.css";

interface DisputedMarket {
    id: string;
    question: string;
    lockInPrice: string;
    status: "bonding" | "resolved" | "monitoring";
    timeAgo: string;
}

const MOCK_MARKETS: DisputedMarket[] = [
    {
        id: "1",
        status: "bonding",
        question: "Will ETH hit $4,000 by March 31?",
        lockInPrice: "$0.97",
        timeAgo: "2m ago",
    },
    {
        id: "2",
        status: "monitoring",
        question: "Will the Fed cut rates in March?",
        lockInPrice: "$0.98",
        timeAgo: "15m ago",
    },
    {
        id: "3",
        status: "resolved",
        question: "Will SpaceX launch Starship in Q1?",
        lockInPrice: "$1.00",
        timeAgo: "1h ago",
    },
    {
        id: "4",
        status: "bonding",
        question: "Will Bitcoin ETF net inflows exceed $2B this week?",
        lockInPrice: "$0.96",
        timeAgo: "2h ago",
    },
    {
        id: "5",
        status: "monitoring",
        question: "Will GPT-5 be announced by June?",
        lockInPrice: "$0.99",
        timeAgo: "4h ago",
    }
];

const STATUS_CONFIG = {
    bonding: { label: "Bonding", className: styles.statusBonding },
    resolved: { label: "Resolved", className: styles.statusResolved },
    monitoring: { label: "Monitoring", className: styles.statusMonitoring },
};

export function DisputedMarkets() {
    const [visibleMarkets, setVisibleMarkets] = useState<DisputedMarket[]>([]);

    // Simulate the agent "pulling" data over time via the MoonPay CLI
    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < MOCK_MARKETS.length) {
                setVisibleMarkets(prev => [...prev, MOCK_MARKETS[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 800); // Add a new market every 800ms for a "live feed" effect

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.label}>Live Agent Feed (via MoonPay CLI)</span>
                        <h3 className={styles.title}>Currently Disputed Markets</h3>
                    </div>
                    <div className={styles.liveIndicator}>
                        <span className={styles.liveDot} />
                        <span className={styles.liveText}>Live</span>
                    </div>
                </div>

                <div className={styles.list}>
                    {visibleMarkets.length > 0 ? visibleMarkets.map((market, idx) => {
                        const config = STATUS_CONFIG[market.status];
                        return (
                            <div
                                key={market.id}
                                className={styles.item}
                                style={{ animation: "fadeIn 0.5s ease-out forwards" }}
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
                            </div>
                        );
                    }) : (
                        <div style={{ textAlign: "center", padding: "48px 24px", color: "rgba(138, 155, 142, 0.5)" }}>
                            [AGENT] Initializing MoonPay CLI... Scanning Polymarket order books for active UMA disputes...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
