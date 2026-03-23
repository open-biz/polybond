# PolyBond: The Yield Layer for Dispute Resolution

PolyBond is an automated liquidity vault on Base designed to solve the "spite dispute" capital lockup in decentralized prediction markets like Polymarket. 

## 🚀 The Hackathon Project

PolyBond factors delayed Polymarket payouts into delta-neutral **492% APR yield**. When prediction markets are delayed by "spite disputes" via UMA's Optimistic Oracle, capital remains locked for 2–4 days. PolyBond's AI agent (using `guv-code`) continuously scans for these disputes, verifies ground truth, and buys frustrated winners' $1.00 shares at a discount (typically 97¢).

### 📐 Mainnet Architecture (Safe + AI)
To achieve both user sovereignty and AI-pooled automation, PolyBond uses **Gnosis Safe** with **Zodiac Modules**:
- **The Vault**: A Gnosis Safe multisig (on Base) holds the pooled USDC.
- **AI Execution (Zodiac)**: The `guv-code` agent address is an enabled **Safe Module**. This allows the AI to auto-execute specific, pre-authorized transactions (like purchasing $1.00 shares at a 97¢ discount) within a strict daily gas and value allowance, without requiring the full multisig signature for routine trades.
- **User Control**: Large withdrawals and critical parameter changes still require the 2/3 human multisig sigs.

---

## 🛠 Submission Details

- **Live URL:** [https://polybond-psi.vercel.app/](https://polybond-psi.vercel.app/)
- **Repo:** [https://github.com/open-biz/polybond](https://github.com/open-biz/polybond)
- **Video Demo:** [Watch Here](https://go.diginomad.xyz/polybond-demo)

### 🎯 Hackathon Tracks & Integrations
1. **MoonPay CLI Agents**: PolyBond's primary **Discovery Layer**. The agent uses MoonPay CLI's `polymarket` skills to scan UMA disputes and `swap/bridge` skills to manage vault liquidity across Base.
2. **Octant (Octant Mechanism Design)**: Commitment to public goods. **10% of the vault's management fees** are automatically streamed to Octant to fund ecosystem-wide market efficiency research.
3. **Ship Something Real with OpenServ**: PolyBond is registered as an **OpenServ Agent Service**, allowing other autonomous agents to "hire" PolyBond to exit their prediction market positions instantly during disputes.
4. **Autonomous Trading Agent**: AI-managed delta-neutral bonding strategy (Buy at 97¢, resolve at 100¢).
5. **Agents With Receipts (ERC-8004)**: Every trade and identity verification is recorded via on-chain receipts on Base.

### 🤖 Agent Metadata
- **AI Model:** `grok-4.20-beta1`
- **Agent Harness:** `guv-code`
- **Harness Other:** `guv-code`
- **Framework:** Next.js 16.2.0 with custom agentic architecture
- **Identity (ERC-8004):** [Basescan Transaction](https://basescan.org/tx/0xb7714e6d3fb1ce5fb7fad3e1fec4a8e3048e748041fab074f0cabee5d4cbc142)

---

## ⛓️ Deployed Contracts (Base Mainnet)
- **PolyBondPool:** [`0xcc74a337623cfbdb85842d95712c3630181696f4`](https://basescan.org/address/0xcc74a337623cfbdb85842d95712c3630181696f4)
- **Deployment Tx:** [`0xece93b5cef5ca5e6ba55c1155754c4b77bbaa975d6ae604f0f6a8a7f5717cdfb`](https://basescan.org/tx/0xece93b5cef5ca5e6ba55c1155754c4b77bbaa975d6ae604f0f6a8a7f5717cdfb)

---

## 🏗 Built With
- **Frontend:** Next.js 16.2.0, Bun, CSS Modules (Nature-inspired Fintech UI)
- **Security:** Gnosis Safe + Zodiac (Multi-sig liquidity management)
- **Infrastructure:** Base Network, UMA Oracle, MoonPay CLI
