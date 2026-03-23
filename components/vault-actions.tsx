"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Shield, ExternalLink } from "lucide-react";
import { parseUnits, encodeFunctionData } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Safe from "@safe-global/protocol-kit";
import { useSafe } from "./safe-context";
import { USDC_ADDRESS, POLYBOND_STRATEGY_ADDRESS } from "@/config/contracts";
import { ERC20_ABI, POLYBOND_POOL_ABI } from "@/config/abi";
import styles from "./vault-actions.module.css";

export function VaultActions() {
    const { address, connector } = useAccount();
    const { data: walletClient } = useWalletClient();
    const { openConnectModal } = useConnectModal();
    const { safeAddress, setSafeAddress } = useSafe();
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
    const [isPending, setIsPending] = useState(false);
    const [isDeployingSafe, setIsDeployingSafe] = useState(false);

    const deploySafe = async () => {
        if (!address || !connector || !walletClient) return;

        try {
            setIsDeployingSafe(true);

            const safeAccountConfig = {
                owners: [address],
                threshold: 1,
            };

            const predictedSafe = {
                safeAccountConfig,
            };

            const provider = await connector.getProvider();

            const protocolKit = await Safe.init({
                provider: provider as any,
                signer: address,
                predictedSafe,
            });

            const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();

            const txHash = await walletClient.sendTransaction({
                to: deploymentTransaction.to as `0x${string}`,
                value: BigInt(deploymentTransaction.value),
                data: deploymentTransaction.data as `0x${string}`,
            });

            console.log("Safe deployment transaction sent:", txHash);

            const deployedAddress = await protocolKit.getAddress();
            setSafeAddress(deployedAddress);
        } catch (error) {
            console.error("Error deploying safe:", error);
            alert("Failed to deploy Safe. See console for details.");
        } finally {
            setIsDeployingSafe(false);
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!address || !safeAddress || !connector) {
            alert("Please connect your wallet and create a Safe Vault first.");
            return;
        }

        if (!depositAmount || isNaN(Number(depositAmount))) return;

        try {
            setIsPending(true);
            const provider = await connector.getProvider();
            
            const safeProtocolKit = await Safe.init({
                provider: provider as any,
                signer: address,
                safeAddress
            });

            // Transaction 1: Approve the PolyBond Pool to spend USDC
            const approveData = encodeFunctionData({
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [POLYBOND_STRATEGY_ADDRESS as `0x${string}`, parseUnits(depositAmount, 6)]
            });

            // Transaction 2: Deposit USDC into the PolyBond Pool
            const depositData = encodeFunctionData({
                abi: POLYBOND_POOL_ABI,
                functionName: 'deposit',
                args: [parseUnits(depositAmount, 6)]
            });

            const safeTransactionData = [
                {
                    to: USDC_ADDRESS,
                    data: approveData,
                    value: "0"
                },
                {
                    to: POLYBOND_STRATEGY_ADDRESS,
                    data: depositData,
                    value: "0"
                }
            ];

            const safeTransaction = await safeProtocolKit.createTransaction({ transactions: safeTransactionData });
            
            // Execute the transaction directly from the 1/1 Safe
            const txResponse = await safeProtocolKit.executeTransaction(safeTransaction);
            if (txResponse.transactionResponse && (txResponse.transactionResponse as any).wait) {
                await (txResponse.transactionResponse as any).wait();
            }

            alert(`Successfully deposited $${depositAmount} USDC into the PolyBond Pool!`);
            setDepositAmount("");

        } catch (error) {
            console.error("Deposit error:", error);
            alert("Deposit failed. Check console. Make sure your Safe has enough USDC and ETH for gas.");
        } finally {
            setIsPending(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!address || !safeAddress || !connector) {
            alert("Please connect your wallet and create a Safe Vault first.");
            return;
        }

        if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;

        try {
            setIsPending(true);
            const provider = await connector.getProvider();
            
            const safeProtocolKit = await Safe.init({
                provider: provider as any,
                signer: address,
                safeAddress
            });

            const withdrawData = encodeFunctionData({
                abi: POLYBOND_POOL_ABI,
                functionName: 'withdraw',
                args: [parseUnits(withdrawAmount, 6)] // Assuming 1 share = 1 USDC initially
            });

            const safeTransactionData = [{
                to: POLYBOND_STRATEGY_ADDRESS,
                data: withdrawData,
                value: "0"
            }];

            const safeTransaction = await safeProtocolKit.createTransaction({ transactions: safeTransactionData });
            const txResponse = await safeProtocolKit.executeTransaction(safeTransaction);
            if (txResponse.transactionResponse && (txResponse.transactionResponse as any).wait) {
                await (txResponse.transactionResponse as any).wait();
            }

            alert(`Successfully withdrew shares from the PolyBond Pool!`);
            setWithdrawAmount("");

        } catch (error) {
            console.error("Withdraw error:", error);
            alert("Withdraw failed. See console for details.");
        } finally {
            setIsPending(false);
        }
    };

    const renderActionButton = (actionType: "deposit" | "withdraw") => {
        if (!address) {
            return (
                <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => openConnectModal?.()}
                >
                    Connect Wallet
                </button>
            );
        }
        if (!safeAddress) {
            return (
                <button 
                    type="button" 
                    className={styles.actionBtn} 
                    onClick={deploySafe}
                    disabled={isDeployingSafe || !walletClient}
                >
                    {isDeployingSafe ? "Deploying Vault..." : "Setup Safe Vault"}
                </button>
            );
        }
        return (
            <button type="submit" className={styles.actionBtn} disabled={isPending}>
                {isPending ? "Executing..." : actionType === "deposit" ? "Deposit to Vault" : "Withdraw from Vault"}
            </button>
        );
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
                                        onClick={() => setDepositAmount("0")}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Current APR</span>
                                <span className={styles.infoValue}>0%</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Estimated daily yield</span>
                                <span className={styles.infoValue}>
                                    $0.00
                                </span>
                            </div>
                            {renderActionButton("deposit")}
                        </form>
                    ) : (
                        <form onSubmit={handleWithdraw} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Amount (Shares)</label>
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
                                        onClick={() => setWithdrawAmount("0")}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Available shares</span>
                                <span className={styles.infoValue}>0.00</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Withdrawal fee</span>
                                <span className={styles.infoValue}>0.3%</span>
                            </div>
                            {renderActionButton("withdraw")}
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
                                <span className={styles.mono}>
                                    {safeAddress ? `${safeAddress.slice(0, 6)}...${safeAddress.slice(-4)}` : "Not Created"}
                                </span>
                                {safeAddress && <ExternalLink size={12} className={styles.linkIcon} />}
                            </div>
                        </div>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Signers</span>
                            <span className={styles.safeValue}>{safeAddress ? "1 of 1" : "N/A"}</span>
                        </div>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Network</span>
                            <span className={styles.safeValue}>
                                <span className={styles.networkDot} />
                                Base
                            </span>
                        </div>
                    </div>

                    {safeAddress && (
                        <div className={styles.txQueue}>
                            <h4 className={styles.txQueueTitle}>Status</h4>
                            <div className={styles.txItem}>
                                <span className={styles.txLabel}>Safe Account</span>
                                <span className={styles.txConfirmed}>Active</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}