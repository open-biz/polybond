"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Shield, ExternalLink, Wallet } from "lucide-react";
import { parseUnits, encodeFunctionData, formatUnits } from "viem";
import { useAccount, useWalletClient, usePublicClient, useBalance } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Safe from "@safe-global/protocol-kit";
import { useSafe } from "./safe-context";
import { USDC_ADDRESS, POLYBOND_STRATEGY_ADDRESS } from "@/config/contracts";
import { ERC20_ABI, POLYBOND_POOL_ABI } from "@/config/abi";
import styles from "./vault-actions.module.css";

export function VaultActions() {
    const { address, connector } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { openConnectModal } = useConnectModal();
    const { safeAddress, setSafeAddress } = useSafe();
    
    // Fetch USDC balance for the user's connected wallet
    const { data: usdcBalance } = useBalance({
        address,
        token: USDC_ADDRESS as `0x${string}`,
    });

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

            const isDeployed = await protocolKit.isSafeDeployed();
            if (isDeployed) {
                const deployedAddress = await protocolKit.getAddress();
                setSafeAddress(deployedAddress);
                return;
            }

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
        
        if (!address || !walletClient || !publicClient) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!depositAmount || isNaN(Number(depositAmount))) return;

        try {
            setIsPending(true);
            
            const amountInWei = parseUnits(depositAmount, 6);

            // 1. Approve USDC transfer
            const approveData = encodeFunctionData({
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [POLYBOND_STRATEGY_ADDRESS as `0x${string}`, amountInWei]
            });

            const approveTxHash = await walletClient.sendTransaction({
                to: USDC_ADDRESS as `0x${string}`,
                data: approveData,
            });
            
            // Wait for approval to be mined
            await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

            // 2. Deposit into PolyBond Pool
            const depositData = encodeFunctionData({
                abi: POLYBOND_POOL_ABI,
                functionName: 'deposit',
                args: [amountInWei]
            });

            const depositTxHash = await walletClient.sendTransaction({
                to: POLYBOND_STRATEGY_ADDRESS as `0x${string}`,
                data: depositData,
            });

            await publicClient.waitForTransactionReceipt({ hash: depositTxHash });

            alert(`Successfully deposited $${depositAmount} USDC into the PolyBond Pool!`);
            setDepositAmount("");

        } catch (error: any) {
            console.error("Deposit error:", error);
            // Catch common errors (e.g., insufficient funds) and show a better message
            if (error?.message?.includes('insufficient funds') || error?.message?.includes('exceeds balance')) {
                alert(`Transaction failed: Insufficient USDC balance. Your wallet has ${usdcBalance ? formatUnits(usdcBalance.value, 6) : "0"} USDC.`);
            } else {
                alert("Deposit failed. Ensure you have enough USDC and ETH for gas fees.");
            }
        } finally {
            setIsPending(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!address || !walletClient || !publicClient) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;

        try {
            setIsPending(true);
            
            const amountInWei = parseUnits(withdrawAmount, 6);

            const withdrawData = encodeFunctionData({
                abi: POLYBOND_POOL_ABI,
                functionName: 'withdraw',
                args: [amountInWei] 
            });

            const withdrawTxHash = await walletClient.sendTransaction({
                to: POLYBOND_STRATEGY_ADDRESS as `0x${string}`,
                data: withdrawData,
            });

            await publicClient.waitForTransactionReceipt({ hash: withdrawTxHash });

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

                    {/* Wallet Balance Display */}
                    {address && usdcBalance && (
                        <div className={styles.walletBalanceRow} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '16px' }}>
                            <Wallet size={16} color="var(--primary)" />
                            <span style={{ fontSize: '14px', color: 'var(--foreground)' }}>
                                Wallet Balance: <strong style={{ color: 'var(--primary)' }}>{formatUnits(usdcBalance.value, 6)} USDC</strong>
                            </span>
                        </div>
                    )}

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
                                        onClick={() => {
                                            if (usdcBalance) {
                                                setDepositAmount(formatUnits(usdcBalance.value, 6));
                                            }
                                        }}
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
                                    ${depositAmount ? (Number(depositAmount) * 0.013).toFixed(2) : "0.00"}
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
                        <h3 className={styles.safeTitle}>AI Execution Safe (Zodiac)</h3>
                    </div>

                    <div className={styles.safeInfo}>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>Safe Address</span>
                            {safeAddress ? (
                                <a 
                                    href={`https://app.safe.global/home?safe=base:${safeAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.safeAddress}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <span className={styles.mono}>
                                        {safeAddress.slice(0, 6)}...{safeAddress.slice(-4)}
                                    </span>
                                    <ExternalLink size={12} className={styles.linkIcon} />
                                </a>
                            ) : (
                                <div className={styles.safeAddress}>
                                    <span className={styles.mono}>Not Created</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.safeRow}>
                            <span className={styles.safeLabel}>AI Module</span>
                            <span className={styles.safeValue}>{safeAddress ? "Enabled" : "N/A"}</span>
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