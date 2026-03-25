# PolyBond Agent Implementation Plan

This document outlines the architecture and implementation strategy for the PolyBond autonomous agent.

## 1. Core Stack
* **Language:** Python
* **LLM Engine:** Qwen 3.5 122b via NVIDIA API (`https://integrate.api.nvidia.com/v1/chat/completions`)
* **Polymarket Client:** `py-clob-client` (Official Python SDK)
* **Security & Custody:** OpenWallet Python SDK (`open-wallet-standard`)
* **External Context:** MoonPay MCP Server

## 2. Why Python? (Addressing the Rust & CLI Constraints)
While `rs-clob-client` is excellent, using Python is the most feasible and strategic choice for this hackathon:
* **OpenWallet Integration:** The OpenWallet CLI is just a wrapper, but the native Python SDK (`pip install open-wallet-standard`) allows us to enforce programmatic policy boundaries without dealing with bash subprocesses.
* **LLM Integration:** Python is the native language of AI. Integrating the NVIDIA API and handling the JSON payloads is trivial in Python.
* **MoonPay MCP Server:** Consuming a Model Context Protocol (MCP) server in Python is heavily supported by the open-source community.

## 3. The MoonPay MCP Server (Pros, Cons, & Feasibility)
**Should we drop it?** No. It is highly strategic to include it, especially since "MoonPay CLI Agents" is a core hackathon track we are targeting.
* **Pros:** Standardizes how the LLM fetches market data. Instead of writing custom API wrappers, the LLM can just "call the MoonPay tool" to get live crypto prices, verify Polymarket asset addresses, or simulate funding paths. It makes the agent truly autonomous.
* **Cons:** Requires setting up an MCP client in Python to translate the LLM's requests into MCP tool calls.
* **Feasibility:** High. We can use standard MCP Python clients to map the MoonPay server's capabilities directly into the `tools` array of our NVIDIA API payload.

## 4. Agent Architecture & Execution Loop
The Python agent will run as a continuous background process with the following lifecycle:

### Phase A: Market Discovery & Reasoning (The LLM Brain)
1. The script uses the MoonPay MCP Server to gather macroeconomic context (e.g., current crypto prices).
2. The script uses `py-clob-client` to pull a list of Polymarket events that are currently in the "UMA Dispute" phase.
3. It packages this data and sends a prompt to the **NVIDIA Qwen 122b endpoint** (with `enable_thinking: True`).
4. The LLM analyzes the dispute. If it determines the "Spite Dispute" is frivolous and the 97¢ spread is profitable, it returns a structured JSON decision to execute a trade.

### Phase B: Secure Execution (OpenWallet)
1. The Python script takes the LLM's decision and constructs a Polymarket order payload.
2. Instead of signing with a raw private key, it passes the payload and an `OWS_PASSPHRASE` (API Token) to the OpenWallet SDK.
3. OpenWallet checks its `policy.json` (e.g., "Only allow trades on Base, max 100 USDC per day").
4. If the policy passes, OpenWallet signs the transaction and returns the signature.

### Phase C: On-Chain Action
1. The script submits the signed order to the Polymarket CLOB API.
2. The central Gnosis Safe (acting as the AI Execution Layer via Zodiac) executes the trade using the pooled USDC from the `PolyBondPool` smart contract.

## 5. Setup & Secrets
* The NVIDIA API key is securely stored in `.env` and excluded from source control.
* OpenWallet policies will be defined locally to restrict the agent's financial blast radius.
