# PolyBond: Instant Payout Infrastructure

This project aims to solve the "spite dispute" capital lockup in decentralized prediction markets (like Polymarket) by building an **Instant Payout** or fast-withdrawal infrastructure.

## 🛠 Registration Details

**IMPORTANT: Keep your API Key secure. Do not commit it to version control.**

- **Agent Name:** Gemini CLI
- **Participant ID:** `6c5ec4cdeedb448c932dd2b70aa7dcad`
- **Team ID (TeamUUID):** `5d57d4de176d445c93234e6566846ab0`
- **On-chain Identity:** [Basescan Transaction](https://basescan.org/tx/0xb7714e6d3fb1ce5fb7fad3e1fec4a8e3048e748041fab074f0cabee5d4cbc142)

---

## 🚀 Submission Guide

Submissions follow a **Draft → Transfer → Publish** workflow via the API (`https://synthesis.devfolio.co`).

### 1. Create Project Draft
**Endpoint:** `POST /projects`
**Auth:** `Authorization: Bearer <YOUR_API_KEY>`

**Required Payload Structure:**
```json
{
  "teamUUID": "5d57d4de176d445c93234e6566846ab0",
  "name": "PolyBond",
  "description": "Fast-withdrawal infrastructure for decentralized prediction markets to bypass capital lockups from spite disputes.",
  "problemStatement": "Losing traders trigger UMA disputes to delay payouts. This traps winning capital for 2-4 days. We provide instant liquidity.",
  "repoURL": "https://github.com/your-repo-url",
  "trackUUIDs": ["<TRACK_UUID>"], 
  "conversationLog": "Full log of our collaboration...",
  "submissionMetadata": {
    "agentFramework": "other",
    "agentFrameworkOther": "Gemini CLI Core",
    "agentHarness": "other",
    "agentHarnessOther": "Gemini CLI",
    "model": "gemini-2.0-flash",
    "skills": ["skill-prediction-market-liquidity"],
    "tools": ["Hardhat", "Vercel", "Ethers.js"],
    "helpfulResources": ["https://uma.xyz/"],
    "intention": "exploring"
  }
}
```

### 2. Required Steps Before Publishing
- **Conversation Log:** We must maintain a log of our brainstorming, pivots, and breakthroughs. This is a judged field.
- **Moltbook Post:** Create an announcement on [Moltbook](https://moltbook.com) and include the URL in `submissionMetadata`.
- **Self-Custody Transfer:** Complete the `/participants/me/transfer/confirm` flow for all team members.
- **Open Source:** The repository must be public.

### 3. Finalize Submission
Only the **Team Admin** can publish the project once the draft is complete and all transfers are confirmed.

**Endpoint:** `POST /projects/:projectUUID/publish`

---

## 📅 Important Dates
- **March 13:** Hackathon Kickoff
- **Deadline:** March 22nd at 11:59 PM PT

## 🏗 Next Steps
1. **Design the Liquidity Provider (LP) logic:** How do we price the risk of an overturned UMA dispute?
2. **Smart Contract Development:** Implement the instant payout vault.
3. **Frontend/Interface:** A dashboard for users to claim instant payouts for a small fee.
