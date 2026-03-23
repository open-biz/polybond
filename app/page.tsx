import Link from "next/link"
import { DotMatrixBackground } from "@/components/dot-matrix-background"
import { ManifestoCard } from "@/components/manifesto-card"
import { HowItWorks } from "@/components/how-it-works"
import { DisputedMarkets } from "@/components/disputed-markets"
import { VaultDashboard } from "@/components/vault-dashboard"
import { BentoFeatures } from "@/components/bento-features"
import { SafeWalletConnector } from "@/components/safe-wallet-connector"
import { Shield, Lock, TrendingUp } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.main}>
      <DotMatrixBackground />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <svg
              viewBox="0 0 24 24"
              className={styles.logoIcon}
              fill="currentColor"
            >
              <path d="M12 2L8 6H4v4l-4 4 4 4v4h4l4 4 4-4h4v-4l4-4-4-4V6h-4L12 2zm0 4a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
            <span className={styles.logoText}>PolyBond</span>
          </div>
          <div className={styles.headerRight}>
            <SafeWalletConnector />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          The yield layer for
          <br />
          dispute resolution
        </h1>
        <p className={styles.heroSub}>
          Stake and earn yield on prediction market disputes while our AI
          harvests delta-neutral returns.
        </p>

        <div className={styles.heroForm}>
          <Link href="/vault" className={styles.primaryAction}>Open Vault</Link>
        </div>

        <p className={styles.heroPowered}>
          <span className={styles.poweredDot} />
          Powered by UMA &amp; Polymarket • Built on Base
        </p>
      </section>

      {/* Vault Dashboard */}
      <VaultDashboard />

      {/* Manifesto */}
      <section className={styles.section}>
        <ManifestoCard />
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Bento Feature Grid */}
      <BentoFeatures />

      {/* Disputed Markets Feed */}
      <DisputedMarkets />

      {/* Risk Section */}
      <section className={styles.riskSection}>
        <div className={styles.riskContainer}>
          <h2 className={styles.sectionTitle}>Risk Management</h2>
          <div className={styles.riskGrid}>
            <div className={styles.riskCard}>
              <div className={styles.riskIconWrap}>
                <Shield className={styles.riskIcon} />
              </div>
              <div className={styles.riskValue}>AI</div>
              <div className={styles.riskLabel}>Confidence Threshold</div>
              <p className={styles.riskDesc}>
                Only enters positions when AI confidence exceeds strict thresholds
              </p>
            </div>
            <div className={styles.riskCard}>
              <div className={styles.riskIconWrap}>
                <Lock className={styles.riskIcon} />
              </div>
              <div className={styles.riskValue}>10%</div>
              <div className={styles.riskLabel}>Stop Loss</div>
              <p className={styles.riskDesc}>
                Automatic exit if UMA oracle shows unexpected movement
              </p>
            </div>
            <div className={styles.riskCard}>
              <div className={styles.riskIconWrap}>
                <TrendingUp className={styles.riskIcon} />
              </div>
              <div className={styles.riskValue}>3%</div>
              <div className={styles.riskLabel}>Conservative Failure Rate</div>
              <p className={styles.riskDesc}>
                Built-in assumption for edge case scenarios
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to earn yield?</h2>
        <p className={styles.ctaSub}>
          Enter the PolyBond vault to start earning delta-neutral yield today. No prediction
          market experience required.
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
            2026 PolyBond. Delta-neutral yield from prediction markets.
          </p>
        </div>
      </footer>
    </main>
  )
}
