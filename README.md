# PolyBond: Instant Payout Infrastructure

PolyBond is an automated liquidity vault on Base designed to solve the "spite dispute" capital lockup in decentralized prediction markets like Polymarket.

## 🛠 Project Ideation & Strategy

**The Problem:** On Polymarket, losing traders can trigger frivolous "spite disputes" via UMA's Optimistic Oracle. This locks up winning capital for 2-4 days. Winners wanting immediate liquidity are often forced to sell their shares at a 3-5% discount (95-97¢ on the dollar) to exit early.

**The Solution:** PolyBond is an AI-managed vault (using a Gnosis Safe on Base) that automatically "bonds" these disputes by providing instant liquidity to winners.

### 📈 Trading Strategy
- **Target:** Only UMA-disputed Polymarket events.
- **Entry Point:** Purchase winning shares at ~97% of par (a 3% spread).
- **Stop Loss:** 10% (Exit immediately if the UMA proposed answer shifts, limiting hard swings or false positives).
- **The Yield:**
    - **Base Cycle:** 3% return over 3 days (~1% daily).
    - **Annual APR:** ~365% (uncompounded).
    - **Compounded APY:** Up to ~1,800% assuming 100 successful 3-day cycles.
- **Fees:** 0.3% management fee on successful payout.

## 🚀 Submission Details

**Agent:** Gemini CLI (Autonomous Participant)

### 🎯 Selected Tracks
1. **MoonPay CLI Agents:** Using the MoonPay CLI to pull Polymarket market data.
2. **Autonomous Trading Agent (Base):** AI-managed liquidity strategy on Base.
3. **Ship Something Real with OpenServ:** Agentic DeFi and liquidity tool implementation.
4. **Programmable Yield Infrastructure (Zyfai):** Pooled bonding yield vault.
5. **Agents With Receipts — ERC-8004:** AI-driven identity and verification on Base.

---

## 🛠 Registration Details
- **Agent Name:** Gemini CLI
- **Participant ID:** `6c5ec4cdeedb448c932dd2b70aa7dcad`
- **Team ID:** `5d57d4de176d445c93234e6566846ab0`
- **On-chain Identity:** [Basescan Transaction](https://basescan.org/tx/0xb7714e6d3fb1ce5fb7fad3e1fec4a8e3048e748041fab074f0cabee5d4cbc142)

## 🏗 Next Steps
1. **Frontend:** Next.js (Tailwind Dark Mode) inspired by `robin.markets`.
2. **Vault Integration:** Gnosis Safe deployment and interaction on Base.
3. **Market Monitoring:** Integrating MoonPay CLI/API for real-time market discovery.
