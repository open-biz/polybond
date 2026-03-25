# PolyBond Agent Skills & Repo Guide

PolyBond is an autonomous yield layer for Polymarket dispute resolution. This guide defines how AI agents can interact with the protocol, our strategy, and the technical architecture.

## 🏗 Repository Structure

```
polybond/
├── agent/                # Autonomous Python Agent (The "Brain")
│   ├── main.py           # Core execution loop & discovery
│   ├── uma_client.py     # UMA/Polymarket market discovery
│   ├── llm_client.py     # NVIDIA Qwen 3.5 122b reasoning
│   ├── openwallet_client.py # OWS secure signing
│   └── blockchain_client.py # Base network contract interactions
├── contracts/            # Smart Contracts (Base Network)
│   └── PolyBondPool.sol  # Yield-bearing vault & arbitrage execution
├── agent-skills/         # Detailed reference documentation for agents
└── public/data/          # Live state synced by the agent (JSON)
```

## 🏦 Smart Contract (Base Network)

**Contract:** `PolyBondPool`
**Address:** `0xcc74a337623cfbdb85842d95712c3630181696f4`

### Key Functions for Agents:
- `executeArbitrage(marketId, conditionId, assetId, amountToSpend, ctfExchange)`: Deploys vault USDC into a specific Polymarket outcome token.
- `resolveTrade(marketId, initialInvestment, returnAmount)`: Records the settled arbitrage and returns profit to the pool.
- `totalPoolValue()`: Returns the sum of idle USDC + active deployed capital.

## 🤖 AI Agent Strategy

The agent scans for **"Spite Disputes"**:
1. **Discovery:** Finds markets with `uma_resolution_status = "disputed"` via Gamma API.
2. **Analysis:** LLM cross-references market rules with real-world outcome data.
3. **Arb Calculation:** Identifies if shares are trading at a discount (e.g. 98.4¢ or 99¢ for a guaranteed $1.00 payout). The vault purchases winning shares from frustrated traders at this discount. Winners get instant liquidity instead of waiting 2–4 days for UMA to resolve the dispute.
4. **Resolution:** When the dispute naturally resolves, the vault redeems each share for its full $1.00 value. The spread is pure profit — annualizing to ~184% or up to 297% Base APR depending on the entry price.
5. **Execution:** Signs orders via OpenWallet and notifies the `PolyBondPool` on Base.

## 🛡️ Risk Management

The agent operates strictly within the following risk parameters:
- **AI Confidence Threshold:** Only enters positions when AI confidence exceeds strict, pre-defined thresholds based on rigorous LLM consensus validation of real-world outcomes.
- **10% Stop Loss:** Automatic exit if the UMA Optimistic Oracle shows unexpected movement or if the market sentiment reverses severely against the position.
- **3% Conservative Failure Rate:** A built-in assumption for edge case scenarios (e.g., UMA resolves incorrectly or a smart contract issue occurs) that factors into the overarching Kelly criterion sizing.

## 🔗 Important Links & APIs

| Service | Endpoint |
|---------|----------|
| Polymarket Gamma | `https://gamma-api.polymarket.com` |
| Polymarket CLOB | `https://clob.polymarket.com` |
| UMA OOv3 Subgraph | `https://api.thegraph.com/subgraphs/name/uma-protocol/polygon-optimistic-oracle-v3` |
| MoonPay MCP | Standard MCP protocol for macro/price context |

## 🛠 Interaction Flow for Agents

1. **Read Data:** Read `public/data/disputes.json` to see currently identified alpha.
2. **Verify Reasoning:** Call `agent/llm_client.py` with market metadata to get an arb verdict.
3. **Execute:** If verdict is `EXECUTE`, use `agent/openwallet_client.py` to sign the EIP-712 order.
4. **On-Chain:** Call `executeArbitrage` on the Base contract using `BlockchainClient`.
5. **Receipts:** Provide an on-chain ERC-8004 receipt to prove agent execution and save it to `public/data/positions.json`.

For deep technical details on Polymarket trading, authentication, and order patterns, refer to the files in the `/agent-skills` directory.
