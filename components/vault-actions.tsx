"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Shield, ExternalLink, Wallet, Info, X, AlertTriangle } from "lucide-react";
import { parseUnits, encodeFunctionData, formatUnits } from "viem";
import { useAccount, useWalletClient, usePublicClient, useBalance, useReadContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Safe from "@safe-global/protocol-kit";
import { useSafe } from "./safe-context";
import { USDC_ADDRESS, POLYBOND_STRATEGY_ADDRESS, CHAIN_ID } from "@/config/contracts";
import { ERC20_ABI, POLYBOND_POOL_ABI } from "@/config/abi";
import styles from "./vault-actions.module.css";

export function VaultActions() {
    const { address, connector } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { openConnectModal } = useConnectModal();
    const { safeAddress, setSafeAddress } = useSafe();
    
    // Fetch ETH balance (for gas)
    const { data: ethBalance, isLoading: isLoadingEth } = useBalance({
        address,
        chainId: CHAIN_ID,
    });

    // Fetch USDC balance for the user's connected wallet
    const { data: usdcBalance, isLoading: isLoadingUsdc } = useBalance({
        address,
        token: USDC_ADDRESS as `0x${string}`,
        chainId: CHAIN_ID,
    });

    // Fetch user's vault shares
    const { data: sharesData } = useReadContract({
        address: POLYBOND_STRATEGY_ADDRESS as `0x${string}`,
        abi: POLYBOND_POOL_ABI,
        functionName: "shares",
        args: [address as `0x${string}`],
        chainId: CHAIN_ID,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        }
    });

    // Global Stats state
    const [globalStats, setGlobalStats] = useState({ apr: 492 });

    useEffect(() => {
        fetch('/data/global-stats.json')
            .then(res => res.json())
            .then(data => {
                if (data.baseYield) setGlobalStats({ apr: data.baseYield });
            })
            .catch(err => console.error("Failed to load global stats:", err));
    }, []);

    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
    const [isPending, setIsPending] = useState(false);
    const [isDeployingSafe, setIsDeployingSafe] = useState(false);

    // Modal State
    const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; type: "error" | "success" | "info" }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info"
    });

    const showModal = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
        setModal({ isOpen: true, title, message, type });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

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
        } catch (error: any) {
            console.error("Error deploying safe:", error);
            if (error?.message?.includes("User rejected")) {
                 showModal("Transaction Rejected", "You cancelled the Safe deployment request in your wallet.", "error");
            } else {
                 showModal("Deployment Failed", "Failed to deploy Safe. Check console for details.", "error");
            }
        } finally {
            setIsDeployingSafe(false);
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!address || !walletClient || !publicClient) {
            showModal("Wallet Disconnected", "Please connect your wallet first.", "error");
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

            showModal("Deposit Successful", `Successfully deposited $${depositAmount} USDC into the PolyBond Pool!`, "success");
            setDepositAmount("");

        } catch (error: any) {
            console.error("Deposit error:", error);
            if (error?.message?.includes('User rejected') || error?.message?.includes('denied transaction')) {
                showModal("Transaction Rejected", "You cancelled the deposit request in your wallet.", "error");
            } else if (error?.message?.includes('insufficient funds') || error?.message?.includes('exceeds balance')) {
                showModal("Insufficient Funds", `Transaction failed: Insufficient USDC balance. Your wallet has ${usdcBalance?.formatted || "0"} USDC.`, "error");
            } else {
                showModal("Deposit Failed", "Ensure you have enough USDC and ETH for gas fees.", "error");
            }
        } finally {
            setIsPending(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!address || !walletClient || !publicClient) {
            showModal("Wallet Disconnected", "Please connect your wallet first.", "error");
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

            showModal("Withdrawal Successful", `Successfully withdrew shares from the PolyBond Pool!`, "success");
            setWithdrawAmount("");

        } catch (error: any) {
            console.error("Withdraw error:", error);
             if (error?.message?.includes('User rejected') || error?.message?.includes('denied transaction')) {
                showModal("Transaction Rejected", "You cancelled the withdrawal request in your wallet.", "error");
            } else {
                showModal("Withdrawal Failed", "Check your wallet or the console for details.", "error");
            }
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

    // Calculate daily yield based on current APR
    const dailyYieldValue = depositAmount ? (Number(depositAmount) * (globalStats.apr / 100) / 365).toFixed(2) : "0.00";

    return (
        <section className={styles.section} style={{ position: 'relative' }}>
            {/* Modal Overlay */}
            {modal.isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    borderRadius: '12px'
                }}>
                    <div style={{
                        background: 'var(--card-bg, #1a1a1a)',
                        border: `1px solid ${modal.type === 'error' ? 'rgba(255, 69, 58, 0.3)' : modal.type === 'success' ? 'rgba(124, 184, 124, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '12px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: modal.type === 'error' ? '#FF453A' : modal.type === 'success' ? '#7cb87c' : 'white' }}>
                                {modal.type === 'error' && <AlertTriangle size={20} />}
                                {modal.type === 'success' && <Shield size={20} />}
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{modal.title}</h3>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--foreground)', opacity: 0.5, cursor: 'pointer' }}>
                                <X size={18} />
                            </button>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                            {modal.message}
                        </p>
                        <button 
                            onClick={closeModal}
                            style={{
                                marginTop: '24px',
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                background: modal.type === 'error' ? 'rgba(255, 69, 58, 0.1)' : 'rgba(124, 184, 124, 0.1)',
                                color: modal.type === 'error' ? '#FF453A' : '#7cb87c',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

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

                    {/* Wallet Balances Display */}
                    {address && (
                        <div className={styles.walletBalanceRow}>
                            <div className={styles.walletBalanceHeader}>
                                <Wallet size={16} color="var(--primary)" />
                                <span className={styles.walletBalanceLabel}>
                                    Your Wallet (Base)
                                </span>
                            </div>
                            <div className={styles.walletBalanceGrid}>
                                <div className={styles.balanceItem}>
                                    <span className={styles.balanceValue}>
                                        {isLoadingUsdc ? "..." : (usdcBalance?.formatted ? Number(usdcBalance.formatted).toFixed(2) : "0.00")}
                                        <span className={styles.balanceUnit}>USDC</span>
                                    </span>
                                </div>
                                <div className={styles.balanceItem}>
                                    <span className={styles.balanceValue}>
                                        {isLoadingEth ? "..." : (ethBalance?.formatted ? Number(ethBalance.formatted).toFixed(4) : "0.0000")}
                                        <span className={styles.balanceUnit}>ETH</span>
                                    </span>
                                </div>
                            </div>
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
                                            if (usdcBalance?.formatted) {
                                                setDepositAmount(usdcBalance.formatted);
                                            }
                                        }}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Agent APR</span>
                                <span className={styles.infoValue}>{globalStats.apr}%</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Estimated daily yield</span>
                                <span className={styles.infoValue}>
                                    ${dailyYieldValue}
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
                                        onClick={() => {
                                            if (sharesData !== undefined) {
                                                setWithdrawAmount(formatUnits(sharesData as bigint, 6));
                                            }
                                        }}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Available shares</span>
                                <span className={styles.infoValue}>{sharesData !== undefined ? Number(formatUnits(sharesData as bigint, 6)).toFixed(2) : "0.00"}</span>
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

                    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '12px', color: 'var(--foreground)', opacity: 0.8, margin: 0, lineHeight: 1.4 }}>
                            <strong>Architecture Note:</strong> When you deposit, your USDC goes into the PolyBond Pool smart contract (yielding shares). This Gnosis Safe is the <em>AI Execution Layer</em>—it acts via Zodiac modules to trigger arbitrage trades using the pool's capital without custodying it.
                        </p>
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
