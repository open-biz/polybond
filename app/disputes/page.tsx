"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DotMatrixBackground } from "@/components/dot-matrix-background";
import { Search, Filter, ShieldCheck, Zap, Info, ExternalLink } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./disputes.module.css";

interface DisputedMarket {
    id: string;
    slug?: string;
    question: string;
    category: string;
    volume: string;
    lockInPrice: string;
    status: "bonding" | "resolved" | "monitoring" | "disputed";
    timeAgo: string;
}

const STATUS_CONFIG = {
    bonding: { label: "Bonding", className: styles.statusBonding },
    resolved: { label: "Resolved", className: styles.statusResolved },
    monitoring: { label: "Monitoring", className: styles.statusMonitoring },
    disputed: { label: "Disputed", className: styles.statusDisputed },
};

export default function DisputesPage() {
    const [markets, setMarkets] = useState<DisputedMarket[]>([]);
    const [filteredMarkets, setFilteredMarkets] = useState<DisputedMarket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    useEffect(() => {
        async function fetchDisputes() {
            try {
                const response = await fetch('/data/disputes.json');
                const data = await response.json();
                setMarkets(data);
                setFilteredMarkets(data);
            } catch (error) {
                console.error("Error fetching disputes:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDisputes();
    }, []);

    useEffect(() => {
        let filtered = markets;
        if (activeFilter !== "all") {
            filtered = filtered.filter(m => m.status === activeFilter);
        }
        if (searchQuery) {
            filtered = filtered.filter(m => 
                m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredMarkets(filtered);
    }, [searchQuery, activeFilter, markets]);

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
                        <Link href="/vault" className={styles.navLink}>Vault</Link>
                        <Link href="/disputes" className={styles.navLinkActive}>Disputes</Link>
                        <Link href="/#disputes" className={styles.navLink}>Feed</Link>
                    </nav>

                    <div className={styles.headerRight}>
                        <ConnectButton showBalance={false} />
                    </div>
                </div>
            </header>
            
            <header className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.badge}>Live Alpha Feed</div>
                    <h1 className={styles.title}>Active UMA Disputes</h1>
                    <p className={styles.subtitle}>
                        Real-time tracking of challenged Polymarket outcomes being resolved by the UMA Oracle.
                    </p>
                </div>
            </header>

            <section className={styles.strategySection}>
                <div className={styles.strategyGrid}>
                    <div className={styles.strategyCard}>
                        <div className={styles.strategyIcon}>
                            <Zap size={20} />
                        </div>
                        <h3>AI Strategy</h3>
                        <p>Our agent identifies "spite disputes" where the outcome is factually certain but challenged to delay payout. We buy the "truth" at a discount.</p>
                    </div>
                    <div className={styles.strategyCard}>
                        <div className={styles.strategyIcon}>
                            <ShieldCheck size={20} />
                        </div>
                        <h3>Diversification</h3>
                        <p>Capital is spread across multiple disputes to mitigate individual resolution risks and maximize aggregate yield stability.</p>
                    </div>
                    <div className={styles.strategyCard}>
                        <div className={styles.strategyIcon}>
                            <Info size={20} />
                        </div>
                        <h3>Consensus Yield</h3>
                        <p>We leverage UMA's Optimistic Oracle consensus. By aligning with the majority truth, we harvest the premium left by frivolous disputers.</p>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by question or category..." 
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterTabs}>
                        {["all", "disputed", "bonding", "monitoring"].map(filter => (
                            <button 
                                key={filter}
                                className={`${styles.filterTab} ${activeFilter === filter ? styles.activeTab : ""}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Market Question</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Volume</th>
                                <th>UMA Bond</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className={styles.loadingCell}>
                                        Initializing Alpha Feed...
                                    </td>
                                </tr>
                            ) : filteredMarkets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>
                                        No disputes match your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredMarkets.map((market) => (
                                    <tr key={market.id}>
                                        <td>
                                            <div className={styles.questionCell}>
                                                {market.question}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${STATUS_CONFIG[market.status]?.className}`}>
                                                {market.status}
                                            </span>
                                        </td>
                                        <td className={styles.dimText}>{market.category}</td>
                                        <td className={styles.priceText}>{market.volume}</td>
                                        <td className={styles.priceText}>{market.lockInPrice}</td>
                                        <td>
                                            <a 
                                                href={`https://polymarket.com/market/${market.slug || market.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.viewBtn}
                                            >
                                                View <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
