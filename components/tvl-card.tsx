"use client";

import { useEffect, useState } from "react";
import styles from "./tvl-card.module.css";

export function TVLCard() {
    const [value, setValue] = useState(0);

    useEffect(() => {
        async function fetchTVL() {
            try {
                const response = await fetch('/data/global-stats.json');
                const data = await response.json();
                setValue(data.tvl);
            } catch (error) {
                console.error("Error fetching TVL:", error);
            }
        }
        fetchTVL();
    }, []);

    return (
        <div className={styles.card}>
            <span className={styles.label}>Total Value Locked</span>
            <div className={styles.value}>
                ${value.toLocaleString()}
            </div>
            <span className={styles.sub}>USDC in vault</span>
        </div>
    );
}
