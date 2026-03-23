"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Shield, ExternalLink } from "lucide-react";
import styles from "./vault-actions.module.css";

export function VaultActions() {
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulated — would connect to Gnosis Safe
        alert(`Deposit of $${depositAmount} USDC initiated via Gnosis Safe`);
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Withdrawal of $${withdrawAmount} USDC queued in Gnosis Safe`);
    };

    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {/* Deposit/Withdraw Card */}
                <div className={styles.card}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === "deposit" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("deposit")}
                        >
                            <ArrowDown size={14} />
                            Deposit
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "withdraw" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("withdraw")}
                        >
                            <ArrowUp size={14} />
                            Withdraw
                        </button>
                    </div>

                    {activeTab === "deposit" ? (
                        <form onSubmit={handleDeposit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Amount (USDC)</label>
                                <div className={styles.inputWrap}>
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={styles.input}
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        type="button"
                                        className={styles.maxBtn}
                                        onClick={() => setDepositAmount("10000")}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Current APR</span>
                                <span className={styles.infoValue}>492%</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Estimated daily yield</span>
                                <span className={styles.infoValue}>
                                    ${depositAmount ? (parseFloat(depositAmount) * 0.0135).toFixed(2) : "0.00"}
                                </span>
                            </div>
                            <button type="submit" className={styles.actionBtn}>
                                Deposit to Vault
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleWithdraw} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Amount (USDC)</label>
                                <div className={styles.inputWrap}>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={styles.input}
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        type="button"
                                        className={styles.maxBtn}
                                        onClick={() => setWithdrawAmount("25000")}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Available balance</span>
                                <span className={styles.infoValue}>$25,000.00</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Withdrawal fee</span>
                                <span className={styles.infoValue}>0.3%</span>
                            </div>
                            <button type="submit" className={styles.actionBtn}>
                                Withdraw from Vault
                            </button>
                        </form>
                    )}
                </div>

                {/* Gnosis Safe Card */}
                <div className={styles.card}>
                    <div className={styles.safeHeader}>
                        <Shield size={18} className={styles.safeIcon} />
                        <h3 className={styles.safeTitle}>Gnosis Safe</h3>
                    </div>

                    <div className={styles.safeInfo}>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Safe Address</span>
                            <div className={styles.safeAddress}>
                                <span className={styles.mono}>0x742d...4e3B</span>
                                <ExternalLink size={12} className={styles.linkIcon} />
                            </div>
                        </div>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Signers</span>
                            <span className={styles.safeValue}>2 of 3</span>
                        </div>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Vault Balance</span>
                            <span className={styles.safeValue}>$142,850 USDC</span>
                        </div>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Network</span>
                            <span className={styles.safeValue}>
                                <span className={styles.networkDot} />
                                Base
                            </span>
                        </div>
                    </div>

                    <div className={styles.txQueue}>
                        <h4 className={styles.txQueueTitle}>Transaction Queue</h4>
                        <div className={styles.txItem}>
                            <span className={styles.txLabel}>Bond: Fed Rate Cut</span>
                            <span className={styles.txPending}>Pending (1/2 sigs)</span>
                        </div>
                        <div className={styles.txItem}>
                            <span className={styles.txLabel}>Yield Claim: SpaceX</span>
                            <span className={styles.txConfirmed}>Executed</span>
                        </div>
                        <div className={styles.txItem}>
                            <span className={styles.txLabel}>Bond: BTC $150K</span>
                            <span className={styles.txPending}>Pending (1/2 sigs)</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
