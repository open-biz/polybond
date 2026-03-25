from web3 import Web3
import json
from .config import Config

class BlockchainClient:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(Config.BASE_RPC_URL))
        self.contract_address = Config.POLYBOND_POOL_ADDRESS
        self.private_key = Config.AGENT_PRIVATE_KEY
        
        # PolyBondPool ABI (Minimal for the needed functions)
        self.abi = [
            {
                "inputs": [
                    {"internalType": "string", "name": "marketId", "type": "string"},
                    {"internalType": "bytes32", "name": "conditionId", "type": "bytes32"},
                    {"internalType": "uint256", "name": "assetId", "type": "uint256"},
                    {"internalType": "uint256", "name": "amountToSpend", "type": "uint256"},
                    {"internalType": "address", "name": "ctfExchange", "type": "address"}
                ],
                "name": "executeArbitrage",
                "outputs": [],
                "stateMutability": "external",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "string", "name": "marketId", "type": "string"},
                    {"internalType": "uint256", "name": "initialInvestment", "type": "uint256"},
                    {"internalType": "uint256", "name": "returnAmount", "type": "uint256"}
                ],
                "name": "resolveTrade",
                "outputs": [],
                "stateMutability": "external",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalPoolValue",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        
        if self.contract_address:
            self.contract = self.w3.eth.contract(address=Web3.to_checksum_address(self.contract_address), abi=self.abi)
        else:
            self.contract = None

    def get_pool_value(self):
        if not self.contract: return 0
        try:
            return self.contract.functions.totalPoolValue().call()
        except Exception as e:
            print(f"Error calling totalPoolValue: {e}")
            return 0

    def execute_arbitrage(self, market_id, condition_id, asset_id, amount_usdc):
        """
        Reports the start of an arbitrage trade to the PolyBondPool contract.
        In a full setup, this would be a signed transaction from the agent.
        """
        print(f"[On-Chain] Recording arbitrage for {market_id} on PolyBondPool...")
        # If we had a real private key, we would build, sign and send the transaction here
        # For simulation/hackathon, we'll log the intention
        return True

    def resolve_trade(self, market_id, initial_investment, return_amount):
        """
        Reports the resolution of an arbitrage trade.
        """
        print(f"[On-Chain] Resolving trade for {market_id}. Return: {return_amount} USDC")
        return True
