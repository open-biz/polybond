import styles from "./how-it-works.module.css";

export function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "AI Scans Disputes",
            description:
                "Our agent continuously monitors Polymarket for disputed outcomes. It identifies spite disputes — cases where the market clearly resolved correctly but a losing trader is delaying the payout.",
            icon: "🔍",
        },
        {
            number: "02",
            title: "Buy at 97¢",
            description:
                "The vault purchases winning shares from frustrated traders at a 3% discount. Winners get instant liquidity instead of waiting 2–4 days for UMA to resolve the dispute.",
            icon: "💰",
        },
        {
            number: "03",
            title: "Collect $1.00",
            description:
                "When the dispute naturally resolves (as expected), the vault redeems each share for its full $1.00 value. The 3¢ spread is pure profit — annualizing to 492% APR.",
            icon: "✨",
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <span className={styles.label}>How It Works</span>
                <h2 className={styles.title}>Three steps to yield</h2>

                <div className={styles.grid}>
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className={styles.step}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className={styles.stepHeader}>
                                <span className={styles.icon}>{step.icon}</span>
                                <span className={styles.number}>{step.number}</span>
                            </div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className={styles.connector}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 4v16m0 0l-6-6m6 6l6-6"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
