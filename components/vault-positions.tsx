"use client";

import styles from "./vault-positions.module.css";

interface Position {
    id: string;
    market: string;
    entryPrice: string;
    currentValue: string;
    expectedReturn: string;
    status: "active" | "resolving" | "resolved";
    timeRemaining: string;
    progress: number;
}

const MOCK_POSITIONS: Position[] = [];

const STATUS_LABELS: Record<string, string> = {
    active: "Active",
    resolving: "Resolving",
    resolved: "Resolved",
};

export function VaultPositions() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Active Positions</h2>
                <span className={styles.count}>{MOCK_POSITIONS.length} bonds</span>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Market</th>
                            <th>Entry</th>
                            <th>Current</th>
                            <th>Return</th>
                            <th>Status</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_POSITIONS.length > 0 ? MOCK_POSITIONS.map((pos) => (
                            <tr key={pos.id} className={styles.row}>
                                <td className={styles.marketCell}>{pos.market}</td>
                                <td className={styles.mono}>{pos.entryPrice}</td>
                                <td className={styles.mono}>{pos.currentValue}</td>
                                <td className={styles.returnCell}>{pos.expectedReturn}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[`status_${pos.status}`]}`}>
                                        {STATUS_LABELS[pos.status]}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.progressWrap}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${pos.progress}%` }}
                                            />
                                        </div>
                                        <span className={styles.timeRemaining}>{pos.timeRemaining}</span>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "rgba(138, 155, 142, 0.5)" }}>
                                    No active positions yet. Deposit USDC to start earning yield.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
