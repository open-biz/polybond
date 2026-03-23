"use client";

import { useEffect, useState } from "react";
import styles from "./tvl-card.module.css";

export function TVLCard() {
    const [value, setValue] = useState(0);
    const target = 0;

    useEffect(() => {
        setValue(target);
    }, [target]);

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
