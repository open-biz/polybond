"use client";

import { useState, useEffect } from "react";
import { Search, Zap, Shield, BarChart3, Network } from "lucide-react";
import { BentoGrid, BentoCard } from "./bento-grid";
import { Marquee } from "./marquee";
import styles from "./bento-features.module.css";

function DotPatternBG() {
    return (
        <div className={styles.dotPattern}>
            {Array.from({ length: 120 }).map((_, i) => (
                <div
                    key={i}
                    className={styles.dot}
                    style={{
                        left: `${(i % 12) * 9}%`,
                        top: `${Math.floor(i / 12) * 10}%`,
                        animationDelay: `${(i * 0.05) % 2}s`,
                        opacity: 0.15 + Math.random() * 0.25,
                    }}
                />
            ))}
        </div>
    );
}

function YieldBeam() {
    return (
        <div className={styles.beamContainer}>
            <div className={styles.beamLine}>
                <div className={styles.beamPulse} />
            </div>
            <div className={styles.beamNodes}>
                <div className={styles.beamNode}>99¢</div>
                <div className={styles.beamNodeCenter}>AI</div>
                <div className={styles.beamNode}>$1.00</div>
            </div>
            <div className={styles.beamLine}>
                <div className={styles.beamPulse} style={{ animationDelay: "0.5s" }} />
            </div>
        </div>
    );
}

export function BentoFeatures() {
    const [markets, setMarkets] = useState<any[]>([]);

    useEffect(() => {
        async function fetchMarkets() {
            try {
                const response = await fetch('/data/disputes.json');
                const data = await response.json();
                // Map the data to the format expected by the marquee
                const mapped = data.map((m: any) => ({
                    name: m.question,
                    price: m.lockInPrice,
                    status: m.status.charAt(0).toUpperCase() + m.status.slice(1)
                }));
                setMarkets(mapped);
            } catch (error) {
                console.error("Error fetching bento markets:", error);
            }
        }
        fetchMarkets();
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <span className={styles.label}>Features</span>
                <h2 className={styles.title}>Built for autonomous yield</h2>

                <BentoGrid>
                    <BentoCard
                        icon={<Search size={18} />}
                        name="AI Dispute Scanner"
                        description="Continuously monitors 1,000+ Polymarket outcomes for spite disputes in real-time."
                        cta="Learn more"
                        href="#how-it-works"
                        colSpan={1}
                        background={<DotPatternBG />}
                    />
                    <BentoCard
                        icon={<Zap size={18} />}
                        name="Live Bonding Feed"
                        description="Watch the AI agent buy winning shares at a discount across disputed markets."
                        cta="View feed"
                        href="/vault"
                        colSpan={2}
                        background={
                            <div className={styles.marqueeWrap}>
                                {markets.length > 0 ? (
                                    <>
                                        <Marquee speed={25} pauseOnHover>
                                            {markets.map((m, i) => (
                                                <div key={i} className={styles.marketChip}>
                                                    <span className={styles.marketStatus}>{m.status}</span>
                                                    <span className={styles.marketName}>{m.name}</span>
                                                    <span className={styles.marketPrice}>{m.price}</span>
                                                </div>
                                            ))}
                                        </Marquee>
                                        <Marquee speed={35} pauseOnHover direction="right">
                                            {markets.slice().reverse().map((m, i) => (
                                                <div key={i} className={styles.marketChip}>
                                                    <span className={styles.marketStatus}>{m.status}</span>
                                                    <span className={styles.marketName}>{m.name}</span>
                                                    <span className={styles.marketPrice}>{m.price}</span>
                                                </div>
                                            ))}
                                        </Marquee>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(124, 184, 124, 0.2)', fontSize: '14px', textAlign: 'center', padding: '0 16px' }}>
                                        [AGENT] Initializing MoonPay CLI... Scanning Polymarket order books for active UMA disputes...
                                    </div>
                                )}
                            </div>
                        }
                    />
                    <BentoCard
                        icon={<Shield size={18} />}
                        name="Risk Shield"
                        description="AI confidence threshold + 10% stop-loss + 3% conservative failure rate assumption."
                        cta="Learn more"
                        href="#risk-management"
                        colSpan={2}
                        background={
                            <div className={styles.shieldBg}>
                                <div className={styles.shieldRing} />
                                <div className={styles.shieldRing} style={{ animationDelay: "0.5s", width: "100px", height: "100px" }} />
                                <div className={styles.shieldRing} style={{ animationDelay: "1s", width: "140px", height: "140px" }} />
                            </div>
                        }
                    />
                    <BentoCard
                        icon={<Network size={18} />}
                        name="OpenServ API"
                        description="Other AI agents can autonomously hire PolyBond via OpenServ to instantly liquidate their disputed positions."
                        cta="View documentation"
                        href="https://docs.openserv.ai"
                        colSpan={1}
                        background={
                            <div className={styles.shieldBg}>
                                <div className={styles.shieldRing} />
                                <div className={styles.shieldRing} style={{ animationDelay: "0.5s", width: "100px", height: "100px" }} />
                                <div className={styles.shieldRing} style={{ animationDelay: "1s", width: "140px", height: "140px" }} />
                            </div>
                        }
                    />
                </BentoGrid>
            </div>
        </section>
    );
}
