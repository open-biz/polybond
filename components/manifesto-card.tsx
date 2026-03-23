import styles from "./manifesto-card.module.css";

export function ManifestoCard() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                {/* Torn paper edges */}
                <div className={styles.tornTop} />
                <div className={styles.tornBottom} />

                <div className={styles.content}>
                    <span className={styles.label}>The Thesis</span>
                    <h2 className={styles.title}>
                        Spite disputes are a tax on truth.
                    </h2>
                    <p className={styles.body}>
                        When a prediction market resolves, losing traders can dispute the outcome
                        — not because they&apos;re right, but to delay paying out winners. Capital gets
                        locked for days. Winners wait. Trolls win.
                    </p>
                    <div className={styles.divider} />
                    <p className={styles.body}>
                        PolyBond fixes this. Our AI agent scans disputed markets, verifies ground truth,
                        and offers winners an immediate exit at <strong>98.4¢ on the dollar</strong>. When
                        the dispute resolves 2 days later, the vault collects the full $1.00.
                    </p>
                    <p className={styles.highlight}>
                        You provide the capital. We provide the yield.
                        <br />
                        <strong>297% APR</strong> — delta-neutral, AI-managed, fully automated.
                    </p>
                </div>
            </div>
        </div>
    );
}
