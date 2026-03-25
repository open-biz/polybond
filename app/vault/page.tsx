import { DotMatrixBackground } from "@/components/dot-matrix-background";
import { VaultContent } from "@/components/vault-content";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "./vault.module.css";

export const metadata = {
    title: "PolyBond Vault — Manage Your Yield",
    description:
        "Deposit, withdraw, and monitor your yield from AI-powered dispute resolution on Polymarket.",
};

export default function VaultPage() {
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
                        <Link href="/vault" className={styles.navLinkActive}>Vault</Link>
                        <Link href="/disputes" className={styles.navLink}>Disputes</Link>
                        <Link href="/#disputes" className={styles.navLink}>Feed</Link>
                    </nav>

                    <div className={styles.headerRight}>
                        <ConnectButton showBalance={false} />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className={styles.content}>
                <VaultContent />
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>
                    Vault powered by Gnosis Safe • All funds are held in a multi-sig
                    smart contract on Base
                </p>
            </footer>
        </main>
    );
}
