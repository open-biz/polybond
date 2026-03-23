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
        question: "Will the Fed cut rates in March 2026?",
        lockInPrice: "$0.97",
        status: "bonding",
        timeAgo: "2m ago",
    },
    {
        id: "2",
        question: "Will Bitcoin hit $150K by Q1 2026?",
        lockInPrice: "$0.97",
        status: "bonding",
        timeAgo: "8m ago",
    },
    {
        id: "3",
        question: "Will SpaceX Starship reach orbit?",
        lockInPrice: "$0.97",
        status: "resolved",
        timeAgo: "1h ago",
    },
    {
        id: "4",
        question: "Will the EU pass the Digital Markets Act amendment?",
        lockInPrice: "$0.97",
        status: "monitoring",
        timeAgo: "12m ago",
    },
    {
        id: "5",
        question: "Oscar Best Picture: 'The Brutalist'?",
        lockInPrice: "$0.97",
        status: "bonding",
        timeAgo: "25m ago",
    },
    {
        id: "6",
        question: "Will Ethereum merge to PoS by June?",
        lockInPrice: "$0.97",
        status: "resolved",
        timeAgo: "3h ago",
    },
    {
        id: "7",
        question: "NBA Finals: Will Celtics repeat?",
        lockInPrice: "$0.97",
        status: "bonding",
        timeAgo: "5m ago",
    },
    {
        id: "8",
        question: "Will OpenAI release GPT-5 in Q1?",
        lockInPrice: "$0.97",
        status: "monitoring",
        timeAgo: "45m ago",
    },
];

const STATUS_CONFIG = {
    bonding: { label: "Bonding", className: styles.statusBonding },
    resolved: { label: "Resolved", className: styles.statusResolved },
    monitoring: { label: "Monitoring", className: styles.statusMonitoring },
};

export function DisputedMarkets() {
    const [markets] = useState(MOCK_MARKETS);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= markets.length) return prev;
                return prev + 1;
            });
        }, 300);
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
                    {markets.slice(0, visibleCount).map((market, idx) => {
                        const config = STATUS_CONFIG[market.status];
                        return (
                            <div
                                key={market.id}
                                className={styles.item}
                                style={{ animationDelay: `${idx * 0.1}s` }}
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
                    })}
                </div>
            </div>
        </section>
    );
}
