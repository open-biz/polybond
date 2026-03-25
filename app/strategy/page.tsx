"use client";

import Link from "next/link";
import { DotMatrixBackground } from "@/components/dot-matrix-background";
import { BentoFeatures } from "@/components/bento-features";
import { DisputedMarkets } from "@/components/disputed-markets";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Lock, TrendingUp, Cpu, Network, Zap } from "lucide-react";
import styles from "./strategy.module.css";

export default function StrategyPage() {
    return (
        <main className={styles.main}>
            <DotMatrixBackground />

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.logo}>
                        <svg
                            viewBox="0 0 24 24"
                            className={styles.logoIcon}
                            fill="currentColor"
                        >
                            <path d="M12 2L8 6H4v4l-4 4 4 4v4h4l4 4 4-4h4v-4l4-4-4-4V6h-4L12 2zm0 4a6 6 0 110 12 6 6 0 010-12z" />
                        </svg>
                        <span className={styles.logoText}>PolyBond</span>
                    </Link>

                    <nav className={styles.nav}>
                        <Link href="/" className={styles.navLink}>Home</Link>
                        <Link href="/vault" className={styles.navLink}>Vault</Link>
                        <Link href="/strategy" className={styles.navLinkActive}>Strategy</Link>
                        <Link href="/disputes" className={styles.navLink}>Disputes</Link>
                    </nav>

                    <div className={styles.headerRight}>
                        <ConnectButton showBalance={false} />
                    </div>
                </div>
            </header>

            <header className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.badge}>Agent Strategy</div>
                    <h1 className={styles.title}>How PolyBond Generates Yield</h1>
                    <p className={styles.subtitle}>
                        Our autonomous AI agent harvests delta-neutral returns by identifying and resolving frivolous "spite disputes" on Polymarket.
                    </p>
                </div>
            </header>

            {/* Strategy Deep Dive */}
            <section className={styles.deepDive}>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><Cpu /></div>
                        <h3>Cognitive Analysis</h3>
                        <p>The agent uses NVIDIA's Qwen 3.5 122b model to analyze UMA "Ancillary Data". It identifies markets where the truth is obvious but the price is lagging due to a challenge.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><Network /></div>
                        <h3>Market Diversification</h3>
                        <p>Instead of betting on a single outcome, the vault spreads USDC across multiple disputes. This minimizes "Black Swan" oracle risks and stabilizes the yield curve.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}><Zap /></div>
                        <h3>The Arb Opportunity</h3>
                        <p>When a market is disputed, "Yes" shares often trade at a discount (e.g. 97¢). PolyBond buys these shares, capturing a near-guaranteed 3% gain upon UMA resolution.</p>
                    </div>
                </div>
            </section>

            {/* Features Section (Moved from Home) */}
            <BentoFeatures />

            {/* Risk Management (Moved from Home) */}
            <section id="risk-management" className={styles.riskSection}>
                <div className={styles.riskContainer}>
                    <span className={styles.label}>Safety First</span>
                    <h2 className={styles.sectionTitle}>Risk Management</h2>
                    <div className={styles.riskGrid}>
                        <div className={styles.riskCard}>
                            <div className={styles.riskIconWrap}>
                                <Shield className={styles.riskIcon} />
                            </div>
                            <div className={styles.riskValue}>AI</div>
                            <div className={styles.riskLabel}>Confidence Threshold</div>
                            <p className={styles.riskDesc}>
                                Only enters positions when AI confidence exceeds 95% based on cross-referenced data.
                            </p>
                        </div>
                        <div className={styles.riskCard}>
                            <div className={styles.riskIconWrap}>
                                <Lock className={styles.riskIcon} />
                            </div>
                            <div className={styles.riskValue}>10%</div>
                            <div className={styles.riskLabel}>Stop Loss</div>
                            <p className={styles.riskDesc}>
                                Automated system instantly exits if UMA's proposed outcome shifts unexpectedly.
                            </p>
                        </div>
                        <div className={styles.riskCard}>
                            <div className={styles.riskIconWrap}>
                                <TrendingUp className={styles.riskIcon} />
                            </div>
                            <div className={styles.riskValue}>3%</div>
                            <div className={styles.riskLabel}>Conservative Failure Rate</div>
                            <p className={styles.riskDesc}>
                                Built-in yield assumptions account for potential disputes that resolve as "Invalid".
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Agent Feed Teaser (Moved from Home) */}
            <section className={styles.feedTeaser}>
                <div className={styles.teaserContent}>
                    <span className={styles.label}>Live Execution</span>
                    <h2 className={styles.sectionTitle}>Live Agent Activity</h2>
                    <p className={styles.teaserDesc}>
                        Monitor the AI agent's real-time analysis and bonding activity across active disputes.
                    </p>
                    <Link href="/disputes" className={styles.secondaryAction}>View Full Disputes Feed</Link>
                </div>
                <DisputedMarkets />
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Start harvesting alpha</h2>
                <p className={styles.ctaSub}>
                    Join the PolyBond vault and let our autonomous agent manage your prediction market arbitrage.
                </p>
                <Link href="/vault" className={styles.primaryAction}>Open Vault</Link>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerLogo}>
                        <svg
                            viewBox="0 0 24 24"
                            className={styles.footerLogoIcon}
                            fill="currentColor"
                        >
                            <path d="M12 2L8 6H4v4l-4 4 4 4v4h4l4 4 4-4h4v-4l4-4-4-4V6h-4L12 2zm0 4a6 6 0 110 12 6 6 0 010-12z" />
                        </svg>
                        <span>PolyBond</span>
                    </div>
                    <p className={styles.footerText}>
                        2026 PolyBond. Built for the autonomous future.
                    </p>
                </div>
            </footer>
        </main>
    );
}
