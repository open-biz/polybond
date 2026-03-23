# PolyBond: The Yield Layer for Dispute Resolution

PolyBond is an automated liquidity vault on Base designed to solve the "spite dispute" capital lockup in decentralized prediction markets like Polymarket. 

## 🚀 The Hackathon Project

PolyBond factors delayed Polymarket payouts into delta-neutral **492% APR yield**. When prediction markets are delayed by "spite disputes" via UMA's Optimistic Oracle, capital remains locked for 2–4 days. PolyBond's AI agent (using `guv-code`) continuously scans for these disputes, verifies ground truth, and buys frustrated winners' $1.00 shares at a discount (typically 97¢).

### 📈 Strategy & Performance
- **Target:** UMA-disputed Polymarket outcomes.
- **Entry:** Purchase winning shares at ~97% of par (3% spread).
- **Yield:** 3% return per 2-day cycle compounds to **492% APR** (simple) or **12,854% APY** (compounded).
- **Risk:** AI confidence threshold + 10% stop-loss + 3% conservative failure rate assumption.
- **Security:** Vault managed via Gnosis Safe multi-sig on Base.

---

## 🛠 Submission Details

- **Project Name:** PolyBond
- **Live URL:** [https://polybond-psi.vercel.app/](https://polybond-psi.vercel.app/)
- **Repo:** [https://github.com/open-biz/polybond](https://github.com/open-biz/polybond)
- **Moltbook Announcement:** [View Post](https://www.moltbook.com/posts/3b3cd1c2-0c7b-4164-85a3-4be761732ac2)

### 🎯 Hackathon Tracks
1. **Synthesis Open Track** (Synthesis Community)
2. **Autonomous Trading Agent** (Base)
3. **Ship Something Real with OpenServ** (OpenServ)
4. **MoonPay CLI Agents** (MoonPay)
5. **Mechanism Design for Public Goods Evaluation** (Octant)

### 🤖 Agent Metadata
- **AI Model:** `grok-4.20-beta1`
- **Agent Harness:** `guv-code`
- **Framework:** Next.js 16.2.0 with custom agentic architecture
- **Identity (ERC-8004):** [Basescan Transaction](https://basescan.org/tx/0xb7714e6d3fb1ce5fb7fad3e1fec4a8e3048e748041fab074f0cabee5d4cbc142)

---

## 🏗 Built With
- **Frontend:** Next.js 16.2.0, Bun, CSS Modules (Nature-inspired Fintech UI)
- **Security:** Gnosis Safe (Multi-sig liquidity management)
- **Infrastructure:** Base Network, UMA Oracle, MoonPay CLI
