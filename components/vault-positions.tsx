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

const MOCK_POSITIONS: Position[] = [
    {
        id: "1",
        market: "Will the Fed cut rates in March 2026?",
        entryPrice: "$0.970",
        currentValue: "$0.970",
        expectedReturn: "+3.09%",
        status: "active",
        timeRemaining: "1d 14h",
        progress: 30,
    },
    {
        id: "2",
        market: "Will Bitcoin hit $150K by Q1 2026?",
        entryPrice: "$0.970",
        currentValue: "$0.985",
        expectedReturn: "+3.09%",
        status: "resolving",
        timeRemaining: "6h 22m",
        progress: 75,
    },
    {
        id: "3",
        market: "Will SpaceX Starship reach orbit?",
        entryPrice: "$0.970",
        currentValue: "$1.000",
        expectedReturn: "+3.09%",
        status: "resolved",
        timeRemaining: "Complete",
        progress: 100,
    },
    {
        id: "4",
        market: "Oscar Best Picture: 'The Brutalist'?",
        entryPrice: "$0.970",
        currentValue: "$0.970",
        expectedReturn: "+3.09%",
        status: "active",
        timeRemaining: "1d 22h",
        progress: 15,
    },
    {
        id: "5",
        market: "NBA Finals: Will Celtics repeat?",
        entryPrice: "$0.970",
        currentValue: "$0.975",
        expectedReturn: "+3.09%",
        status: "active",
        timeRemaining: "1d 8h",
        progress: 40,
    },
];

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
                        {MOCK_POSITIONS.map((pos) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
