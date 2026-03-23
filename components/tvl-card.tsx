"use client";

import { useEffect, useState } from "react";
import styles from "./tvl-card.module.css";

export function TVLCard() {
    const [value, setValue] = useState(0);
    const target = 142_850;

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setValue(target);
                clearInterval(timer);
            } else {
                setValue(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
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
